<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows.
  Will always start in a NEW elevated PowerShell window.

.DESCRIPTION
  - Always triggers "Run as Administrator" first
  - Downloads Command Line Tools
  - Extracts to C:\android\sdk\cmdline-tools\latest
  - Updates System PATH
#>

$ErrorActionPreference = "Stop"

# --- STEP 1: Relaunch Elevated ---
function Ensure-Admin {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal   = New-Object Security.Principal.WindowsPrincipal($currentUser)
    $isAdmin     = $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)

    if (-not $isAdmin) {
        Write-Host "⚡ Relaunching in elevated PowerShell..."
        $psExe = (Get-Process -Id $PID).Path
        $scriptUrl = "https://raw.githubusercontent.com/<username>/<repo>/main/install-avd.ps1"

        Start-Process -FilePath $psExe `
            -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"irm $scriptUrl | iex`"" `
            -Verb RunAs

        exit
    }
}
Ensure-Admin

# --- STEP 2: CONFIG ---
$SdkRoot     = "C:\android\sdk"
$CmdlineDir  = "$SdkRoot\cmdline-tools"
$LatestDir   = "$CmdlineDir\latest"
$DownloadUrl = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath     = "$env:TEMP\commandlinetools.zip"

# --- STEP 3: FAST DOWNLOAD ---
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

# --- STEP 4: DOWNLOAD & EXTRACT ---
if (!(Test-Path $SdkRoot)) { New-Item -ItemType Directory -Path $SdkRoot -Force | Out-Null }
Download-File $DownloadUrl $ZipPath

if (!(Test-Path $CmdlineDir)) { New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null }
Write-Host "📦 Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

if (Test-Path "$CmdlineDir\cmdline-tools") {
    if (Test-Path $LatestDir) { Remove-Item $LatestDir -Recurse -Force }
    Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
}
Remove-Item $ZipPath -Force

# --- STEP 5: SYSTEM PATH ---
$envPaths = @(
    "$LatestDir\bin",
    "$SdkRoot\platform-tools",
    "$SdkRoot\emulator"
)

Write-Host "⚙️ Updating PATH (System)..."
foreach ($p in $envPaths) {
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$p*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$p", "Machine")
    }
}

Write-Host "`n🎉 Installation finished!"
Write-Host "👉 Restart your terminal or VSCode, then run: sdkmanager --list"
