#!/usr/bin/env bash
# Backend Setup Script for Linux/macOS
# Fixes venv conflicts and installs all dependencies

set -e

echo "=== ExtractResume Backend Setup ==="

# Step 1: Remove existing venv if it exists
if [ -d "venv" ]; then
    echo "Removing existing venv directory..."
    rm -rf venv
    echo "Removed."
fi

# Step 2: Create a fresh virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
echo "Virtual environment created."

# Step 3: Upgrade pip inside the venv
echo "Upgrading pip..."
venv/bin/python -m pip install --upgrade pip --quiet

# Step 4: Install dependencies
echo "Installing dependencies from requirements.txt..."
venv/bin/pip install -r requirements.txt
echo "Dependencies installed."

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "  1. Activate the virtual environment:"
echo "       source venv/bin/activate"
echo "  2. Copy and edit your .env file:"
echo "       cp .env.example .env"
echo "  3. Start the backend server:"
echo "       python -m uvicorn app.main:app --reload"
