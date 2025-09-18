<#
Install Android Command Line Tools (avdmanager / sdkmanager / emulator)
Harus dijalankan sebagai Administrator (bootstrapper sudah menyediakannya).

Fitur:
- robust download (HttpClient jika tersedia, fallback ke WebClient/Invoke-WebRequest)
- progress
- extract ke C:\android\sdk\cmdline-tools\latest
- set System PATH (memerlukan admin)
- optional: keep window open until user presses Enter (agar log terbaca)
#>

param()
$ErrorActionPreference = "Stop"

function Assert-RunAsAdmin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($id)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
        Write-Error "Script harus dijalankan sebagai Administrator. Exit."
        exit 1
    }
}
Assert-RunAsAdmin

# CONFIG
$SdkRoot     = "C:\android\sdk"
$CmdlineDir  = Join-Path $SdkRoot "cmdline-tools"
$LatestDir   = Join-Path $CmdlineDir "latest"
# update URL kalau versi baru tersedia
$DownloadUrl = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath     = Join-Path $env:TEMP "commandlinetools.zip"

# Ensure TLS12
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

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
        $read = 0
        $done = 0
        while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $fs.Write($buffer, 0, $read)
            $done += $read
            if ($total) {
                $pct = [int](($done / $total) * 100)
                Write-Progress -Activity "Downloading" -Status "$pct% ($([math]::Round($done/1MB,2)) MB / $([math]::Round($total/1MB,2)) MB)" -PercentComplete $pct
            } else {
                Write-Progress -Activity "Downloading" -Status "$([math]::Round($done/1MB,2)) MB downloaded"
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
        if (Get-Command -Name Invoke-WebRequest -ErrorAction SilentlyContinue) {
            Invoke-WebRequest -Uri $url -OutFile $outfile -UseBasicParsing -TimeoutSec 120
        } else {
            $wc = New-Object Net.WebClient
            $wc.DownloadFile($url, $outfile)
        }
        Write-Host "✅ Downloaded to $outfile"
        return $true
    } catch {
        Write-Warning "Fallback download failed: $($_.Exception.Message)"
        return $false
    }
}

# download robust: try HttpClient then fallback
$ok = Download-WithHttpClient -url $DownloadUrl -outfile $ZipPath
if (-not $ok) { $ok = Download-Fallback -url $DownloadUrl -outfile $ZipPath }
if (-not $ok) { Write-Error "Gagal mendownload command line tools"; exit 1 }

# Prepare directories
if (-not (Test-Path $SdkRoot)) { New-Item -ItemType Directory -Path $SdkRoot -Force | Out-Null }
if (-not (Test-Path $CmdlineDir)) { New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null }

# Extract
Write-Host "📦 Extracting $ZipPath to $CmdlineDir ..."
try {
    Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force
} catch {
    Write-Error "Gagal extract: $($_.Exception.Message)"
    exit 1
}

# Move into latest if extracted folder is 'cmdline-tools'
$possible = Join-Path $CmdlineDir "cmdline-tools"
if (Test-Path $possible) {
    if (Test-Path $LatestDir) { Remove-Item $LatestDir -Recurse -Force }
    Move-Item -Path $possible -Destination $LatestDir
}

# Clean zip
Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue

# Ensure expected folders exist
$requiredBins = @(
    Join-Path $LatestDir "bin",
    Join-Path $SdkRoot "platform-tools",
    Join-Path $SdkRoot "emulator"
)
foreach ($p in $requiredBins) {
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}

# Update System PATH (Admin)
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

# Optional: accept licenses & install platform-tools + emulator (uncomment to enable)
# Write-Host "Meng-install platform-tools & emulator via sdkmanager..."
# & "$($LatestDir)\bin\sdkmanager.bat" --sdk_root="$SdkRoot" "platform-tools" "emulator" --install
# & "$($LatestDir)\bin/sdkmanager.bat" --sdk_root="$SdkRoot" --licenses

Write-Host ""
Write-Host "🎉 Selesai!"
Write-Host "Folder SDK root: $SdkRoot"
Write-Host "Periksa: avdmanager sdkmanager emulator di: $($LatestDir)\bin"
Write-Host ""
Write-Host "NOTE: Restart terminal / VSCode agar PATH baru terbaca."
Write-Host ""
Read-Host -Prompt "Tekan Enter untuk menutup jendela (agar log tetap terlihat)"
