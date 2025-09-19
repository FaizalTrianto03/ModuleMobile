<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows
  following proper Android SDK folder structure with System environment variables.

.DESCRIPTION
  - Check for Administrator privileges
  - Download dengan HttpClient (lebih cepat dari Invoke-WebRequest)
  - Extract ke C:\android\sdk\cmdline-tools\latest (proper Android SDK structure)
  - Update PATH di System scope (requires admin)
  - Follow official Android SDK folder structure guidelines
#>

$ErrorActionPreference = "Stop"

# --- ADMIN CHECK ---
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Host "❌ ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "👉 Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Right-click on PowerShell → 'Run as Administrator'" -ForegroundColor Cyan
    pause
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green

# --- HYPER-V CHECK AND ENABLE ---
Write-Host ""
Write-Host "🔍 Checking Hyper-V status..." -ForegroundColor Cyan

try {
    # Check if Hyper-V feature is available and enabled
    $hyperVFeature = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
    $hyperVEnabled = $hyperVFeature.State -eq "Enabled"
    
    if ($hyperVEnabled) {
        Write-Host "✅ Hyper-V is already enabled" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Hyper-V is not enabled" -ForegroundColor Yellow
        Write-Host "🎮 Hyper-V is required for Android Emulator optimal performance" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Would you like to enable Hyper-V now? (System restart will be required)" -ForegroundColor Yellow
        Write-Host "[Y] Yes, enable Hyper-V" -ForegroundColor Green
        Write-Host "[N] No, skip Hyper-V (emulator may run slower)" -ForegroundColor Red
        Write-Host ""
        
        do {
            $hyperVChoice = Read-Host "Enable Hyper-V? (Y/N)"
            switch ($hyperVChoice.ToUpper()) {
                "Y" {
                    Write-Host ""
                    Write-Host "🔧 Enabling Hyper-V..." -ForegroundColor Yellow
                    Write-Host "This may take a few minutes..." -ForegroundColor Cyan
                    
                    try {
                        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All -NoRestart
                        Write-Host "✅ Hyper-V has been enabled successfully!" -ForegroundColor Green
                        Write-Host "⚠️ IMPORTANT: System restart will be required after installation completes" -ForegroundColor Red
                        $restartRequired = $true
                    } catch {
                        Write-Host "❌ Failed to enable Hyper-V: $($_.Exception.Message)" -ForegroundColor Red
                        Write-Host "💡 You can manually enable it later via Windows Features or run:" -ForegroundColor Yellow
                        Write-Host "   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All" -ForegroundColor Gray
                        $restartRequired = $false
                    }
                    break
                }
                "N" {
                    Write-Host ""
                    Write-Host "⏭️ Skipping Hyper-V enablement" -ForegroundColor Yellow
                    Write-Host "💡 Note: Android Emulator will use software acceleration (may be slower)" -ForegroundColor Cyan
                    $restartRequired = $false
                    break
                }
                default {
                    Write-Host "❌ Invalid choice. Please enter Y or N." -ForegroundColor Red
                }
            }
        } while ($hyperVChoice.ToUpper() -notin @("Y", "N"))
    }
} catch {
    Write-Host "⚠️ Could not check Hyper-V status: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "💡 Hyper-V check skipped - continuing with installation..." -ForegroundColor Cyan
    $restartRequired = $false
}

# --- INSTALLATION CHECK ---
Write-Host ""
Write-Host "🔍 Checking for existing Android SDK installation..." -ForegroundColor Cyan

$AndroidSdkRoot = "C:\android\sdk"
$existingInstallation = $false
$installationDetails = @()

# Check various locations for existing installation
$checkLocations = @(
    @{Path = $AndroidSdkRoot; Name = "Main SDK Root"},
    @{Path = "$AndroidSdkRoot\cmdline-tools\latest"; Name = "Command Line Tools"},
    @{Path = "$AndroidSdkRoot\platform-tools"; Name = "Platform Tools"},
    @{Path = "$AndroidSdkRoot\emulator"; Name = "Emulator"},
    @{Path = "$env:LOCALAPPDATA\Android"; Name = "Local AppData Android"}
)

foreach ($location in $checkLocations) {
    if (Test-Path $location.Path) {
        $existingInstallation = $true
        $installationDetails += "  ✅ Found: $($location.Name) at $($location.Path)"
        
        # Check for important executables
        if ($location.Name -eq "Command Line Tools") {
            $sdkManager = Join-Path $location.Path "bin\sdkmanager.bat"
            $avdManager = Join-Path $location.Path "bin\avdmanager.bat"
            if (Test-Path $sdkManager) { $installationDetails += "    📱 sdkmanager.bat exists" }
            if (Test-Path $avdManager) { $installationDetails += "    📱 avdmanager.bat exists" }
        }
        
        if ($location.Name -eq "Platform Tools") {
            $adb = Join-Path $location.Path "adb.exe"
            if (Test-Path $adb) { $installationDetails += "    🔧 adb.exe exists" }
        }
        
        if ($location.Name -eq "Emulator") {
            $emulator = Join-Path $location.Path "emulator.exe"
            if (Test-Path $emulator) { $installationDetails += "    🎮 emulator.exe exists" }
        }
    }
}

# Check environment variables
$androidSdkRoot = [Environment]::GetEnvironmentVariable("ANDROID_SDK_ROOT", "Machine")
$androidHome = [Environment]::GetEnvironmentVariable("ANDROID_HOME", "Machine")
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

if ($androidSdkRoot) {
    $existingInstallation = $true
    $installationDetails += "  🔧 ANDROID_SDK_ROOT = $androidSdkRoot"
}

if ($androidHome) {
    $existingInstallation = $true
    $installationDetails += "  🔧 ANDROID_HOME = $androidHome"
}

if ($systemPath -like "*android*") {
    $existingInstallation = $true
    $installationDetails += "  🛤️ Android paths found in System PATH"
}

if ($existingInstallation) {
    Write-Host ""
    Write-Host "⚠️ EXISTING ANDROID SDK INSTALLATION DETECTED!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Current Installation Details:" -ForegroundColor Cyan
    foreach ($detail in $installationDetails) {
        Write-Host $detail -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🤔 What would you like to do?" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[1] 🗑️ Remove existing installation and install fresh" -ForegroundColor Red
    Write-Host "[2] ⏭️ Skip installation (keep existing)" -ForegroundColor Green  
    Write-Host "[3] ❌ Cancel and exit" -ForegroundColor Gray
    Write-Host ""
    
    do {
        $choice = Read-Host "Enter your choice (1/2/3)"
        switch ($choice) {
            "1" {
                Write-Host ""
                Write-Host "⚠️ WARNING: This will completely remove the existing Android SDK installation!" -ForegroundColor Red
                Write-Host "Are you absolutely sure? This action cannot be undone!" -ForegroundColor Red
                $confirm = Read-Host "Type 'YES' (all caps) to confirm removal"
                
                if ($confirm -eq "YES") {
                    Write-Host ""
                    Write-Host "🗑️ Removing existing Android SDK installation..." -ForegroundColor Red
                    
                    # Remove directories
                    $removePaths = @($AndroidSdkRoot, "$env:LOCALAPPDATA\Android")
                    foreach ($removePath in $removePaths) {
                        if (Test-Path $removePath) {
                            try {
                                Remove-Item $removePath -Recurse -Force
                                Write-Host "✅ Removed: $removePath" -ForegroundColor Green
                            } catch {
                                Write-Host "❌ Failed to remove: $removePath - $($_.Exception.Message)" -ForegroundColor Red
                            }
                        }
                    }
                    
                    # Clean environment variables
                    Write-Host "🧹 Cleaning environment variables..." -ForegroundColor Yellow
                    [Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $null, "Machine")
                    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $null, "Machine")
                    
                    # Clean PATH
                    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
                    $pathArray = $currentPath -split ';'
                    $cleanedPath = $pathArray | Where-Object { $_ -notlike "*android*" -and $_ -notlike "*Android*" }
                    $newPath = $cleanedPath -join ';'
                    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
                    
                    Write-Host "✅ Cleanup completed! Proceeding with fresh installation..." -ForegroundColor Green
                    $proceed = $true
                    break
                } else {
                    Write-Host "❌ Removal cancelled. Exiting..." -ForegroundColor Yellow
                    pause
                    exit 0
                }
            }
            "2" {
                Write-Host ""
                Write-Host "⏭️ Installation skipped. Your existing Android SDK will remain unchanged." -ForegroundColor Green
                Write-Host ""
                Write-Host "💡 If you want to use the existing installation:" -ForegroundColor Cyan
                Write-Host "1. Make sure your environment variables are set correctly"
                Write-Host "2. Test with: sdkmanager --list"
                Write-Host "3. Accept licenses with: sdkmanager --licenses"
                Write-Host ""
                pause
                exit 0
            }
            "3" {
                Write-Host ""
                Write-Host "❌ Installation cancelled. Exiting..." -ForegroundColor Gray
                pause
                exit 0
            }
            default {
                Write-Host "❌ Invalid choice. Please enter 1, 2, or 3." -ForegroundColor Red
            }
        }
    } while ($choice -notin @("1", "2", "3"))
} else {
    Write-Host "✅ No existing Android SDK installation found. Proceeding with fresh installation..." -ForegroundColor Green
}

# --- CONFIG (Following proper Android SDK structure) ---
$AndroidSdkRoot = "C:\android\sdk"
$CmdlineDir     = "$AndroidSdkRoot\cmdline-tools"
$LatestDir      = "$CmdlineDir\latest"
$PlatformTools  = "$AndroidSdkRoot\platform-tools"
$EmulatorDir    = "$AndroidSdkRoot\emulator"
$DownloadUrl    = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath        = "$env:TEMP\commandlinetools.zip"

# --- FAST DOWNLOAD FUNCTION ---
function Download-File($url, $outFile) {
    Write-Host "📥 Downloading: $url"
    Add-Type -AssemblyName System.Net.Http
    $client = New-Object System.Net.Http.HttpClient
    $client.Timeout = [System.TimeSpan]::FromMinutes(15)
    
    try {
        $response = $client.GetAsync($url, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
        $response.EnsureSuccessStatusCode()

        $total = $response.Content.Headers.ContentLength
        $stream = $response.Content.ReadAsStreamAsync().Result
        $fileStream = [System.IO.File]::Create($outFile)

        $buffer = New-Object byte[] 8192
        $totalRead = 0
        $lastProgress = -1

        while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $fileStream.Write($buffer, 0, $read)
            $totalRead += $read
            if ($total) {
                $progress = [math]::Floor(($totalRead / $total) * 100)
                if ($progress -ne $lastProgress) {
                    Write-Progress -Activity "Downloading Android Command Line Tools..." -Status "$progress% Complete" -PercentComplete $progress
                    $lastProgress = $progress
                }
            }
        }

        $fileStream.Close()
        $stream.Close()
        Write-Host "✅ Download complete: $outFile" -ForegroundColor Green
    }
    finally {
        $client.Dispose()
    }
}

# --- CREATE SDK ROOT DIRECTORY STRUCTURE ---
Write-Host "📁 Creating Android SDK directory structure..."
if (!(Test-Path $AndroidSdkRoot)) {
    New-Item -ItemType Directory -Path $AndroidSdkRoot -Force | Out-Null
    Write-Host "Created: $AndroidSdkRoot" -ForegroundColor Green
}

if (!(Test-Path $CmdlineDir)) {
    New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null
    Write-Host "Created: $CmdlineDir" -ForegroundColor Green
}

# --- DOWNLOAD ---
Write-Host ""
Download-File $DownloadUrl $ZipPath

# --- EXTRACT ---
Write-Host ""
Write-Host "📦 Extracting Android Command Line Tools..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

# Move extracted cmdline-tools to "latest" (proper structure)
if (Test-Path "$CmdlineDir\cmdline-tools") {
    if (Test-Path $LatestDir) { 
        Remove-Item $LatestDir -Recurse -Force 
        Write-Host "Removed existing latest directory" -ForegroundColor Yellow
    }
    Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
    Write-Host "✅ Moved to proper structure: $LatestDir" -ForegroundColor Green
}

# Clean up download
Remove-Item $ZipPath -Force
Write-Host "🗑️ Cleaned up temporary files" -ForegroundColor Green

# --- CREATE ADDITIONAL SDK DIRECTORIES ---
Write-Host ""
Write-Host "📁 Creating additional SDK directories..."
$additionalDirs = @($PlatformTools, $EmulatorDir)
foreach ($dir in $additionalDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

# --- SYSTEM ENVIRONMENT VARIABLES SETUP ---
Write-Host ""
Write-Host "⚙️ Setting up System environment variables..."

# Set ANDROID_SDK_ROOT
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $AndroidSdkRoot, "Machine")
Write-Host "✅ ANDROID_SDK_ROOT = $AndroidSdkRoot" -ForegroundColor Green

# Update System PATH
$envPaths = @(
    "$LatestDir\bin",
    $PlatformTools,
    $EmulatorDir
)

$currentSystemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$pathUpdated = $false

foreach ($p in $envPaths) {
    if ($currentSystemPath -notlike "*$p*") {
        $currentSystemPath = "$currentSystemPath;$p"
        $pathUpdated = $true
        Write-Host "✅ Added to PATH: $p" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Already in PATH: $p" -ForegroundColor Yellow
    }
}

if ($pathUpdated) {
    [Environment]::SetEnvironmentVariable("Path", $currentSystemPath, "Machine")
    Write-Host "✅ System PATH updated successfully!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ All paths already exist in System PATH" -ForegroundColor Cyan
}

# --- VERIFICATION ---
Write-Host ""
Write-Host "🔍 Verifying installation..."
$binPath = "$LatestDir\bin"
$requiredFiles = @("sdkmanager.bat", "avdmanager.bat")

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $binPath $file
    if (Test-Path $fullPath) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    }
}

# --- FINAL FOLDER STRUCTURE DISPLAY ---
Write-Host ""
Write-Host "📋 Final Android SDK folder structure:" -ForegroundColor Cyan
Write-Host "C:/android/sdk/ (SDK Root)" -ForegroundColor White
Write-Host "├── cmdline-tools/" -ForegroundColor White
Write-Host "│   └── latest/" -ForegroundColor White
Write-Host "│       ├── lib/" -ForegroundColor White
Write-Host "│       └── bin/" -ForegroundColor White
Write-Host "│           ├── avdmanager.bat" -ForegroundColor White
Write-Host "│           └── sdkmanager.bat" -ForegroundColor White
Write-Host "├── platform-tools/ (for future use)" -ForegroundColor Gray
Write-Host "└── emulator/ (for future use)" -ForegroundColor Gray

# --- AUTO INSTALL ESSENTIAL PACKAGES ---
Write-Host ""
Write-Host "🔧 Installing essential Android SDK packages..." -ForegroundColor Yellow
Write-Host "This may take a few minutes, please wait..." -ForegroundColor Cyan

$sdkManagerPath = "$LatestDir\bin\sdkmanager.bat"

# Install essential packages
$packages = @(
    "platform-tools",
    "emulator", 
    "tools",
    "platforms;android-34",
    "build-tools;34.0.0"
)

Write-Host ""
Write-Host "📦 Installing packages: $($packages -join ', ')" -ForegroundColor Cyan
try {
    $packageList = $packages -join ' '
    & $sdkManagerPath $packageList.Split(' ')
    Write-Host "✅ Essential packages installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Error installing packages: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can manually install later with: sdkmanager platform-tools emulator tools platforms;android-34 build-tools;34.0.0" -ForegroundColor Yellow
}

# Accept all licenses automatically
Write-Host ""
Write-Host "📋 Accepting Android SDK licenses..." -ForegroundColor Yellow
try {
    # Create a "yes" input for all license prompts
    $yesInput = "y`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`n"  # Multiple y's with newlines
    $yesInput | & $sdkManagerPath --licenses
    Write-Host "✅ All SDK licenses accepted!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Error accepting licenses: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can manually accept licenses later with: sdkmanager --licenses" -ForegroundColor Yellow
}

# --- FINAL VERIFICATION ---
Write-Host ""
Write-Host "🔍 Final verification..." -ForegroundColor Cyan

# Check if platform-tools was installed
if (Test-Path "$AndroidSdkRoot\platform-tools\adb.exe") {
    Write-Host "✅ ADB installed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ ADB not found - platform-tools may not have installed correctly" -ForegroundColor Yellow
}

# Check if emulator was installed  
if (Test-Path "$AndroidSdkRoot\emulator\emulator.exe") {
    Write-Host "✅ Android Emulator installed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ Emulator not found - may not have installed correctly" -ForegroundColor Yellow
}

# --- SUCCESS MESSAGE ---
Write-Host ""
if ($restartRequired) {
    Write-Host "🎉 Android SDK installation completed with Hyper-V enabled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️ SYSTEM RESTART REQUIRED!" -ForegroundColor Red
    Write-Host "🔄 Hyper-V requires a system restart to function properly" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 After restart, you can:" -ForegroundColor Cyan
    Write-Host "1. 🧪 Test ADB with: adb version" -ForegroundColor White
    Write-Host "2. 📱 Create AVD with hardware acceleration" -ForegroundColor White
    Write-Host "3. 🚀 Use VS Code AVD Manager extension" -ForegroundColor White
    Write-Host ""
    Write-Host "Would you like to restart now?" -ForegroundColor Yellow
    Write-Host "[Y] Yes, restart now" -ForegroundColor Green
    Write-Host "[N] No, I'll restart later" -ForegroundColor Red
    Write-Host ""
    
    do {
        $restartChoice = Read-Host "Restart system now? (Y/N)"
        switch ($restartChoice.ToUpper()) {
            "Y" {
                Write-Host ""
                Write-Host "🔄 Restarting system in 10 seconds..." -ForegroundColor Yellow
                Write-Host "Press Ctrl+C to cancel" -ForegroundColor Gray
                Start-Sleep -Seconds 10
                Restart-Computer -Force
                break
            }
            "N" {
                Write-Host ""
                Write-Host "⏭️ Restart postponed. Please restart manually when convenient." -ForegroundColor Yellow
                Write-Host "💡 Hyper-V will not work until system is restarted!" -ForegroundColor Red
                break
            }
            default {
                Write-Host "❌ Invalid choice. Please enter Y or N." -ForegroundColor Red
            }
        }
    } while ($restartChoice.ToUpper() -notin @("Y", "N"))
} else {
    Write-Host "🎉 Android SDK installation and setup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Ready to Use:" -ForegroundColor Yellow
    Write-Host "1. 🔄 Restart your terminal to use commands globally" -ForegroundColor White
    Write-Host "2. 🧪 Test with: adb version" -ForegroundColor White
    Write-Host "3. 📱 Create AVD with: avdmanager create avd -n test -k system-images;android-34;google_apis;x86_64" -ForegroundColor White
    Write-Host "4. 🚀 Use with VS Code AVD Manager extension" -ForegroundColor White
}

Write-Host ""
Write-Host "📦 Installed Packages:" -ForegroundColor Cyan
Write-Host "   • Platform Tools (ADB, Fastboot)" -ForegroundColor White
Write-Host "   • Android Emulator" -ForegroundColor White
Write-Host "   • Android SDK Tools" -ForegroundColor White
Write-Host "   • Android 34 (API Level 34)" -ForegroundColor White
Write-Host "   • Build Tools 34.0.0" -ForegroundColor White

if ($restartRequired) {
    Write-Host "   • Hyper-V (requires restart)" -ForegroundColor Yellow
} else {
    if ($hyperVEnabled) {
        Write-Host "   • Hyper-V (already enabled)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "💡 Environment Variables Set:" -ForegroundColor Cyan
Write-Host "   ANDROID_SDK_ROOT = $AndroidSdkRoot" -ForegroundColor White
Write-Host "   PATH includes all necessary SDK directories" -ForegroundColor White
Write-Host ""
Write-Host "🚀 All set! You can now develop Android apps!" -ForegroundColor Green

if (-not $restartRequired) {
    pause
}
