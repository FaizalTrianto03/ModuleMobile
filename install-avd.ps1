<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows
  + optional Hyper-V info, + Android Emulator Hypervisor Driver auto-install

.DESCRIPTION
  - Admin check
  - Download via HttpClient
  - Extract to C:\android\sdk\cmdline-tools\latest (proper structure)
  - Set System PATH + ANDROID_SDK_ROOT
  - OPTIONAL: Offer enable Hyper-V (for best performance), not required
  - Install essential SDK packages + Google Android Emulator Hypervisor Driver
  - Verify services (aehd, gvm); if missing => run driver installer from SDK path
#>

$ErrorActionPreference = "Stop"

function Test-Administrator {
  $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal   = New-Object Security.Principal.WindowsPrincipal($currentUser)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
  Write-Host "❌ ERROR: This script requires Administrator privileges!" -ForegroundColor Red
  Write-Host "👉 Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
  pause; exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green

# --- OPTIONAL: HYPER-V INFO & OFFER ENABLE ---
Write-Host ""
Write-Host "🔍 Mengecek status Hyper-V (opsional, tidak wajib)..." -ForegroundColor Cyan
$restartRequired = $false
$enabledFeatures = @()
$skippedFeatures = @()

$hyperVFeature = @{
  Name        = "Microsoft-Hyper-V-All"
  DisplayName = "Hyper-V"
  Description = "Platform virtualisasi bawaan Windows. Jika aktif, emulator Android biasanya lebih kencang."
}

try {
  $hvInfo = Get-WindowsOptionalFeature -Online -FeatureName $hyperVFeature.Name
  $hvEnabled = $hvInfo.State -eq "Enabled"
  if ($hvEnabled) {
    Write-Host "  ✅ Hyper-V: Enabled — performa emulator umumnya lebih baik." -ForegroundColor Green
  } else {
    Write-Host "  ⚠️ Hyper-V: Disabled — emulator akan menggunakan Android Emulator Hypervisor Driver (AEHD)." -ForegroundColor Yellow
    Write-Host "     Ini tetap berfungsi, namun performa mungkin tidak sebaik Hyper-V." -ForegroundColor Gray
    Write-Host ""
    Write-Host "[Y] Enable Hyper-V (opsional, perlu restart)" -ForegroundColor Green
    Write-Host "[N] Biarkan nonaktif (gunakan AEHD)" -ForegroundColor Yellow
    do {
      $ch = Read-Host "Aktifkan Hyper-V? (Y/N)"
      if ($ch.ToUpper() -eq 'Y') {
        try {
          Enable-WindowsOptionalFeature -Online -FeatureName $hyperVFeature.Name -All -NoRestart
          Write-Host "✅ Hyper-V diaktifkan." -ForegroundColor Green
          $enabledFeatures += $hyperVFeature.DisplayName
          $restartRequired = $true
        } catch {
          Write-Host "❌ Gagal enable Hyper-V: $($_.Exception.Message)" -ForegroundColor Red
          $skippedFeatures += $hyperVFeature.DisplayName
        }
        break
      } elseif ($ch.ToUpper() -eq 'N') {
        Write-Host "⏭️ Melewati enable Hyper-V. Akan mengandalkan AEHD." -ForegroundColor Cyan
        break
      } else {
        Write-Host "❌ Input tidak valid. Masukkan Y atau N." -ForegroundColor Red
      }
    } while ($true)
  }
} catch {
  Write-Host "⚠️ Tidak dapat memeriksa Hyper-V: $($_.Exception.Message)" -ForegroundColor Yellow
}

# --- INSTALLATION CHECK ---
Write-Host ""
Write-Host "🔍 Checking for existing Android SDK installation..." -ForegroundColor Cyan

$AndroidSdkRoot = "C:\android\sdk"
$CmdlineDir     = "$AndroidSdkRoot\cmdline-tools"
$LatestDir      = "$CmdlineDir\latest"
$PlatformTools  = "$AndroidSdkRoot\platform-tools"
$EmulatorDir    = "$AndroidSdkRoot\emulator"
$DownloadUrl    = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath        = "$env:TEMP\commandlinetools.zip"

$existingInstallation = $false
$installationDetails = @()

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
      $emu = Join-Path $location.Path "emulator.exe"
      if (Test-Path $emu) { $installationDetails += "    🎮 emulator.exe exists" }
    }
  }
}

$androidSdkRootEnv = [Environment]::GetEnvironmentVariable("ANDROID_SDK_ROOT", "Machine")
$androidHomeEnv    = [Environment]::GetEnvironmentVariable("ANDROID_HOME", "Machine")
$systemPath        = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($androidSdkRootEnv) { $existingInstallation = $true; $installationDetails += "  🔧 ANDROID_SDK_ROOT = $androidSdkRootEnv" }
if ($androidHomeEnv)    { $existingInstallation = $true; $installationDetails += "  🔧 ANDROID_HOME = $androidHomeEnv" }
if ($systemPath -like "*android*") { $existingInstallation = $true; $installationDetails += "  🛤️ Android paths found in System PATH" }

if ($existingInstallation) {
  Write-Host ""
  Write-Host "⚠️ EXISTING ANDROID SDK INSTALLATION DETECTED!" -ForegroundColor Yellow
  Write-Host "📋 Current Installation Details:" -ForegroundColor Cyan
  $installationDetails | ForEach-Object { Write-Host $_ -ForegroundColor White }
  Write-Host ""
  Write-Host "[1] 🗑️ Remove existing installation and install fresh" -ForegroundColor Red
  Write-Host "[2] ⏭️ Skip installation (keep existing)" -ForegroundColor Green
  Write-Host "[3] ❌ Cancel and exit" -ForegroundColor Gray
  do {
    $choice = Read-Host "Enter your choice (1/2/3)"
    switch ($choice) {
      "1" {
        Write-Host ""
        Write-Host "⚠️ WARNING: This will completely remove the existing Android SDK installation!" -ForegroundColor Red
        $confirm = Read-Host "Type 'YES' to confirm removal"
        if ($confirm -eq "YES") {
          foreach ($p in @($AndroidSdkRoot, "$env:LOCALAPPDATA\Android")) {
            if (Test-Path $p) {
              try { Remove-Item $p -Recurse -Force; Write-Host "✅ Removed: $p" -ForegroundColor Green }
              catch { Write-Host "❌ Failed to remove $p: $($_.Exception.Message)" -ForegroundColor Red }
            }
          }
          [Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $null, "Machine")
          [Environment]::SetEnvironmentVariable("ANDROID_HOME", $null, "Machine")
          $cur = [Environment]::GetEnvironmentVariable("Path","Machine")
          $new = ($cur -split ';' | Where-Object { $_ -notlike "*android*" -and $_ -notlike "*Android*" }) -join ';'
          [Environment]::SetEnvironmentVariable("Path",$new,"Machine")
          Write-Host "✅ Cleanup completed! Proceeding with fresh installation..." -ForegroundColor Green
          break
        } else {
          Write-Host "❌ Removal cancelled. Exiting..." -ForegroundColor Yellow
          pause; exit 0
        }
      }
      "2" { Write-Host "⏭️ Keeping existing installation. Exiting..." -ForegroundColor Green; pause; exit 0 }
      "3" { Write-Host "❌ Cancelled." -ForegroundColor Gray; pause; exit 0 }
      default { Write-Host "❌ Invalid choice." -ForegroundColor Red }
    }
  } while ($true)
} else {
  Write-Host "✅ No existing Android SDK installation found. Proceeding with fresh installation..." -ForegroundColor Green
}

# --- FAST DOWNLOAD ---
function Download-File($url, $outFile) {
  Write-Host "📥 Downloading: $url"
  Add-Type -AssemblyName System.Net.Http
  $client = New-Object System.Net.Http.HttpClient
  $client.Timeout = [TimeSpan]::FromMinutes(15)
  try {
    $resp = $client.GetAsync($url, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
    $resp.EnsureSuccessStatusCode()
    $total = $resp.Content.Headers.ContentLength
    $stream = $resp.Content.ReadAsStreamAsync().Result
    $fs = [IO.File]::Create($outFile)
    $buf = New-Object byte[] 8192
    $readTotal = 0; $last = -1
    while (($r = $stream.Read($buf,0,$buf.Length)) -gt 0) {
      $fs.Write($buf,0,$r); $readTotal += $r
      if ($total) {
        $p = [Math]::Floor(($readTotal/$total)*100)
        if ($p -ne $last) { Write-Progress -Activity "Downloading Android Command Line Tools..." -Status "$p% Complete" -PercentComplete $p; $last=$p }
      }
    }
    $fs.Close(); $stream.Close()
    Write-Host "✅ Download complete: $outFile" -ForegroundColor Green
  } finally { $client.Dispose() }
}

# --- CREATE DIRECTORIES ---
Write-Host "📁 Creating Android SDK directory structure..."
foreach ($d in @($AndroidSdkRoot,$CmdlineDir)) {
  if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null; Write-Host "Created: $d" -ForegroundColor Green }
}

# --- DOWNLOAD & EXTRACT ---
Download-File $DownloadUrl $ZipPath
Write-Host "📦 Extracting Android Command Line Tools..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force
if (Test-Path "$CmdlineDir\cmdline-tools") {
  if (Test-Path $LatestDir) { Remove-Item $LatestDir -Recurse -Force; Write-Host "Removed existing latest directory" -ForegroundColor Yellow }
  Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
  Write-Host "✅ Proper structure: $LatestDir" -ForegroundColor Green
}
Remove-Item $ZipPath -Force

foreach ($d in @($PlatformTools,$EmulatorDir)) {
  if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null; Write-Host "Created: $d" -ForegroundColor Green }
}

# --- ENV VARS & PATH ---
Write-Host ""
Write-Host "⚙️ Setting up System environment variables..."
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $AndroidSdkRoot, "Machine")
Write-Host "✅ ANDROID_SDK_ROOT = $AndroidSdkRoot" -ForegroundColor Green

$envPaths = @("$LatestDir\bin", $PlatformTools, $EmulatorDir)
$curPath = [Environment]::GetEnvironmentVariable("Path","Machine")
$updated = $false
foreach ($p in $envPaths) {
  if ($curPath -notlike "*$p*") { $curPath = "$curPath;$p"; $updated=$true; Write-Host "✅ Added to PATH: $p" -ForegroundColor Green }
  else { Write-Host "⚠️ Already in PATH: $p" -ForegroundColor Yellow }
}
if ($updated) {
  [Environment]::SetEnvironmentVariable("Path",$curPath,"Machine")
  Write-Host "✅ System PATH updated" -ForegroundColor Green
}

# --- VERIFY TOOLS ---
Write-Host ""
Write-Host "🔍 Verifying cmdline tools..."
$binPath = "$LatestDir\bin"
foreach ($f in @("sdkmanager.bat","avdmanager.bat")) {
  if (Test-Path (Join-Path $binPath $f)) { Write-Host "✅ Found: $f" -ForegroundColor Green }
  else { Write-Host "❌ Missing: $f" -ForegroundColor Red }
}

Write-Host ""
Write-Host "📋 Final structure:"
Write-Host "C:/android/sdk/"
Write-Host "├─ cmdline-tools/latest/bin (sdkmanager.bat, avdmanager.bat)"
Write-Host "├─ platform-tools/"
Write-Host "└─ emulator/"

# --- INSTALL PACKAGES (incl. Hypervisor Driver) ---
Write-Host ""
Write-Host "🔧 Installing essential Android SDK packages..." -ForegroundColor Yellow
$sdkManagerPath = "$LatestDir\bin\sdkmanager.bat"

$packages = @(
  "platform-tools",
  "emulator",
  "tools",
  "platforms;android-34",
  "build-tools;34.0.0",
  "extras;google;Android_Emulator_Hypervisor_Driver"
)

Write-Host "📦 Installing: $($packages -join ', ')" -ForegroundColor Cyan
try {
  & $sdkManagerPath @($packages)
  Write-Host "✅ Packages installed." -ForegroundColor Green
} catch {
  Write-Host "⚠️ Error installing packages: $($_.Exception.Message)" -ForegroundColor Red
}

# Accept licenses
Write-Host ""
Write-Host "📋 Accepting Android SDK licenses..." -ForegroundColor Yellow
try {
  $yesInput = ("y`n" * 20)
  $yesInput | & $sdkManagerPath --licenses
  Write-Host "✅ Licenses accepted." -ForegroundColor Green
} catch {
  Write-Host "⚠️ Error accepting licenses: $($_.Exception.Message)" -ForegroundColor Red
}

# --- FINAL VERIFICATION (ADB/Emulator) ---
Write-Host ""
if (Test-Path "$AndroidSdkRoot\platform-tools\adb.exe") { Write-Host "✅ ADB installed" -ForegroundColor Green } else { Write-Host "⚠️ ADB not found" -ForegroundColor Yellow }
if (Test-Path "$AndroidSdkRoot\emulator\emulator.exe")     { Write-Host "✅ Emulator installed" -ForegroundColor Green } else { Write-Host "⚠️ Emulator not found" -ForegroundColor Yellow }

# --- HELPER: service existence ---
function Test-ServiceExists {
  param([string]$Name)
  try {
    $null = Get-Service -Name $Name -ErrorAction Stop
    return $true
  } catch {
    # Fallback using 'sc query' and check for English message requested
    $out = sc.exe query $Name 2>&1 | Out-String
    if ($out -match "The specified service does not exist as an installed service") {
      return $false
    }
    # If message localized / unknown, treat as not found if exit code non-zero
    return $LASTEXITCODE -eq 0
  }
}

# --- CHECK AEHD / GVM & INSTALL DRIVER IF MISSING ---
Write-Host ""
Write-Host "🧪 Verifikasi layanan hypervisor emulator..." -ForegroundColor Cyan
$driverDir = "C:\android\sdk\extras\google\Android_Emulator_Hypervisor_Driver"
$driverSilent = Join-Path $driverDir "silent_install.bat"
$driverInstall = Join-Path $driverDir "install.bat"

# Tampilkan hasil 'sc query' sebagaimana diminta
Write-Host "▶ sc query aehd"
$scAehd = sc.exe query aehd 2>&1 | Tee-Object -Variable scAehdOut
$scAehdOut | ForEach-Object { $_ }

Write-Host ""
Write-Host "▶ sc query gvm"
$scGvm = sc.exe query gvm 2>&1 | Tee-Object -Variable scGvmOut
$scGvmOut | ForEach-Object { $_ }

$needInstallDriver = $false
if ($scAehdOut -match "The specified service does not exist as an installed service.") { $needInstallDriver = $true }
if ($scGvmOut  -match "The specified service does not exist as an installed service.") { $needInstallDriver = $true }

if ($needInstallDriver) {
  Write-Host ""
  Write-Host "⚠️ Layanan AEHD/GVM belum terpasang. Menjalankan installer driver dari:" -ForegroundColor Yellow
  Write-Host "   $driverDir" -ForegroundColor White

  if (Test-Path $driverSilent) {
    try {
      Write-Host "🔧 Running: $driverSilent" -ForegroundColor Cyan
      & $driverSilent
      Write-Host "✅ Driver installer (silent) dijalankan." -ForegroundColor Green
    } catch {
      Write-Host "❌ Gagal menjalankan silent installer: $($_.Exception.Message)" -ForegroundColor Red
    }
  } elseif (Test-Path $driverInstall) {
    try {
      Write-Host "🔧 Running: $driverInstall" -ForegroundColor Cyan
      & $driverInstall
      Write-Host "✅ Driver installer dijalankan." -ForegroundColor Green
    } catch {
      Write-Host "❌ Gagal menjalankan installer: $($_.Exception.Message)" -ForegroundColor Red
    }
  } else {
    Write-Host "❌ Installer tidak ditemukan di $driverDir" -ForegroundColor Red
    Write-Host "   Pastikan paket 'extras;google;Android_Emulator_Hypervisor_Driver' terpasang." -ForegroundColor Yellow
  }

  # Query ulang setelah pemasangan
  Write-Host ""
  Write-Host "🔁 Re-checking services after installer..." -ForegroundColor Cyan
  Write-Host "▶ sc query aehd"
  sc.exe query aehd 2>&1 | ForEach-Object { $_ }
  Write-Host ""
  Write-Host "▶ sc query gvm"
  sc.exe query gvm 2>&1 | ForEach-Object { $_ }
} else {
  Write-Host ""
  Write-Host "✅ Layanan AEHD/GVM terdeteksi. Tidak perlu install driver tambahan." -ForegroundColor Green
}

# --- SUMMARY / RESTART NOTICE ---
Write-Host ""
if ($enabledFeatures.Count -gt 0 -and $restartRequired) {
  Write-Host "⚠️ SYSTEM RESTART REQUIRED (Hyper-V baru diaktifkan)" -ForegroundColor Red
  Write-Host "[Y] Restart sekarang  |  [N] Nanti saja"
  do {
    $r = Read-Host "Restart system now? (Y/N)"
    if ($r.ToUpper() -eq 'Y') {
      Write-Host "🔄 Restarting in 10s... (Ctrl+C to cancel)"; Start-Sleep 10; Restart-Computer -Force
      break
    } elseif ($r.ToUpper() -eq 'N') {
      Write-Host "⏭️ Restart ditunda. Hyper-V aktif setelah restart." -ForegroundColor Yellow
      break
    } else {
      Write-Host "❌ Input tidak valid." -ForegroundColor Red
    }
  } while ($true)
} else {
  Write-Host "🎉 Setup selesai." -ForegroundColor Green
  Write-Host "🧪 Coba:  adb version" -ForegroundColor White
  Write-Host "📱 Buat AVD:  avdmanager create avd -n test -k system-images;android-34;google_apis;x86_64" -ForegroundColor White
}

Write-Host ""
Write-Host "ℹ️ Catatan:" -ForegroundColor Cyan
Write-Host " - Hyper-V opsional. Jika aktif: performa emulator lebih kencang." -ForegroundColor White
Write-Host " - Jika tidak aktif: emulator memakai AEHD; tetap jalan tapi bisa sedikit lebih lambat." -ForegroundColor White

if (-not $restartRequired) { pause }
