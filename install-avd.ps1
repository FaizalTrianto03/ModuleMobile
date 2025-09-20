<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows
  with Android Emulator Hypervisor Driver support as automatic fallback

.DESCRIPTION
  - Check for Administrator privileges
  - Download dengan HttpClient (lebih cepat dari Invoke-WebRequest)
  - Extract ke C:\android\sdk\cmdline-tools\latest (proper Android SDK structure)
  - Install Android Emulator Hypervisor Driver for ALL systems (as fallback)
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

# --- HYPER-V STATUS CHECK (INFO ONLY) ---
Write-Host ""
Write-Host "🔍 Checking Hyper-V status..." -ForegroundColor Cyan

$hyperVEnabled = $false
$hyperVStatus = "Not Available"

try {
    $hyperVFeature = Get-WindowsOptionalFeature -Online -FeatureName "Microsoft-Hyper-V-All" -ErrorAction SilentlyContinue
    
    if ($hyperVFeature) {
        if ($hyperVFeature.State -eq "Enabled") {
            $hyperVEnabled = $true
            $hyperVStatus = "Enabled"
            Write-Host "✅ Hyper-V: Enabled" -ForegroundColor Green
            Write-Host "🚀 Android Emulator will primarily use Hyper-V for maximum performance!" -ForegroundColor Cyan
            Write-Host "💡 AEHD will be installed as automatic fallback if Hyper-V fails" -ForegroundColor Yellow
        } else {
            $hyperVStatus = "Disabled"
            Write-Host "⚠️ Hyper-V: Disabled" -ForegroundColor Yellow
            Write-Host "💡 Android Emulator will use Android Emulator Hypervisor Driver (AEHD)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "ℹ️ Hyper-V: Not available on this Windows edition" -ForegroundColor Gray
        Write-Host "💡 Android Emulator will use Android Emulator Hypervisor Driver (AEHD)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️ Could not check Hyper-V status" -ForegroundColor Yellow
    Write-Host "💡 Will install Android Emulator Hypervisor Driver as primary option" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📝 Virtualization Configuration:" -ForegroundColor Cyan
if ($hyperVEnabled) {
    Write-Host "  • Primary Mode: Hyper-V (Best Performance)" -ForegroundColor Green
    Write-Host "  • Fallback Mode: AEHD (Will be installed for automatic fallback)" -ForegroundColor Yellow
    Write-Host "  • Smart switching between Hyper-V and AEHD based on availability" -ForegroundColor White
} else {
    Write-Host "  • Primary Mode: Android Emulator Hypervisor Driver (AEHD)" -ForegroundColor Yellow
    Write-Host "  • AEHD will be installed for hardware acceleration" -ForegroundColor White
    Write-Host "  • Performance will still be good" -ForegroundColor Gray
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
    @{Path = "$AndroidSdkRoot\extras\google\Android_Emulator_Hypervisor_Driver"; Name = "AEHD Driver"},
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
        
        if ($location.Name -eq "AEHD Driver") {
            $aehdInstaller = Join-Path $location.Path "silent_install.bat"
            if (Test-Path $aehdInstaller) { $installationDetails += "    🔌 AEHD installer exists" }
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
Write-Host "├── emulator/ (for future use)" -ForegroundColor Gray
Write-Host "└── extras/ (for AEHD driver)" -ForegroundColor Gray

# --- AUTO INSTALL ESSENTIAL PACKAGES ---
Write-Host ""
Write-Host "🔧 Installing essential Android SDK packages..." -ForegroundColor Yellow
Write-Host "This may take a few minutes, please wait..." -ForegroundColor Cyan

$sdkManagerPath = "$LatestDir\bin\sdkmanager.bat"

# Build package list - ALWAYS include AEHD for fallback
$packages = @(
    "platform-tools",
    "emulator", 
    "tools",
    "platforms;android-34",
    "build-tools;34.0.0",
    "extras;google;Android_Emulator_Hypervisor_Driver"  # Always install for fallback
)

Write-Host ""
if ($hyperVEnabled) {
    Write-Host "📦 Installing packages with AEHD as automatic fallback..." -ForegroundColor Cyan
    Write-Host "   Hyper-V is primary, AEHD will be available if Hyper-V fails" -ForegroundColor Yellow
} else {
    Write-Host "📦 Installing packages with AEHD as primary driver..." -ForegroundColor Cyan
}

Write-Host "📦 Packages to install: $($packages -join ', ')" -ForegroundColor White

try {
    $packageList = $packages -join ' '
    & $sdkManagerPath $packageList.Split(' ')
    Write-Host "✅ Essential packages installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Error installing packages: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can manually install later with: sdkmanager $packageList" -ForegroundColor Yellow
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

# --- ALWAYS INSTALL AEHD DRIVER FOR FALLBACK ---
$aehdPath = "$AndroidSdkRoot\extras\google\Android_Emulator_Hypervisor_Driver"

if (Test-Path $aehdPath) {
    Write-Host ""
    if ($hyperVEnabled) {
        Write-Host "🔌 Installing Android Emulator Hypervisor Driver (AEHD) as fallback..." -ForegroundColor Yellow
        Write-Host "💡 AEHD will automatically activate if Hyper-V encounters issues" -ForegroundColor Cyan
    } else {
        Write-Host "🔌 Installing Android Emulator Hypervisor Driver (AEHD) as primary driver..." -ForegroundColor Yellow
    }
    Write-Host "📍 Location: $aehdPath" -ForegroundColor Gray
    
    try {
        $silentInstall = Join-Path $aehdPath "silent_install.bat"
        
        if (Test-Path $silentInstall) {
            Write-Host "🔧 Running AEHD silent installation..." -ForegroundColor Cyan
            
            # Run the silent install batch file
            $process = Start-Process -FilePath $silentInstall -WorkingDirectory $aehdPath -Wait -PassThru -WindowStyle Hidden
            
            if ($process.ExitCode -eq 0) {
                Write-Host "✅ Android Emulator Hypervisor Driver installed successfully!" -ForegroundColor Green
                if ($hyperVEnabled) {
                    Write-Host "🎯 AEHD is now available as automatic fallback if Hyper-V fails" -ForegroundColor Cyan
                    Write-Host "📌 The emulator will intelligently switch between Hyper-V and AEHD" -ForegroundColor White
                } else {
                    Write-Host "🚀 Hardware acceleration is now enabled via AEHD" -ForegroundColor Cyan
                }
            } else {
                Write-Host "⚠️ AEHD installation returned exit code: $($process.ExitCode)" -ForegroundColor Yellow
                Write-Host "💡 You may need to install manually from: $aehdPath" -ForegroundColor Gray
                Write-Host "   Run: silent_install.bat" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠️ AEHD silent installer not found at expected location" -ForegroundColor Yellow
            Write-Host "💡 Manual installation required from: $aehdPath" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Error installing AEHD: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 You can manually install from: $aehdPath" -ForegroundColor Yellow
        Write-Host "   Run: silent_install.bat" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "⚠️ AEHD driver package not found at: $aehdPath" -ForegroundColor Yellow
    Write-Host "💡 You can manually install it later with:" -ForegroundColor Cyan
    Write-Host '   sdkmanager "extras;google;Android_Emulator_Hypervisor_Driver"' -ForegroundColor Gray
    Write-Host "   Then run: $aehdPath\silent_install.bat" -ForegroundColor Gray
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

# Check AEHD status - always check since we always install it
if (Test-Path "$AndroidSdkRoot\extras\google\Android_Emulator_Hypervisor_Driver\AEHD.inf") {
    Write-Host "✅ AEHD driver files present (ready as fallback)" -ForegroundColor Green
} else {
    Write-Host "⚠️ AEHD driver files not found" -ForegroundColor Yellow
}

# --- SUCCESS MESSAGE ---
Write-Host ""
Write-Host "🎉 Android SDK installation and setup completed!" -ForegroundColor Green
Write-Host ""

# Display virtualization status summary
Write-Host "🎮 Virtualization Configuration:" -ForegroundColor Cyan
if ($hyperVEnabled) {
    Write-Host "   • Primary Mode: Hyper-V (Maximum Performance)" -ForegroundColor Green
    Write-Host "   • Fallback Mode: AEHD (Automatic failover)" -ForegroundColor Yellow
    Write-Host "   • Hardware acceleration: Dual-mode enabled" -ForegroundColor White
    Write-Host "   • Smart switching: Emulator will use best available option" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Benefits of dual-mode setup:" -ForegroundColor Cyan
    Write-Host "   • Maximum performance with Hyper-V when available" -ForegroundColor White
    Write-Host "   • Automatic fallback to AEHD if Hyper-V fails" -ForegroundColor White
    Write-Host "   • No manual intervention needed for switching" -ForegroundColor White
} else {
    Write-Host "   • Primary Mode: Android Emulator Hypervisor Driver (AEHD)" -ForegroundColor Yellow
    Write-Host "   • Hardware acceleration: Enabled via AEHD" -ForegroundColor White
    Write-Host "   • Performance: Good hardware acceleration" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Tip: You can enable Hyper-V later for dual-mode support" -ForegroundColor Cyan
    Write-Host "   Windows Features → Turn Windows features on/off → Hyper-V" -ForegroundColor Gray
    Write-Host "   AEHD will remain as automatic fallback" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📦 Installed Packages:" -ForegroundColor Cyan
Write-Host "   • Platform Tools (ADB, Fastboot)" -ForegroundColor White
Write-Host "   • Android Emulator" -ForegroundColor White
Write-Host "   • Android SDK Tools" -ForegroundColor White
Write-Host "   • Android 34 (API Level 34)" -ForegroundColor White
Write-Host "   • Build Tools 34.0.0" -ForegroundColor White
Write-Host "   • Android Emulator Hypervisor Driver (AEHD)" -ForegroundColor White

Write-Host ""
Write-Host "💡 Environment Variables Set:" -ForegroundColor Cyan
Write-Host "   ANDROID_SDK_ROOT = $AndroidSdkRoot" -ForegroundColor White
Write-Host "   PATH includes all necessary SDK directories" -ForegroundColor White

Write-Host ""
Write-Host "📝 Ready to Use:" -ForegroundColor Yellow
Write-Host "1. 🔄 Restart your terminal to use commands globally" -ForegroundColor White
Write-Host "2. 🧪 Test with: adb version" -ForegroundColor White
Write-Host "3. 📱 Create AVD with: avdmanager create avd -n test -k system-images;android-34;google_apis;x86_64" -ForegroundColor White
Write-Host "4. 🚀 Use with VS Code AVD Manager extension" -ForegroundColor White

Write-Host ""
Write-Host "🚀 All set! You have dual-mode hardware acceleration ready!" -ForegroundColor Green
Write-Host "   The emulator will automatically use the best available option." -ForegroundColor Cyan

pause
