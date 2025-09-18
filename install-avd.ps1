<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows.

.DESCRIPTION
  - Download Android SDK Command Line Tools
  - Extract ke C:\android\sdk\cmdline-tools\latest
  - Update PATH di System Environment (requires admin)
  - Restart terminal untuk aktif

.NOTES
  Dipanggil via bootstrapper:
    irm https://raw.githubusercontent.com/<username>/<repo>/main/install.ps1 | iex
#>

param()
$ErrorActionPreference = "Stop"

function Assert-RunAsAdmin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($id)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
        Write-Error "❌ Script harus dijalankan sebagai Administrator!"
        exit 1
    }
}
Assert-RunAsAdmin

# --- CONFIG ---
$SdkRoot     = "C:\android\sdk"
$CmdlineDir  = Join-Path $SdkRoot "cmdline-tools"
$LatestDir   = Join-Path $CmdlineDir "latest"
$DownloadUrl = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath     = Join-Path $env:TEMP "commandlinetools.zip"

# --- DOWNLOAD FUNCTIONS ---
function Download-WithHttpClient {
    param($url, $outfile)
    Write-Host "📥 (HttpClient) Downloading $url ..."
    try {
        Add-Type -ErrorAction SilentlyContinue -AssemblyName System.Net.Http
        $client = New-Object System.Net.Http.HttpClient
        $client.Timeout = [System.TimeSpan]::FromMinutes(20)
        $resp = $client.GetAsync($url, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
        $resp.EnsureSuccessStatusCode()
        $total = $resp.Content.Headers.ContentLength
        $stream = $resp.Content.ReadAsStreamAsync().Result
        $fs = [System.IO.File]::Create($outfile)
        $buffer = New-Object byte[] 65536
        $done = 0
        while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $fs.Write($buffer, 0, $read)
            $done += $read
            if ($total) {
                $pct = [int](($done / $total) * 100)
                Write-Progress -Activity "Downloading" -Status "$pct% Complete ($([math]::Round($done/1MB,2)) MB / $([math]::Round($total/1MB,2)) MB)" -PercentComplete $pct
            }
        }
        $fs.Close(); $stream.Close(); $client.Dispose()
        Write-Progress -Activity "Downloading" -Completed
        Write-Host "✅ Downloaded to $outfile"
        return $true
    } catch {
        Write-Warning "HttpClient download failed: $($_.Exception.Message)"
        return $false
    }
}

function Download-Fallback {
    param($url, $outfile)
    Write-Host "📥 (Fallback) Downloading $url ..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outfile -UseBasicParsing -TimeoutSec 300
        Write-Host "✅ Downloaded to $outfile"
        return $true
    } catch {
        Write-Warning "Fallback download failed: $($_.Exception.Message)"
        return $false
    }
}

# --- STEP 1: DOWNLOAD ---
if (-not (Test-Path $SdkRoot)) { New-Item -ItemType Directory -Path $SdkRoot -Force | Out-Null }
$ok = Download-WithHttpClient -url $DownloadUrl -outfile $ZipPath
if (-not $ok) { $ok = Download-Fallback -url $DownloadUrl -outfile $ZipPath }
if (-not $ok) { Write-Error "❌ Gagal mendownload Command Line Tools"; exit 1 }

# --- STEP 2: EXTRACT ---
if (-not (Test-Path $CmdlineDir)) { New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null }
Write-Host "📦 Extracting $ZipPath to $CmdlineDir ..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

# --- STEP 3: MOVE ke latest ---
$possibleDir = Get-ChildItem -Path $CmdlineDir -Directory | Where-Object { $_.Name -eq "cmdline-tools" } | Select-Object -First 1
if ($possibleDir) {
    if (Test-Path -LiteralPath $LatestDir) { Remove-Item -LiteralPath $LatestDir -Recurse -Force }
    Move-Item -LiteralPath $possibleDir.FullName -Destination $LatestDir -Force
}
Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue

# --- STEP 4: PASTIKAN FOLDER ---
$requiredBins = @(
    Join-Path $LatestDir "bin",
    Join-Path $SdkRoot "platform-tools",
    Join-Path $SdkRoot "emulator"
)
foreach ($p in $requiredBins) {
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}

# --- STEP 5: UPDATE PATH (System) ---
Write-Host "⚙️ Updating System PATH..."
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$toAdd = @(
    (Join-Path $LatestDir "bin"),
    (Join-Path $SdkRoot "platform-tools"),
    (Join-Path $SdkRoot "emulator")
)
foreach ($entry in $toAdd) {
    if ($machinePath -notlike "*$entry*") {
        $machinePath = $machinePath + ";" + $entry
    }
}
[Environment]::SetEnvironmentVariable("Path", $machinePath, "Machine")
Write-Host "✔ System PATH updated."

# --- STEP 6: SELESAI ---
Write-Host ""
Write-Host "🎉 Instalasi selesai!"
Write-Host "📂 SDK root: $SdkRoot"
Write-Host "👉 Restart terminal/VSCode agar PATH baru terbaca."
Write-Host "👉 Tes dengan:  sdkmanager --list"
Write-Host ""
# Pause agar log bisa terbaca
Read-Host -Prompt "Tekan Enter untuk menutup jendela"
