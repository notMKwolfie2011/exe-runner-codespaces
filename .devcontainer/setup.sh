#!/bin/bash
set -e

echo "🔧 Setting up EXE Runner environment..."

# Update package manager
echo "📦 Updating system packages..."
apt-get update -qq

# Install Wine and dependencies
echo "🍷 Installing Wine compatibility layer..."
apt-get install -y --no-install-recommends \
    wine \
    wine32 \
    wine64 \
    winetricks \
    xvfb \
    x11-utils \
    2>&1 | tail -5

# Install Node dependencies
echo "📚 Installing Node dependencies..."
npm install --legacy-peer-deps

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Create executables directory
mkdir -p executables

echo "✅ Setup complete! Starting server..."
