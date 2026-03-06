$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir "..\..")

Set-Location $RepoRoot

function Test-PortInUse {
    param([int]$PortToTest)
    $result = netstat -ano | Select-String "LISTENING" | Select-String ":$PortToTest "
    return $null -ne $result
}

$Port = 8000
$MaxPort = 8010
$HostAddress = "127.0.0.1"

while (Test-PortInUse -PortToTest $Port) {
    $Port++
    if ($Port -gt $MaxPort) {
        throw "No free port found in range 8000-8010. Stop old python http.server processes and retry."
    }
}

Write-Host "Serving $RepoRoot on http://$HostAddress`:$Port (use http, not https)"

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server $Port --bind $HostAddress
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $Port --bind $HostAddress
} else {
    throw "No Python launcher found. Install Python 3 and try again."
}
