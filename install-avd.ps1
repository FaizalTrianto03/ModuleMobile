<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows.
  Auto elevates to Admin if run in normal PowerShell.

.DESCRIPTION
  - Download Android SDK Command Line Tools
  - Extract ke C:\android\sdk\cmdline-tools\latest
  - Update PATH di System Environment (requires admin)
  - Restart terminal untuk aktif

.NOTES
  Jalankan dengan:
    irm https://raw.githubusercontent.com/<username>/<repo>/main/install-avd.ps1 | iex
#>

$ErrorActionPreference = "Stop"

# --- AUTO-ELEVATE ---
function Ensure-Admin {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
        Write-Host "⚠️  Not running as admin. Relaunching with elevation..."
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
        exit
    }
}
Ensure-Admin

# --- CONFIG ---
$SdkRoot     = "C:\android\sdk"
$CmdlineDir  = "$SdkRoot\cmdline-tools"
$LatestDir   = "$CmdlineDir\latest"
$DownloadUrl = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath     = "$env:TEMP\commandlinetools.zip"

# --- FAST DOWNLOAD ---
function Download-File($url, $outFile) {
    Write-Host "📥 Downloading: $url"
    try { Add-Type -AssemblyName System.Net.Http } catch {}
    $client = New-Object System.Net.Http.HttpClient
    $client.Timeout = [System.TimeSpan]::FromMinutes(15)
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
                Write-Progress -Activity "Downloading..." -Status "$progress% Complete" -PercentComplete $progress
                $lastProgress = $progress
            }
        }
    }

    $fileStream.Close()
    $stream.Close()
    $client.Dispose()
    Write-Host "✅ Download complete: $outFile"
}

# --- DOWNLOAD ---
if (!(Test-Path $SdkRoot)) { New-Item -ItemType Directory -Path $SdkRoot -Force | Out-Null }
Download-File $DownloadUrl $ZipPath

# --- EXTRACT ---
if (!(Test-Path $CmdlineDir)) { New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null }
Write-Host "📦 Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

# Move into "latest"
if (Test-Path "$CmdlineDir\cmdline-tools") {
    if (Test-Path $LatestDir) { Remove-Item $LatestDir -Recurse -Force }
    Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
}
Remove-Item $ZipPath -Force

# --- PATH SETUP (System) ---
$envPaths = @(
    "$LatestDir\bin",
    "$SdkRoot\platform-tools",
    "$SdkRoot\emulator"
)

Write-Host "⚙️ Updating PATH (System scope)..."
foreach ($p in $envPaths) {
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$p*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$p", "Machine")
    }
}

Write-Host "🎉 Installation finished!"
Write-Host "👉 Restart your terminal or VSCode, then run: sdkmanager --list"
Write-Host "👉 Folder structure now: $SdkRoot"
