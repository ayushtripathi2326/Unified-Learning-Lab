#!/bin/bash

echo "🚀 Unified Learning Lab - Deployment Check"
echo "=========================================="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installed: $(node -v)"
else
    echo "❌ Node.js not found - Install from https://nodejs.org"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm installed: $(npm -v)"
else
    echo "❌ npm not found"
    exit 1
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

echo ""
echo "🔨 Building Frontend..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "✅ Your app is ready for deployment!"
echo ""
echo "📝 Next Steps:"
echo "1. Create account on Render.com or Vercel.com"
echo "2. Connect your GitHub repository"
echo "3. Follow DEPLOYMENT_GUIDE.md for detailed steps"
echo ""
echo "🌐 Your GitHub repo: https://github.com/ayushtri6269/Unified-Learning-Lab"
echo "=========================================="
