# Installation and Setup Script
# Run this to fix all missing dependencies and setup your project

Write-Host "🚀 Setting up Unified Learning Lab..." -ForegroundColor Cyan
Write-Host ""

# Backend Setup
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend

# Install main dependencies
Write-Host "Installing helmet, morgan, dotenv..." -ForegroundColor Green
npm install helmet morgan dotenv

# Install dev dependencies
Write-Host "Installing dev dependencies (eslint, prettier, vitest)..." -ForegroundColor Green
npm install --save-dev eslint prettier eslint-config-prettier vitest

Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
Write-Host ""

# Frontend Setup
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location ../frontend

# Install dev dependencies
Write-Host "Installing dev dependencies (eslint, prettier)..." -ForegroundColor Green
npm install --save-dev eslint prettier eslint-config-prettier

Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
Write-Host ""

# Back to root
Set-Location ..

Write-Host "🎉 Installation Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check backend/.env file (already exists)" -ForegroundColor White
Write-Host "2. Check frontend/.env file (created)" -ForegroundColor White
Write-Host "3. Start MongoDB: mongod" -ForegroundColor White
Write-Host "4. Start Backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "5. Start Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "📚 Read the documentation files in the root folder!" -ForegroundColor Cyan
