# Authentication System Setup Script
# Run this script to install all required dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Authentication System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend Setup
Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install express-rate-limit express-validator cookie-parser
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Error installing backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Return to root
Set-Location ..

# Frontend Setup (no additional dependencies needed, but rebuild to include new components)
Write-Host "Building Frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend built successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Error building frontend" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Return to root
Set-Location ..

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update your .env file with the new configuration variables" -ForegroundColor White
Write-Host "2. Review AUTHENTICATION_GUIDE.md for detailed documentation" -ForegroundColor White
Write-Host "3. Start the backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "4. Start the frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "New Features Implemented:" -ForegroundColor Yellow
Write-Host "  ✓ Token refresh mechanism" -ForegroundColor Green
Write-Host "  ✓ Password reset functionality" -ForegroundColor Green
Write-Host "  ✓ Email verification system" -ForegroundColor Green
Write-Host "  ✓ Rate limiting on auth endpoints" -ForegroundColor Green
Write-Host "  ✓ Enhanced password validation" -ForegroundColor Green
Write-Host "  ✓ Account lockout after failed attempts" -ForegroundColor Green
Write-Host "  ✓ Role-based access control (RBAC)" -ForegroundColor Green
Write-Host "  ✓ Permission-based authorization" -ForegroundColor Green
Write-Host "  ✓ Input validation and sanitization" -ForegroundColor Green
Write-Host "  ✓ Secure token storage with httpOnly cookies" -ForegroundColor Green
Write-Host ""
