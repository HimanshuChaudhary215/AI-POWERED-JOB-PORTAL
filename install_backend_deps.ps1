# PowerShell helper to install backend dependencies
# Run from repo root: Open PowerShell as Administrator (if needed) and run `./install_backend_deps.ps1`

Push-Location $PSScriptRoot
Set-Location -Path "./backend"

if (Test-Path -Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating existing virtualenv..."
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "No virtualenv found in backend\venv — creating one now..."
    python -m venv venv
    & "venv\Scripts\Activate.ps1"
}

python -m pip install --upgrade pip
Write-Host "Installing requirements from $(Get-Location)\requirements.txt"
pip install -r requirements.txt

Pop-Location
Write-Host "Backend dependencies installed."
