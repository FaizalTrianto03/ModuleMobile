<#
Bootstrapper pipable:
  irm https://raw.githubusercontent.com/<username>/<repo>/main/install.ps1 | iex
Tugas: download installer (.ps1) ke temp, verifikasi hash (opsional), lalu jalankan elevated.
#>

param()
$ErrorActionPreference = "Stop"

$InstallerUrl = "https://raw.githubusercontent.com/FaizalTrianto03/ModuleMobile/refs/heads/script/install-avd-bootstrap.ps1"
$LocalInstaller = Join-Path $env:TEMP "install-avd.ps1"
$TryUrls = @(
    $InstallerUrl
    # tambahkan mirror jika mau
)

Write-Host "📥 Mengunduh installer..."
# Prefer Invoke-RestMethod/Invoke-WebRequest, dengan fallback
$downloaded = $false
foreach ($u in $TryUrls) {
    try {
        if (Get-Command -Name Invoke-RestMethod -ErrorAction SilentlyContinue) {
            Invoke-RestMethod -Uri $u -OutFile $LocalInstaller -UseBasicParsing -TimeoutSec 300
        }
        else {
            $wc = New-Object Net.WebClient
            $wc.DownloadFile($u, $LocalInstaller)
        }
        $downloaded = $true
        break
    } catch {
        Write-Warning "Gagal download dari $u : $($_.Exception.Message)"
    }
}
if (-not $downloaded) {
    Write-Error "Gagal mengunduh installer dari semua sumber. Periksa koneksi atau antivirus."
    exit 1
}

# Optional: integrity check (sesuaikan hash jika tersedia)
# Jika kamu punya SHA256 hex string publish di repo, taruh di $KnownHash
$KnownHash = ""   # contoh: "AB12...". Jika kosong, verifikasi dilewati.
if ($KnownHash) {
    try {
        $stream = [System.IO.File]::OpenRead($LocalInstaller)
        $sha = [System.Security.Cryptography.SHA256]::Create()
        $hashBytes = $sha.ComputeHash($stream)
        $stream.Close()
        $hex = ($hashBytes | ForEach-Object { $_.ToString("x2") }) -join ""
        if ($hex -ne $KnownHash.ToLower()) {
            Write-Error "Hash mismatch! expected $KnownHash but got $hex"
            exit 1
        } else { Write-Host "✔ Installer integrity verified." }
    } catch {
        Write-Warning "Gagal verifikasi hash: $($_.Exception.Message)"
    }
}

# Relaunch elevated running the downloaded file (keamanan: -ExecutionPolicy Bypass -NoProfile)
$psExe = (Get-Command powershell.exe).Source
$arg = "-NoProfile -ExecutionPolicy Bypass -File `"$LocalInstaller`""
Write-Host "⚡ Membuka PowerShell elevated dan menjalankan installer..."
try {
    Start-Process -FilePath $psExe -ArgumentList $arg -Verb RunAs -Wait
} catch {
    Write-Error "Gagal start elevated process: $($_.Exception.Message)"
    Write-Host "Coba jalankan manual: Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File `"$LocalInstaller`''"
    exit 1
}

Write-Host "Installer selesai. Jika perlu, hapus file: $LocalInstaller"
