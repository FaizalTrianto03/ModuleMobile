<#
.SYNOPSIS
  Bootstrapper untuk Android SDK installer.
  Bisa dijalankan langsung: irm https://.../install.ps1 | iex
#>

$ErrorActionPreference = "Stop"

# --- CONFIG ---
$scriptUrl  = "https://raw.githubusercontent.com/FaizalTrianto03/ModuleMobile/refs/heads/script/install-avd.ps1"
$localPath  = "$env:TEMP\install-avd.ps1"

Write-Host "📥 Downloading installer script..."
Invoke-WebRequest -Uri $scriptUrl -OutFile $localPath -UseBasicParsing

# --- RUN ELEVATED ---
Write-Host "⚡ Relaunching elevated installer..."
Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$localPath`"" -Verb RunAs
