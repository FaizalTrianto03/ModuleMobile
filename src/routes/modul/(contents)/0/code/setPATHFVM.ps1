
[Environment]::SetEnvironmentVariable("PATH", `
"$env:USERPROFILE\fvm\default\bin;$([Environment]::GetEnvironmentVariable('PATH','User'))", `
"User")