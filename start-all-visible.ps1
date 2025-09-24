# ======================================================================================
# start-all-visible.ps1 — Launch backend, file server, and ngrok
# ======================================================================================

Write-Host "🚀 Starting Sunburst Digital stack..."

# ----------------------------------------------------------------------
# Start Fastify backend (server.js) in new PowerShell window
# ----------------------------------------------------------------------
Write-Host "Starting backend (Fastify)..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\ohdav\onedrive\humanpp\backend; node server.js" -WorkingDirectory "C:\Users\ohdav\onedrive\humanpp\backend"

# Give backend time to boot
Start-Sleep -Seconds 3

# ----------------------------------------------------------------------
# Start File Server (file-server.js) in new PowerShell window
# ----------------------------------------------------------------------
Write-Host "Starting file server (repo browser)..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\ohdav\onedrive\humanpp; node file-server.js" -WorkingDirectory "C:\Users\ohdav\onedrive\humanpp"

# Give file server time to boot
Start-Sleep -Seconds 3

# ----------------------------------------------------------------------
# Start ngrok tunnels (config must point 3000 + 3001)
# ----------------------------------------------------------------------
Write-Host "Starting ngrok tunnels..."
Start-Process powershell -ArgumentList "-NoExit","-Command","ngrok start --all --config C:\Users\ohdav\.ngrok2\config.yml" -WorkingDirectory "C:\Users\ohdav\.ngrok2"

Write-Host "✅ All services started: Backend (3000), File Server (3001), ngrok tunnels"
