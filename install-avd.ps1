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
Write-Host "🎉 Android SDK installation and setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Installed Packages:" -ForegroundColor Cyan
Write-Host "   • Platform Tools (ADB, Fastboot)" -ForegroundColor White
Write-Host "   • Android Emulator" -ForegroundColor White
Write-Host "   • Android SDK Tools" -ForegroundColor White
Write-Host "   • Android 34 (API Level 34)" -ForegroundColor White
Write-Host "   • Build Tools 34.0.0" -ForegroundColor White
Write-Host ""
Write-Host "💡 Environment Variables Set:" -ForegroundColor Cyan
Write-Host "   ANDROID_SDK_ROOT = $AndroidSdkRoot" -ForegroundColor White
Write-Host "   PATH includes all necessary SDK directories" -ForegroundColor White
Write-Host ""
Write-Host "📝 Ready to Use:" -ForegroundColor Yellow
Write-Host "1. 🔄 Restart your terminal to use commands globally"
Write-Host "2. 🧪 Test with: adb version"
Write-Host "3. 📱 Create AVD with: avdmanager create avd -n test -k system-images;android-34;google_apis;x86_64"
Write-Host "4. 🚀 Use with VS Code AVD Manager extension"
Write-Host ""
Write-Host "🚀 All set! You can now develop Android apps!" -ForegroundColor Green

pause
