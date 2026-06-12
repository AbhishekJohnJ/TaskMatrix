# PowerShell script to add Windows Firewall rule for Node.js
# This allows Node.js to make outbound connections to MongoDB Atlas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Adding Firewall Rule for Node.js" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click on PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "Then run this script again" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Find Node.js executable path
$nodePath = (Get-Command node).Path
Write-Host "📍 Node.js location: $nodePath" -ForegroundColor Cyan
Write-Host ""

# Remove existing rule if it exists
Write-Host "🔍 Checking for existing Node.js firewall rules..." -ForegroundColor Yellow
$existingRule = Get-NetFirewallRule -DisplayName "Node.js - MongoDB Access" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "Found existing rule. Removing it..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "Node.js - MongoDB Access"
    Write-Host "✅ Old rule removed" -ForegroundColor Green
}

# Add new outbound firewall rule for Node.js
Write-Host ""
Write-Host "➕ Adding new firewall rule for Node.js..." -ForegroundColor Yellow

try {
    New-NetFirewallRule `
        -DisplayName "Node.js - MongoDB Access" `
        -Description "Allow Node.js to connect to MongoDB Atlas and other services" `
        -Direction Outbound `
        -Program $nodePath `
        -Action Allow `
        -Protocol TCP `
        -RemotePort 27017,443,80 `
        -Profile Any `
        -Enabled True
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Node.js can now connect to:" -ForegroundColor Cyan
    Write-Host "  - MongoDB Atlas (port 27017)" -ForegroundColor White
    Write-Host "  - HTTPS services (port 443)" -ForegroundColor White
    Write-Host "  - HTTP services (port 80)" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now run your backend server!" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to add firewall rule" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
