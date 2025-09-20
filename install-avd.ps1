#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows
  following proper Android SDK folder structure with System environment variables.

.DESCRIPTION
  - Check for Administrator privileges
  - Download dengan HttpClient (lebih cepat dari Invoke-WebRequest)
  - Extract ke C:\android\sdk\cmdline-tools\latest (proper Android SDK structure)
  - Update PATH di System scope (requires admin)
  - Follow official Android SDK folder structure guidelines
  - Install Android Emulator Hypervisor Driver if needed
  - Support English and Indonesian language
#>

$ErrorActionPreference = "Stop"

# --- LANGUAGE SELECTION ---
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   Android SDK Installer                     ║" -ForegroundColor Cyan
Write-Host "║                      Language Selection                     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please select your preferred language:" -ForegroundColor Yellow
Write-Host "Silakan pilih bahasa yang Anda inginkan:" -ForegroundColor Yellow
Write-Host ""
Write-Host "[1] 🇺🇸 English" -ForegroundColor Green
Write-Host "[2] 🇮🇩 Bahasa Indonesia" -ForegroundColor Green
Write-Host ""

do {
    $langChoice = Read-Host "Enter your choice / Masukkan pilihan Anda (1/2)"
    switch ($langChoice) {
        "1" {
            $LANG = "EN"
            break
        }
        "2" {
            $LANG = "ID"
            break
        }
        default {
            Write-Host "❌ Invalid choice. Please enter 1 or 2. / Pilihan tidak valid. Silakan masukkan 1 atau 2." -ForegroundColor Red
        }
    }
} while ($langChoice -notin @("1", "2"))

# --- LANGUAGE STRINGS ---
if ($LANG -eq "EN") {
    $strings = @{
        AdminRequired = "❌ ERROR: This script requires Administrator privileges!"
        AdminInstructions = "👉 Please run PowerShell as Administrator and try again."
        AdminHowTo = "Right-click on PowerShell → 'Run as Administrator'"
        AdminSuccess = "✅ Running with Administrator privileges"
        
        CheckingVirtualization = "🔍 Checking Windows virtualization features..."
        VirtualizationStatus = "📋 Current virtualization features status:"
        HyperVEnabled = "✅ Hyper-V: Enabled"
        HyperVDisabled = "❌ Hyper-V: Disabled"
        HyperVOptimal = "🚀 Android Emulator will use Hyper-V for optimal performance"
        HyperVAlternative = "💡 Android Emulator will use Android Emulator Hypervisor Driver instead"
        CouldNotCheck = "⚠️ Could not check status"
        
        HyperVAlreadyEnabled = "✅ Hyper-V is already enabled!"
        HyperVWillUse = "🎮 Android Emulator will have optimal performance with Hyper-V"
        HyperVNotEnabled = "💡 Hyper-V is not enabled"
        HyperVOptional = "🎮 Android Emulator will use Android Emulator Hypervisor Driver (good performance)"
        HyperVBenefits = "📝 Benefits of enabling Hyper-V:"
        HyperVBenefit1 = "  • Better Android Emulator performance"
        HyperVBenefit2 = "  • Hardware acceleration support"
        HyperVBenefit3 = "  • More stable virtualization"
        
        EnableHyperV = "Would you like to enable Hyper-V for better performance?"
        RestartRequired = "(System restart will be required)"
        EnableYes = "[Y] Yes, enable Hyper-V"
        EnableNo = "[N] No, use Android Emulator Hypervisor Driver instead"
        
        EnablingHyperV = "🔧 Enabling Hyper-V..."
        TakeFewMinutes = "This may take several minutes..."
        HyperVEnabledSuccess = "✅ Hyper-V enabled successfully!"
        HyperVFailedEnable = "❌ Failed to enable Hyper-V:"
        ManualCommand = "💡 Manual command: Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All"
        RestartImportant = "⚠️ IMPORTANT: System restart will be required after installation completes"
        
        SkippingHyperV = "⏭️ Skipping Hyper-V enablement"
        WillUseSoftware = "💡 Note: Android Emulator will use Android Emulator Hypervisor Driver"
        ManualEnableHyperV = "🔧 You can enable Hyper-V manually later via Windows Features"
        
        CheckingExisting = "🔍 Checking for existing Android SDK installation..."
        ExistingDetected = "⚠️ EXISTING ANDROID SDK INSTALLATION DETECTED!"
        InstallationDetails = "📋 Current Installation Details:"
        WhatToDo = "🤔 What would you like to do?"
        RemoveExisting = "[1] 🗑️ Remove existing installation and install fresh"
        KeepExisting = "[2] ⏭️ Skip installation (keep existing)"
        CancelExit = "[3] ❌ Cancel and exit"
        
        RemoveWarning = "⚠️ WARNING: This will completely remove the existing Android SDK installation!"
        RemoveConfirm = "Are you absolutely sure? This action cannot be undone!"
        TypeYES = "Type 'YES' (all caps) to confirm removal"
        RemovingExisting = "🗑️ Removing existing Android SDK installation..."
        CleanupCompleted = "✅ Cleanup completed! Proceeding with fresh installation..."
        RemovalCancelled = "❌ Removal cancelled. Exiting..."
        
        SkippedInstallation = "⏭️ Installation skipped. Your existing Android SDK will remain unchanged."
        ExistingUsage = "💡 If you want to use the existing installation:"
        CancelledInstallation = "❌ Installation cancelled. Exiting..."
        
        NoExistingFound = "✅ No existing Android SDK installation found. Proceeding with fresh installation..."
        
        CreatingStructure = "📁 Creating Android SDK directory structure..."
        Downloading = "📥 Downloading:"
        DownloadComplete = "✅ Download complete:"
        Extracting = "📦 Extracting Android Command Line Tools..."
        MovedStructure = "✅ Moved to proper structure:"
        CleanupTemp = "🗑️ Cleaned up temporary files"
        
        CreatingAdditional = "📁 Creating additional SDK directories..."
        SettingEnvironment = "⚙️ Setting up System environment variables..."
        AndroidSdkRootSet = "✅ ANDROID_SDK_ROOT ="
        AddedToPath = "✅ Added to PATH:"
        AlreadyInPath = "⚠️ Already in PATH:"
        PathUpdated = "✅ System PATH updated successfully!"
        PathExists = "ℹ️ All paths already exist in System PATH"
        
        VerifyingInstall = "🔍 Verifying installation..."
        Found = "✅ Found:"
        Missing = "❌ Missing:"
        
        FinalStructure = "📋 Final Android SDK folder structure:"
        
        InstallingPackages = "🔧 Installing essential Android SDK packages..."
        PleaseWait = "This may take a few minutes, please wait..."
        PackagesInstalling = "📦 Installing packages:"
        PackagesSuccess = "✅ Essential packages installed successfully!"
        PackagesError = "⚠️ Error installing packages:"
        ManualInstall = "You can manually install later with:"
        
        AcceptingLicenses = "📋 Accepting Android SDK licenses..."
        LicensesAccepted = "✅ All SDK licenses accepted!"
        LicensesError = "⚠️ Error accepting licenses:"
        ManualLicenses = "You can manually accept licenses later with: sdkmanager --licenses"
        
        CheckingDriverServices = "🔍 Checking Android Emulator Hypervisor Driver services..."
        ServiceExists = "✅ SERVICE service exists"
        ServiceNotExist = "❌ SERVICE service does not exist"
        
        InstallingDriver = "🔧 Android Emulator Hypervisor Driver services not found. Installing driver..."
        FoundInstaller = "📁 Found driver installer at:"
        RunningInstaller = "⚙️ Running Android Emulator Hypervisor Driver installer..."
        DriverInstallComplete = "✅ Android Emulator Hypervisor Driver installation completed!"
        VerifyingDriver = "🔍 Verifying driver installation..."
        ServiceNowExists = "✅ SERVICE service now exists"
        ServiceStillNotFound = "⚠️ SERVICE service still not found"
        CouldNotVerify = "⚠️ Could not verify SERVICE service"
        DriverInstallFailed = "❌ Failed to install Android Emulator Hypervisor Driver:"
        ManualDriverInstall = "💡 You can manually install later by running:"
        DriverNotFound = "❌ Driver installer not found at:"
        CheckPackage = "💡 Make sure the 'extras;google;Android_Emulator_Hypervisor_Driver' package was installed correctly"
        DriverAlreadyInstalled = "✅ Android Emulator Hypervisor Driver services are already installed!"
        
        FinalVerification = "🔍 Final verification..."
        AdbSuccess = "✅ ADB installed successfully"
        AdbNotFound = "⚠️ ADB not found - platform-tools may not have installed correctly"
        EmulatorSuccess = "✅ Android Emulator installed successfully"
        EmulatorNotFound = "⚠️ Emulator not found - may not have installed correctly"
        DriverPackageFound = "✅ Android Emulator Hypervisor Driver package downloaded"
        DriverPackageNotFound = "⚠️ Hypervisor driver package not found"
        
        CompletedWithRestart = "🎉 Android SDK installation completed with Hyper-V enabled!"
        SystemRestartRequired = "⚠️ SYSTEM RESTART REQUIRED!"
        HyperVNeedsRestart = "🔄 Hyper-V requires a system restart to function properly"
        AfterRestart = "📝 After restart, you can:"
        TestAdb = "1. 🧪 Test ADB with: adb version"
        CreateAvd = "2. 📱 Create AVD with hardware acceleration"
        UseVSCode = "3. 🚀 Use VS Code AVD Manager extension"
        RestartNow = "Would you like to restart now?"
        RestartYes = "[Y] Yes, restart now"
        RestartNo = "[N] No, I'll restart later"
        RestartingIn10 = "🔄 Restarting system in 10 seconds..."
        PressCtrlC = "Press Ctrl+C to cancel"
        RestartPostponed = "⏭️ Restart postponed. Please restart manually when convenient."
        HyperVWontWork = "💡 Hyper-V will not work until system is restarted!"
        
        CompletedSuccess = "🎉 Android SDK installation and setup completed!"
        ReadyToUse = "📝 Ready to Use:"
        RestartTerminal = "1. 🔄 Restart your terminal to use commands globally"
        CreateAvdCommand = "3. 📱 Create AVD with: avdmanager create avd -n test -k system-images;android-34;google_apis;x86_64"
        
        InstalledPackages = "📦 Installed Packages:"
        PlatformTools = "   • Platform Tools (ADB, Fastboot)"
        AndroidEmulator = "   • Android Emulator"
        SdkTools = "   • Android SDK Tools"
        Android34 = "   • Android 34 (API Level 34)"
        BuildTools = "   • Build Tools 34.0.0"
        HypervisorDriver = "   • Android Emulator Hypervisor Driver"
        
        AccelerationStatus = "🎮 Emulator Acceleration Status:"
        HyperVMaxPerformance = "   🚀 Hyper-V: Enabled (Maximum Performance)"
        HyperVWillUseAccel = "      • Android Emulator will use Hyper-V acceleration"
        HyperVDisabledStatus = "   💡 Hyper-V: Disabled"
        WillUseDriverInstead = "      • Android Emulator will use Android Emulator Hypervisor Driver"
        SlightlyLowerPerf = "      • Performance may be slightly lower than Hyper-V but still good"
        CouldNotDetermineHyperV = "   ⚠️ Could not determine Hyper-V status"
        
        HypervisorServices = "🔧 Hypervisor Driver Services:"
        ServiceInstalled = "   ✅ SERVICE Service: Installed"
        ServiceNotFound = "   ❌ SERVICE Service: Not Found"
        CouldNotCheckService = "   ⚠️ Could not check SERVICE service"
        
        FeaturesEnabledDuring = "🔧 Features Enabled During Installation:"
        RequiresRestart = " (requires restart)"
        FeaturesAlreadyEnabled = "🔧 Virtualization Features (already enabled):"
        FeaturesFailed = "⚠️ Features That Failed to Enable:"
        ManualEnableFeatures = "💡 You can enable these manually via Windows Features"
        
        EnvironmentSet = "💡 Environment Variables Set:"
        PathIncludes = "   PATH includes all necessary SDK directories"
        
        PerformanceNotes = "📝 Performance Notes:"
        HyperVBest = "   • Hyper-V provides the best emulator performance"
        DriverAlternative = "   • Android Emulator Hypervisor Driver is a good alternative"
        BothProvideAccel = "   • Both provide hardware acceleration for smooth emulation"
        
        AllSetEnglish = "🚀 All set! You can now develop Android apps with hardware-accelerated emulation!"
        
        InvalidChoice = "❌ Invalid choice. Please enter Y or N."
        EnterChoice = "Enter your choice"
        Created = "Created:"
        Removed = "Removed:"
        FailedToRemove = "❌ Failed to remove:"
        Cleaning = "🧹 Cleaning environment variables..."
        SkippedCheck = "💡 Virtualization check skipped - continuing with installation..."
    }
} else {
    $strings = @{
        AdminRequired = "❌ ERROR: Script ini memerlukan hak Administrator!"
        AdminInstructions = "👉 Silakan jalankan PowerShell sebagai Administrator dan coba lagi."
        AdminHowTo = "Klik kanan pada PowerShell → 'Run as Administrator'"
        AdminSuccess = "✅ Berjalan dengan hak Administrator"
        
        CheckingVirtualization = "🔍 Memeriksa fitur virtualisasi Windows..."
        VirtualizationStatus = "📋 Status fitur virtualisasi saat ini:"
        HyperVEnabled = "✅ Hyper-V: Aktif"
        HyperVDisabled = "❌ Hyper-V: Nonaktif"
        HyperVOptimal = "🚀 Android Emulator akan menggunakan Hyper-V untuk performa optimal"
        HyperVAlternative = "💡 Android Emulator akan menggunakan Android Emulator Hypervisor Driver sebagai gantinya"
        CouldNotCheck = "⚠️ Tidak dapat memeriksa status"
        
        HyperVAlreadyEnabled = "✅ Hyper-V sudah aktif!"
        HyperVWillUse = "🎮 Android Emulator akan memiliki performa optimal dengan Hyper-V"
        HyperVNotEnabled = "💡 Hyper-V tidak aktif"
        HyperVOptional = "🎮 Android Emulator akan menggunakan Android Emulator Hypervisor Driver (performa bagus)"
        HyperVBenefits = "📝 Manfaat mengaktifkan Hyper-V:"
        HyperVBenefit1 = "  • Performa Android Emulator lebih baik"
        HyperVBenefit2 = "  • Dukungan akselerasi hardware"
        HyperVBenefit3 = "  • Virtualisasi lebih stabil"
        
        EnableHyperV = "Apakah Anda ingin mengaktifkan Hyper-V untuk performa yang lebih baik?"
        RestartRequired = "(Restart sistem akan diperlukan)"
        EnableYes = "[Y] Ya, aktifkan Hyper-V"
        EnableNo = "[N] Tidak, gunakan Android Emulator Hypervisor Driver saja"
        
        EnablingHyperV = "🔧 Mengaktifkan Hyper-V..."
        TakeFewMinutes = "Ini mungkin memakan waktu beberapa menit..."
        HyperVEnabledSuccess = "✅ Hyper-V berhasil diaktifkan!"
        HyperVFailedEnable = "❌ Gagal mengaktifkan Hyper-V:"
        ManualCommand = "💡 Perintah manual: Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All"
        RestartImportant = "⚠️ PENTING: Restart sistem akan diperlukan setelah instalasi selesai"
        
        SkippingHyperV = "⏭️ Melewati pengaktifan Hyper-V"
        WillUseSoftware = "💡 Catatan: Android Emulator akan menggunakan Android Emulator Hypervisor Driver"
        ManualEnableHyperV = "🔧 Anda dapat mengaktifkan Hyper-V secara manual nanti melalui Windows Features"
        
        CheckingExisting = "🔍 Memeriksa instalasi Android SDK yang sudah ada..."
        ExistingDetected = "⚠️ INSTALASI ANDROID SDK YANG SUDAH ADA TERDETEKSI!"
        InstallationDetails = "📋 Detail Instalasi Saat Ini:"
        WhatToDo = "🤔 Apa yang ingin Anda lakukan?"
        RemoveExisting = "[1] 🗑️ Hapus instalasi yang ada dan install fresh"
        KeepExisting = "[2] ⏭️ Lewati instalasi (pertahankan yang ada)"
        CancelExit = "[3] ❌ Batalkan dan keluar"
        
        RemoveWarning = "⚠️ PERINGATAN: Ini akan menghapus sepenuhnya instalasi Android SDK yang ada!"
        RemoveConfirm = "Apakah Anda benar-benar yakin? Tindakan ini tidak dapat dibatalkan!"
        TypeYES = "Ketik 'YES' (huruf besar semua) untuk konfirmasi penghapusan"
        RemovingExisting = "🗑️ Menghapus instalasi Android SDK yang ada..."
        CleanupCompleted = "✅ Pembersihan selesai! Melanjutkan dengan instalasi fresh..."
        RemovalCancelled = "❌ Penghapusan dibatalkan. Keluar..."
        
        SkippedInstallation = "⏭️ Instalasi dilewati. Android SDK yang ada akan tetap tidak berubah."
        ExistingUsage = "💡 Jika Anda ingin menggunakan instalasi yang ada:"
        CancelledInstallation = "❌ Instalasi dibatalkan. Keluar..."
        
        NoExistingFound = "✅ Tidak ditemukan instalasi Android SDK yang ada. Melanjutkan dengan instalasi fresh..."
        
        CreatingStructure = "📁 Membuat struktur direktori Android SDK..."
        Downloading = "📥 Mengunduh:"
        DownloadComplete = "✅ Unduhan selesai:"
        Extracting = "📦 Mengekstrak Android Command Line Tools..."
        MovedStructure = "✅ Dipindahkan ke struktur yang benar:"
        CleanupTemp = "🗑️ Membersihkan file sementara"
        
        CreatingAdditional = "📁 Membuat direktori SDK tambahan..."
        SettingEnvironment = "⚙️ Mengatur variabel environment sistem..."
        AndroidSdkRootSet = "✅ ANDROID_SDK_ROOT ="
        AddedToPath = "✅ Ditambahkan ke PATH:"
        AlreadyInPath = "⚠️ Sudah ada di PATH:"
        PathUpdated = "✅ System PATH berhasil diperbarui!"
        PathExists = "ℹ️ Semua path sudah ada di System PATH"
        
        VerifyingInstall = "🔍 Memverifikasi instalasi..."
        Found = "✅ Ditemukan:"
        Missing = "❌ Hilang:"
        
        FinalStructure = "📋 Struktur folder Android SDK final:"
        
        InstallingPackages = "🔧 Menginstall paket Android SDK penting..."
        PleaseWait = "Ini mungkin memakan waktu beberapa menit, harap tunggu..."
        PackagesInstalling = "📦 Menginstall paket:"
        PackagesSuccess = "✅ Paket penting berhasil diinstall!"
        PackagesError = "⚠️ Error menginstall paket:"
        ManualInstall = "Anda dapat menginstall secara manual nanti dengan:"
        
        AcceptingLicenses = "📋 Menerima lisensi Android SDK..."
        LicensesAccepted = "✅ Semua lisensi SDK diterima!"
        LicensesError = "⚠️ Error menerima lisensi:"
        ManualLicenses = "Anda dapat menerima lisensi secara manual nanti dengan: sdkmanager --licenses"
        
        CheckingDriverServices = "🔍 Memeriksa service Android Emulator Hypervisor Driver..."
        ServiceExists = "✅ Service SERVICE ada"
        ServiceNotExist = "❌ Service SERVICE tidak ada"
        
        InstallingDriver = "🔧 Service Android Emulator Hypervisor Driver tidak ditemukan. Menginstall driver..."
        FoundInstaller = "📁 Ditemukan installer driver di:"
        RunningInstaller = "⚙️ Menjalankan installer Android Emulator Hypervisor Driver..."
        DriverInstallComplete = "✅ Instalasi Android Emulator Hypervisor Driver selesai!"
        VerifyingDriver = "🔍 Memverifikasi instalasi driver..."
        ServiceNowExists = "✅ Service SERVICE sekarang ada"
        ServiceStillNotFound = "⚠️ Service SERVICE masih tidak ditemukan"
        CouldNotVerify = "⚠️ Tidak dapat memverifikasi service SERVICE"
        DriverInstallFailed = "❌ Gagal menginstall Android Emulator Hypervisor Driver:"
        ManualDriverInstall = "💡 Anda dapat menginstall secara manual nanti dengan menjalankan:"
        DriverNotFound = "❌ Installer driver tidak ditemukan di:"
        CheckPackage = "💡 Pastikan paket 'extras;google;Android_Emulator_Hypervisor_Driver' sudah diinstall dengan benar"
        DriverAlreadyInstalled = "✅ Service Android Emulator Hypervisor Driver sudah terinstall!"
        
        FinalVerification = "🔍 Verifikasi final..."
        AdbSuccess = "✅ ADB berhasil diinstall"
        AdbNotFound = "⚠️ ADB tidak ditemukan - platform-tools mungkin tidak terinstall dengan benar"
        EmulatorSuccess = "✅ Android Emulator berhasil diinstall"
        EmulatorNotFound = "⚠️ Emulator tidak ditemukan - mungkin tidak terinstall dengan benar"
        DriverPackageFound = "✅ Paket Android Emulator Hypervisor Driver terunduh"
        DriverPackageNotFound = "⚠️ Paket hypervisor driver tidak ditemukan"
        
        CompletedWithRestart = "🎉 Instalasi Android SDK selesai dengan Hyper-V diaktifkan!"
        SystemRestartRequired = "⚠️ RESTART SISTEM DIPERLUKAN!"
        HyperVNeedsRestart = "🔄 Hyper-V memerlukan restart sistem untuk berfungsi dengan benar"
        AfterRestart = "📝 Setelah restart, Anda dapat:"
        TestAdb = "1. 🧪 Test ADB dengan: adb version"
        CreateAvd = "2. 📱 Buat AVD dengan akselerasi hardware"
        UseVSCode = "3. 🚀 Gunakan VS Code AVD Manager extension"
        RestartNow = "Apakah Anda ingin restart sekarang?"
        RestartYes = "[Y] Ya, restart sekarang"
        RestartNo = "[N] Tidak, saya akan restart nanti"
        RestartingIn10 = "🔄 Merestart sistem dalam 10 detik..."
        PressCtrlC = "Tekan Ctrl+C untuk membatalkan"
        RestartPostponed = "⏭️ Restart ditunda. Silakan restart secara manual saat nyaman."
        HyperVWontWork = "💡 Hyper-V tidak akan bekerja sampai sistem direstart!"
        
        CompletedSuccess = "🎉 Instalasi dan setup Android SDK selesai!"
        ReadyToUse = "📝 Siap Digunakan:"
        RestartTerminal = "1. 🔄 Restart terminal Anda untuk menggunakan command secara global"
        CreateAvdCommand = "3. 📱 Buat AVD dengan: avdmanager create avd -n test -k system-images;android-34;google_apis;x86_64"
        
        InstalledPackages = "📦 Paket Yang Diinstall:"
        PlatformTools = "   • Platform Tools (ADB, Fastboot)"
        AndroidEmulator = "   • Android Emulator"
        SdkTools = "   • Android SDK Tools"
        Android34 = "   • Android 34 (API Level 34)"
        BuildTools = "   • Build Tools 34.0.0"
        HypervisorDriver = "   • Android Emulator Hypervisor Driver"
        
        AccelerationStatus = "🎮 Status Akselerasi Emulator:"
        HyperVMaxPerformance = "   🚀 Hyper-V: Aktif (Performa Maksimal)"
        HyperVWillUseAccel = "      • Android Emulator akan menggunakan akselerasi Hyper-V"
        HyperVDisabledStatus = "   💡 Hyper-V: Nonaktif"
        WillUseDriverInstead = "      • Android Emulator akan menggunakan Android Emulator Hypervisor Driver"
        SlightlyLowerPerf = "      • Performa mungkin sedikit lebih rendah dari Hyper-V tapi masih bagus"
        CouldNotDetermineHyperV = "   ⚠️ Tidak dapat menentukan status Hyper-V"
        
        HypervisorServices = "🔧 Service Hypervisor Driver:"
        ServiceInstalled = "   ✅ Service SERVICE: Terinstall"
        ServiceNotFound = "   ❌ Service SERVICE: Tidak Ditemukan"
        CouldNotCheckService = "   ⚠️ Tidak dapat memeriksa service SERVICE"
        
        FeaturesEnabledDuring = "🔧 Fitur Yang Diaktifkan Selama Instalasi:"
        RequiresRestart = " (memerlukan restart)"
        FeaturesAlreadyEnabled = "🔧 Fitur Virtualisasi (sudah aktif):"
        FeaturesFailed = "⚠️ Fitur Yang Gagal Diaktifkan:"
        ManualEnableFeatures = "💡 Anda dapat mengaktifkan ini secara manual melalui Windows Features"
        
        EnvironmentSet = "💡 Variabel Environment Yang Diatur:"
        PathIncludes = "   PATH menyertakan semua direktori SDK yang diperlukan"
        
        PerformanceNotes = "📝 Catatan Performa:"
        HyperVBest = "   • Hyper-V memberikan performa emulator terbaik"
        DriverAlternative = "   • Android Emulator Hypervisor Driver adalah alternatif yang bagus"
        BothProvideAccel = "   • Keduanya menyediakan akselerasi hardware untuk emulasi yang lancar"
        
        AllSetEnglish = "🚀 Semua siap! Anda sekarang dapat mengembangkan aplikasi Android dengan emulasi berakselerasi hardware!"
        
        InvalidChoice = "❌ Pilihan tidak valid. Silakan masukkan Y atau N."
        EnterChoice = "Masukkan pilihan Anda"
        Created = "Dibuat:"
        Removed = "Dihapus:"
        FailedToRemove = "❌ Gagal menghapus:"
        Cleaning = "🧹 Membersihkan variabel environment..."
        SkippedCheck = "💡 Pengecekan virtualisasi dilewati - melanjutkan instalasi..."
    }
}

Clear-Host

# --- ADMIN CHECK ---
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Host $strings.AdminRequired -ForegroundColor Red
    Write-Host $strings.AdminInstructions -ForegroundColor Yellow
    Write-Host ""
    Write-Host $strings.AdminHowTo -ForegroundColor Cyan
    pause
    exit 1
}

Write-Host $strings.AdminSuccess -ForegroundColor Green

# --- VIRTUALIZATION FEATURES CHECK ---
Write-Host ""
Write-Host $strings.CheckingVirtualization -ForegroundColor Cyan

# Initialize tracking variables
$restartRequired = $false
$enabledFeatures = @()
$skippedFeatures = @()

try {
    # Check Hyper-V status
    $hyperVStatus = $null
    $hyperVEnabled = $false
    
    Write-Host $strings.VirtualizationStatus -ForegroundColor Cyan
    
    try {
        $hyperVStatus = Get-WindowsOptionalFeature -Online -FeatureName "Microsoft-Hyper-V-All"
        $hyperVEnabled = $hyperVStatus.State -eq "Enabled"
        
        if ($hyperVEnabled) {
            Write-Host "  $($strings.HyperVEnabled)" -ForegroundColor Green
            Write-Host "    $($strings.HyperVOptimal)" -ForegroundColor Green
        } else {
            Write-Host "  $($strings.HyperVDisabled)" -ForegroundColor Red
            Write-Host "    $($strings.HyperVAlternative)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  $($strings.CouldNotCheck)" -ForegroundColor Yellow
    }
    
    if ($hyperVEnabled) {
        Write-Host ""
        Write-Host $strings.HyperVAlreadyEnabled -ForegroundColor Green
        Write-Host $strings.HyperVWillUse -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host $strings.HyperVNotEnabled -ForegroundColor Yellow
        Write-Host $strings.HyperVOptional -ForegroundColor Cyan
        Write-Host ""
        Write-Host $strings.HyperVBenefits -ForegroundColor Cyan
        Write-Host $strings.HyperVBenefit1 -ForegroundColor White
        Write-Host $strings.HyperVBenefit2 -ForegroundColor White
        Write-Host $strings.HyperVBenefit3 -ForegroundColor White
        Write-Host ""
        Write-Host $strings.EnableHyperV -ForegroundColor Yellow
        Write-Host $strings.RestartRequired -ForegroundColor Red
        Write-Host ""
        Write-Host $strings.EnableYes -ForegroundColor Green
        Write-Host $strings.EnableNo -ForegroundColor Red
        Write-Host ""
        
        do {
            $virtualizationChoice = Read-Host "$($strings.EnableHyperV.Replace('?', '')) (Y/N)"
            switch ($virtualizationChoice.ToUpper()) {
                "Y" {
                    Write-Host ""
                    Write-Host $strings.EnablingHyperV -ForegroundColor Yellow
                    Write-Host $strings.TakeFewMinutes -ForegroundColor Cyan
                    
                    try {
                        Enable-WindowsOptionalFeature -Online -FeatureName "Microsoft-Hyper-V-All" -All -NoRestart
                        Write-Host $strings.HyperVEnabledSuccess -ForegroundColor Green
                        $enabledFeatures += "Hyper-V"
                        $restartRequired = $true
                    } catch {
                        Write-Host "$($strings.HyperVFailedEnable) $($_.Exception.Message)" -ForegroundColor Red
                        Write-Host $strings.ManualCommand -ForegroundColor Gray
                        $skippedFeatures += "Hyper-V"
                    }
                    
                    if ($restartRequired) {
                        Write-Host ""
                        Write-Host $strings.RestartImportant -ForegroundColor Red
                    }
                    break
                }
                "N" {
                    Write-Host ""
                    Write-Host $strings.SkippingHyperV -ForegroundColor Yellow
                    Write-Host $strings.WillUseSoftware -ForegroundColor Cyan
                    Write-Host $strings.ManualEnableHyperV -ForegroundColor Gray
                    break
                }
                default {
                    Write-Host $strings.InvalidChoice -ForegroundColor Red
                }
            }
        } while ($virtualizationChoice.ToUpper() -notin @("Y", "N"))
    }
} catch {
    Write-Host "$($strings.CouldNotCheck): $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host $strings.SkippedCheck -ForegroundColor Cyan
    $restartRequired = $false
}

# --- INSTALLATION CHECK ---
Write-Host ""
Write-Host $strings.CheckingExisting -ForegroundColor Cyan

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
        $installationDetails += "  ✅ $($strings.Found): $($location.Name) at $($location.Path)"
        
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
    Write-Host $strings.ExistingDetected -ForegroundColor Yellow
    Write-Host ""
    Write-Host $strings.InstallationDetails -ForegroundColor Cyan
    foreach ($detail in $installationDetails) {
        Write-Host $detail -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host $strings.WhatToDo -ForegroundColor Yellow
    Write-Host ""
    Write-Host $strings.RemoveExisting -ForegroundColor Red
    Write-Host $strings.KeepExisting -ForegroundColor Green  
    Write-Host $strings.CancelExit -ForegroundColor Gray
    Write-Host ""
    
    do {
        $choice = Read-Host "$($strings.EnterChoice) (1/2/3)"
        switch ($choice) {
            "1" {
                Write-Host ""
                Write-Host $strings.RemoveWarning -ForegroundColor Red
                Write-Host $strings.RemoveConfirm -ForegroundColor Red
                $confirm = Read-Host $strings.TypeYES
                
                if ($confirm -eq "YES") {
                    Write-Host ""
                    Write-Host $strings.RemovingExisting -ForegroundColor Red
                    
                    # Remove directories
                    $removePaths = @($AndroidSdkRoot, "$env:LOCALAPPDATA\Android")
                    foreach ($removePath in $removePaths) {
                        if (Test-Path $removePath) {
                            try {
                                Remove-Item $removePath -Recurse -Force
                                Write-Host "✅ $($strings.Removed): $removePath" -ForegroundColor Green
                            } catch {
                                Write-Host "$($strings.FailedToRemove): $removePath - $($_.Exception.Message)" -ForegroundColor Red
                            }
                        }
                    }
                    
                    # Clean environment variables
                    Write-Host $strings.Cleaning -ForegroundColor Yellow
                    [Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $null, "Machine")
                    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $null, "Machine")
                    
                    # Clean PATH
                    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
                    $pathArray = $currentPath -split ';'
                    $cleanedPath = $pathArray | Where-Object { $_ -notlike "*android*" -and $_ -notlike "*Android*" }
                    $newPath = $cleanedPath -join ';'
                    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
                    
                    Write-Host $strings.CleanupCompleted -ForegroundColor Green
                    $proceed = $true
                    break
                } else {
                    Write-Host $strings.RemovalCancelled -ForegroundColor Yellow
                    pause
                    exit 0
                }
            }
            "2" {
                Write-Host ""
                Write-Host $strings.SkippedInstallation -ForegroundColor Green
                Write-Host ""
                Write-Host $strings.ExistingUsage -ForegroundColor Cyan
                Write-Host "1. Make sure your environment variables are set correctly"
                Write-Host "2. Test with: sdkmanager --list"
                Write-Host "3. Accept licenses with: sdkmanager --licenses"
                Write-Host ""
                pause
                exit 0
            }
            "3" {
                Write-Host ""
                Write-Host $strings.CancelledInstallation -ForegroundColor Gray
                pause
                exit 0
            }
            default {
                Write-Host $strings.InvalidChoice -ForegroundColor Red
            }
        }
    } while ($choice -notin @("1", "2", "3"))
} else {
    Write-Host $strings.NoExistingFound -ForegroundColor Green
}

# --- CONFIG (Following proper Android SDK structure) ---
$AndroidSdkRoot = "C:\android\sdk"
$CmdlineDir     = "$AndroidSdkRoot\cmdline-tools"
$LatestDir      = "$CmdlineDir\latest"
$PlatformTools  = "$AndroidSdkRoot\platform-tools"
$EmulatorDir    = "$AndroidSdkRoot\emulator"
$ExtrasDir      = "$AndroidSdkRoot\extras\google\Android_Emulator_Hypervisor_Driver"
$DownloadUrl    = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath        = "$env:TEMP\commandlinetools.zip"

# --- FAST DOWNLOAD FUNCTION ---
function Download-File($url, $outFile) {
    Write-Host "$($strings.Downloading) $url"
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
        Write-Host "$($strings.DownloadComplete) $outFile" -ForegroundColor Green
    }
    finally {
        $client.Dispose()
    }
}

# --- CREATE SDK ROOT DIRECTORY STRUCTURE ---
Write-Host $strings.CreatingStructure
if (!(Test-Path $AndroidSdkRoot)) {
    New-Item -ItemType Directory -Path $AndroidSdkRoot -Force | Out-Null
    Write-Host "$($strings.Created): $AndroidSdkRoot" -ForegroundColor Green
}

if (!(Test-Path $CmdlineDir)) {
    New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null
    Write-Host "$($strings.Created): $CmdlineDir" -ForegroundColor Green
}

# --- DOWNLOAD ---
Write-Host ""
Download-File $DownloadUrl $ZipPath

# --- EXTRACT ---
Write-Host ""
Write-Host $strings.Extracting
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

# Move extracted cmdline-tools to "latest" (proper structure)
if (Test-Path "$CmdlineDir\cmdline-tools") {
    if (Test-Path $LatestDir) { 
        Remove-Item $LatestDir -Recurse -Force 
        Write-Host "Removed existing latest directory" -ForegroundColor Yellow
    }
    Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
    Write-Host "$($strings.MovedStructure): $LatestDir" -ForegroundColor Green
}

# Clean up download
Remove-Item $ZipPath -Force
Write-Host $strings.CleanupTemp -ForegroundColor Green

# --- CREATE ADDITIONAL SDK DIRECTORIES ---
Write-Host ""
Write-Host $strings.CreatingAdditional
$additionalDirs = @($PlatformTools, $EmulatorDir)
foreach ($dir in $additionalDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "$($strings.Created): $dir" -ForegroundColor Green
    }
}

# --- SYSTEM ENVIRONMENT VARIABLES SETUP ---
Write-Host ""
Write-Host $strings.SettingEnvironment

# Set ANDROID_SDK_ROOT
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $AndroidSdkRoot, "Machine")
Write-Host "$($strings.AndroidSdkRootSet) $AndroidSdkRoot" -ForegroundColor Green

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
        Write-Host "$($strings.AddedToPath) $p" -ForegroundColor Green
    } else {
        Write-Host "$($strings.AlreadyInPath) $p" -ForegroundColor Yellow
    }
}

if ($pathUpdated) {
    [Environment]::SetEnvironmentVariable("Path", $currentSystemPath, "Machine")
    Write-Host $strings.PathUpdated -ForegroundColor Green
} else {
    Write-Host $strings.PathExists -ForegroundColor Cyan
}

# --- VERIFICATION ---
Write-Host ""
Write-Host $strings.VerifyingInstall
$binPath = "$LatestDir\bin"
$requiredFiles = @("sdkmanager.bat", "avdmanager.bat")

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $binPath $file
    if (Test-Path $fullPath) {
        Write-Host "$($strings.Found) $file" -ForegroundColor Green
    } else {
        Write-Host "$($strings.Missing) $file" -ForegroundColor Red
    }
}

# --- FINAL FOLDER STRUCTURE DISPLAY ---
Write-Host ""
Write-Host $strings.FinalStructure -ForegroundColor Cyan
Write-Host "C:/android/sdk/ (SDK Root)" -ForegroundColor White
Write-Host "├── cmdline-tools/" -ForegroundColor White
Write-Host "│   └── latest/" -ForegroundColor White
Write-Host "│       ├── lib/" -ForegroundColor White
Write-Host "│       └── bin/" -ForegroundColor White
Write-Host "│           ├── avdmanager.bat" -ForegroundColor White
Write-Host "│           └── sdkmanager.bat" -ForegroundColor White
Write-Host "├── platform-tools/ (for future use)" -ForegroundColor Gray
Write-Host "├── emulator/ (for future use)" -ForegroundColor Gray
Write-Host "└── extras/ (for hypervisor driver)" -ForegroundColor Gray

# --- AUTO INSTALL ESSENTIAL PACKAGES ---
Write-Host ""
Write-Host $strings.InstallingPackages -ForegroundColor Yellow
Write-Host $strings.PleaseWait -ForegroundColor Cyan

$sdkManagerPath = "$LatestDir\bin\sdkmanager.bat"

# Install essential packages including hypervisor driver
$packages = @(
    "platform-tools",
    "emulator", 
    "tools",
    "platforms;android-34",
    "build-tools;34.0.0",
    "extras;google;Android_Emulator_Hypervisor_Driver"
)

Write-Host ""
Write-Host "$($strings.PackagesInstalling) $($packages -join ', ')" -ForegroundColor Cyan
try {
    $packageList = $packages -join ' '
    & $sdkManagerPath $packageList.Split(' ')
    Write-Host $strings.PackagesSuccess -ForegroundColor Green
} catch {
    Write-Host "$($strings.PackagesError) $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "$($strings.ManualInstall) sdkmanager platform-tools emulator tools platforms;android-34 build-tools;34.0.0 extras;google;Android_Emulator_Hypervisor_Driver" -ForegroundColor Yellow
}

# Accept all licenses automatically
Write-Host ""
Write-Host $strings.AcceptingLicenses -ForegroundColor Yellow
try {
    # Create a "yes" input for all license prompts
    $yesInput = "y`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`n"  # Multiple y's with newlines
    $yesInput | & $sdkManagerPath --licenses
    Write-Host $strings.LicensesAccepted -ForegroundColor Green
} catch {
    Write-Host "$($strings.LicensesError) $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $strings.ManualLicenses -ForegroundColor Yellow
}

# --- ANDROID EMULATOR HYPERVISOR DRIVER CHECK AND INSTALLATION ---
Write-Host ""
Write-Host $strings.CheckingDriverServices -ForegroundColor Cyan

# Check if services exist
$aehd_exists = $false
$gvm_exists = $false

try {
    $aehd_service = sc.exe query aehd 2>$null
    if ($LASTEXITCODE -eq 0) {
        $aehd_exists = $true
        Write-Host $strings.ServiceExists.Replace("SERVICE", "AEHD") -ForegroundColor Green
    }
} catch {
    # Service doesn't exist
}

try {
    $gvm_service = sc.exe query gvm 2>$null
    if ($LASTEXITCODE -eq 0) {
        $gvm_exists = $true
        Write-Host $strings.ServiceExists.Replace("SERVICE", "GVM") -ForegroundColor Green
    }
} catch {
    # Service doesn't exist
}

if (-not $aehd_exists) {
    Write-Host $strings.ServiceNotExist.Replace("SERVICE", "AEHD") -ForegroundColor Red
}

if (-not $gvm_exists) {
    Write-Host $strings.ServiceNotExist.Replace("SERVICE", "GVM") -ForegroundColor Red
}

# If either service doesn't exist, install the driver
if (-not $aehd_exists -or -not $gvm_exists) {
    Write-Host ""
    Write-Host $strings.InstallingDriver -ForegroundColor Yellow
    
    # Check if driver files exist
    $driverInstallerPath = "$ExtrasDir\silent_install.bat"
    if (Test-Path $driverInstallerPath) {
        Write-Host "$($strings.FoundInstaller) $driverInstallerPath" -ForegroundColor Green
        
        try {
            Write-Host $strings.RunningInstaller -ForegroundColor Yellow
            Write-Host $strings.PleaseWait -ForegroundColor Cyan
            
            # Run the silent installer
            Start-Process -FilePath $driverInstallerPath -WorkingDirectory $ExtrasDir -Wait -WindowStyle Hidden
            
            Write-Host $strings.DriverInstallComplete -ForegroundColor Green
            
            # Verify installation again
            Write-Host ""
            Write-Host $strings.VerifyingDriver -ForegroundColor Cyan
            
            try {
                $aehd_service_after = sc.exe query aehd 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host $strings.ServiceNowExists.Replace("SERVICE", "AEHD") -ForegroundColor Green
                } else {
                    Write-Host $strings.ServiceStillNotFound.Replace("SERVICE", "AEHD") -ForegroundColor Yellow
                }
            } catch {
                Write-Host $strings.CouldNotVerify.Replace("SERVICE", "AEHD") -ForegroundColor Yellow
            }
            
            try {
                $gvm_service_after = sc.exe query gvm 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host $strings.ServiceNowExists.Replace("SERVICE", "GVM") -ForegroundColor Green
                } else {
                    Write-Host $strings.ServiceStillNotFound.Replace("SERVICE", "GVM") -ForegroundColor Yellow
                }
            } catch {
                Write-Host $strings.CouldNotVerify.Replace("SERVICE", "GVM") -ForegroundColor Yellow
            }
            
        } catch {
            Write-Host "$($strings.DriverInstallFailed) $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "$($strings.ManualDriverInstall) $driverInstallerPath" -ForegroundColor Yellow
        }
    } else {
        Write-Host "$($strings.DriverNotFound) $driverInstallerPath" -ForegroundColor Red
        Write-Host $strings.CheckPackage -ForegroundColor Yellow
    }
} else {
    Write-Host $strings.DriverAlreadyInstalled -ForegroundColor Green
}

# --- FINAL VERIFICATION ---
Write-Host ""
Write-Host $strings.FinalVerification -ForegroundColor Cyan

# Check if platform-tools was installed
if (Test-Path "$AndroidSdkRoot\platform-tools\adb.exe") {
    Write-Host $strings.AdbSuccess -ForegroundColor Green
} else {
    Write-Host $strings.AdbNotFound -ForegroundColor Yellow
}

# Check if emulator was installed  
if (Test-Path "$AndroidSdkRoot\emulator\emulator.exe") {
    Write-Host $strings.EmulatorSuccess -ForegroundColor Green
} else {
    Write-Host $strings.EmulatorNotFound -ForegroundColor Yellow
}

# Check if hypervisor driver was installed
if (Test-Path $ExtrasDir) {
    Write-Host $strings.DriverPackageFound -ForegroundColor Green
} else {
    Write-Host $strings.DriverPackageNotFound -ForegroundColor Yellow
}

# --- SUCCESS MESSAGE ---
Write-Host ""
if ($restartRequired) {
    Write-Host $strings.CompletedWithRestart -ForegroundColor Green
    Write-Host ""
    Write-Host $strings.SystemRestartRequired -ForegroundColor Red
    Write-Host $strings.HyperVNeedsRestart -ForegroundColor Yellow
    Write-Host ""
    Write-Host $strings.AfterRestart -ForegroundColor Cyan
    Write-Host $strings.TestAdb -ForegroundColor White
    Write-Host $strings.CreateAvd -ForegroundColor White
    Write-Host $strings.UseVSCode -ForegroundColor White
    Write-Host ""
    Write-Host $strings.RestartNow -ForegroundColor Yellow
    Write-Host $strings.RestartYes -ForegroundColor Green
    Write-Host $strings.RestartNo -ForegroundColor Red
    Write-Host ""
    
    do {
        $restartChoice = Read-Host "$($strings.RestartNow.Replace('?', '')) (Y/N)"
        switch ($restartChoice.ToUpper()) {
            "Y" {
                Write-Host ""
                Write-Host $strings.RestartingIn10 -ForegroundColor Yellow
                Write-Host $strings.PressCtrlC -ForegroundColor Gray
                Start-Sleep -Seconds 10
                Restart-Computer -Force
                break
            }
            "N" {
                Write-Host ""
                Write-Host $strings.RestartPostponed -ForegroundColor Yellow
                Write-Host $strings.HyperVWontWork -ForegroundColor Red
                break
            }
            default {
                Write-Host $strings.InvalidChoice -ForegroundColor Red
            }
        }
    } while ($restartChoice.ToUpper() -notin @("Y", "N"))
} else {
    Write-Host $strings.CompletedSuccess -ForegroundColor Green
    Write-Host ""
    Write-Host $strings.ReadyToUse -ForegroundColor Yellow
    Write-Host $strings.RestartTerminal -ForegroundColor White
    Write-Host $strings.TestAdb -ForegroundColor White
    Write-Host $strings.CreateAvdCommand -ForegroundColor White
    Write-Host $strings.UseVSCode -ForegroundColor White
}

Write-Host ""
Write-Host $strings.InstalledPackages -ForegroundColor Cyan
Write-Host $strings.PlatformTools -ForegroundColor White
Write-Host $strings.AndroidEmulator -ForegroundColor White
Write-Host $strings.SdkTools -ForegroundColor White
Write-Host $strings.Android34 -ForegroundColor White
Write-Host $strings.BuildTools -ForegroundColor White
Write-Host $strings.HypervisorDriver -ForegroundColor White

# Show virtualization setup status
Write-Host ""
Write-Host $strings.AccelerationStatus -ForegroundColor Cyan

# Check final Hyper-V status
try {
    $hyperVStatus = Get-WindowsOptionalFeature -Online -FeatureName "Microsoft-Hyper-V-All"
    if ($hyperVStatus.State -eq "Enabled") {
        Write-Host $strings.HyperVMaxPerformance -ForegroundColor Green
        Write-Host $strings.HyperVWillUseAccel -ForegroundColor White
    } else {
        Write-Host $strings.HyperVDisabledStatus -ForegroundColor Yellow
        Write-Host $strings.WillUseDriverInstead -ForegroundColor White
        Write-Host $strings.SlightlyLowerPerf -ForegroundColor Gray
    }
} catch {
    Write-Host $strings.CouldNotDetermineHyperV -ForegroundColor Yellow
}

# Show hypervisor driver status
Write-Host ""
Write-Host $strings.HypervisorServices -ForegroundColor Cyan

try {
    $aehd_final = sc.exe query aehd 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host $strings.ServiceInstalled.Replace("SERVICE", "AEHD") -ForegroundColor Green
    } else {
        Write-Host $strings.ServiceNotFound.Replace("SERVICE", "AEHD") -ForegroundColor Red
    }
} catch {
    Write-Host $strings.CouldNotCheckService.Replace("SERVICE", "AEHD") -ForegroundColor Yellow
}

try {
    $gvm_final = sc.exe query gvm 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host $strings.ServiceInstalled.Replace("SERVICE", "GVM") -ForegroundColor Green
    } else {
        Write-Host $strings.ServiceNotFound.Replace("SERVICE", "GVM") -ForegroundColor Red
    }
} catch {
    Write-Host $strings.CouldNotCheckService.Replace("SERVICE", "GVM") -ForegroundColor Yellow
}

# Show enabled features summary
if ($enabledFeatures.Count -gt 0) {
    Write-Host ""
    Write-Host $strings.FeaturesEnabledDuring -ForegroundColor Green
    foreach ($feature in $enabledFeatures) {
        if ($restartRequired) {
            Write-Host "   • $feature$($strings.RequiresRestart)" -ForegroundColor Yellow
        } else {
            Write-Host "   • $feature" -ForegroundColor White
        }
    }
}

if ($skippedFeatures.Count -gt 0) {
    Write-Host ""
    Write-Host $strings.FeaturesFailed -ForegroundColor Red
    foreach ($feature in $skippedFeatures) {
        Write-Host "   • $feature" -ForegroundColor White
    }
    Write-Host $strings.ManualEnableFeatures -ForegroundColor Gray
}

Write-Host ""
Write-Host $strings.EnvironmentSet -ForegroundColor Cyan
Write-Host "   ANDROID_SDK_ROOT = $AndroidSdkRoot" -ForegroundColor White
Write-Host $strings.PathIncludes -ForegroundColor White

Write-Host ""
Write-Host $strings.PerformanceNotes -ForegroundColor Cyan
Write-Host $strings.HyperVBest -ForegroundColor White
Write-Host $strings.DriverAlternative -ForegroundColor White
Write-Host $strings.BothProvideAccel -ForegroundColor White

Write-Host ""
Write-Host $strings.AllSetEnglish -ForegroundColor Green

if (-not $restartRequired) {
    pause
}
