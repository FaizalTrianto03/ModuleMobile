<#
.SYNOPSIS
  Install Android Command Line Tools (avdmanager, sdkmanager, emulator) on Windows
  without requiring Android Studio or admin rights.

.DESCRIPTION
  - Download dengan HttpClient (lebih cepat dari Invoke-WebRequest)
  - Extract ke %LOCALAPPDATA%\Android\cmdline-tools\latest
  - Update PATH di User scope (tanpa admin)
#>

$ErrorActionPreference = "Stop"

# --- CONFIG ---
$AndroidRoot = "$env:LOCALAPPDATA\Android"
$CmdlineDir  = "$AndroidRoot\cmdline-tools"
$LatestDir   = "$CmdlineDir\latest"
$DownloadUrl = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$ZipPath     = "$env:TEMP\commandlinetools.zip"

# --- FAST DOWNLOAD FUNCTION ---
function Download-File($url, $outFile) {
    Write-Host "📥 Downloading: $url"
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
Download-File $DownloadUrl $ZipPath

# --- EXTRACT ---
if (!(Test-Path $CmdlineDir)) {
    New-Item -ItemType Directory -Path $CmdlineDir -Force | Out-Null
}
Write-Host "📦 Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath $CmdlineDir -Force

# Move into "latest"
if (Test-Path "$CmdlineDir\cmdline-tools") {
    if (Test-Path $LatestDir) { Remove-Item $LatestDir -Recurse -Force }
    Move-Item "$CmdlineDir\cmdline-tools" $LatestDir
}
Remove-Item $ZipPath -Force

# --- PATH SETUP (User only) ---
$envPaths = @(
    "$LatestDir\bin",
    "$AndroidRoot\platform-tools",
    "$AndroidRoot\emulator"
)

Write-Host "⚙️ Updating PATH (User scope)..."
foreach ($p in $envPaths) {
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$p*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$p", "User")
    }
}

Write-Host "🎉 All done!"
Write-Host "👉 Restart your terminal and try:  sdkmanager --list"
