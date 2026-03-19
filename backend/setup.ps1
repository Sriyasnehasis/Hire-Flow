# Backend Setup Script for Windows (PowerShell)
# Fixes "Permission denied" venv error and installs all dependencies

Write-Host "=== ExtractResume Backend Setup ===" -ForegroundColor Cyan

# Step 1: Remove existing venv if it exists (avoids Permission Denied errors)
if (Test-Path "venv") {
    Write-Host "Removing existing venv directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "venv"
    Write-Host "Removed." -ForegroundColor Green
}

# Step 2: Create a fresh virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create virtual environment. Make sure Python 3.11+ is installed." -ForegroundColor Red
    exit 1
}
Write-Host "Virtual environment created." -ForegroundColor Green

# Step 3: Upgrade pip inside the venv
Write-Host "Upgrading pip..." -ForegroundColor Yellow
.\venv\Scripts\python.exe -m pip install --upgrade pip --quiet

# Step 4: Install dependencies
Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Yellow
.\venv\Scripts\pip.exe install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies." -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed." -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Activate the virtual environment:" -ForegroundColor White
Write-Host "       .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host "  2. Copy and edit your .env file:" -ForegroundColor White
Write-Host "       Copy-Item .env.example .env" -ForegroundColor Yellow
Write-Host "  3. Start the backend server:" -ForegroundColor White
Write-Host "       python -m uvicorn app.main:app --reload" -ForegroundColor Yellow
