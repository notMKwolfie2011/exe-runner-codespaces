#!/bin/bash
set -e

echo "🔧 Setting up EXE Runner environment..."

# Update package manager
echo "📦 Updating system packages..."
apt-get update -qq 2>&1 | tail -3

# Install essential build tools first
echo "⚙️ Installing build essentials..."
apt-get install -y --no-install-recommends build-essential 2>&1 | tail -3

# Install Wine (optional but recommended)
echo "🍷 Installing Wine (this may take a minute)..."
apt-get install -y --no-install-recommends wine wine32 wine64 2>&1 | tail -3 || echo "⚠️ Wine installation had issues, continuing anyway..."

# Install Node dependencies
echo "📚 Installing Node dependencies..."
cd /workspaces/exe-runner-codespaces 2>/dev/null || cd /workspace 2>/dev/null || true
npm install --legacy-peer-deps 2>&1 | grep -E "(added|up to date)" || true

# Build frontend
echo "🏗️ Building frontend..."
npm run build 2>&1 | tail -5

# Create executables directory
mkdir -p executables

echo "✅ Setup complete!"
echo "📝 Backend will start automatically on port 3000"
echo "🎮 Open http://localhost:3000 in your browser"
