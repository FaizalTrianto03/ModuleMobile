<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows
  without requiring Android Studio.

.DESCRIPTION
  This script:
    1. Downloads latest Android Command Line Tools
    2. Extracts them to C:\Android\cmdline-tools\latest
    3. Sets up environment variables (PATH) permanently

.NOTES
  Run this script with admin privileges (required for setting system environment vars).
#>

$ErrorActionPreference = "Stop"

# --- CONFIG ---
$AndroidRoot    = "C:\Android"
$CmdlineDir     = "$AndroidRoot\cmdline-tools"
$LatestDir      = "$CmdlineDir\latest"
$DownloadUrl    = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath        = "$env:TEMP\commandlinetools.zip"

Write-Host "📥 Downloading Android Command Line Tools..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipPath

if (!(Test-Path $CmdlineDir)) {
    New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null
}

Write-Host "📦 Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

# Move extracted "cmdline-tools" content into "latest"
if (Test-Path "$CmdlineDir\cmdline-tools") {
    if (Test-Path $LatestDir) { Remove-Item $LatestDir -Recurse -Force }
    Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
}

Remove-Item $ZipPath -Force

# --- ENVIRONMENT VARIABLES ---
$envPaths = @(
    "$LatestDir\bin",
    "$AndroidRoot\platform-tools",
    "$AndroidRoot\emulator"
)

Write-Host "⚙️  Updating PATH..."
foreach ($p in $envPaths) {
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$p*") {
        [Environment]::SetEnvironmentVariable(
            "Path",
            "$currentPath;$p",
            "Machine"
        )
    }
}

Write-Host "✅ Installation complete!"
Write-Host "👉 Please restart your terminal or run 'refreshenv' (if you use Chocolatey)."
Write-Host "You can now run 'avdmanager' or 'sdkmanager'."
