# start-all-visible.ps1

# Start Fastify backend in a new PowerShell window
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\ohdav\onedrive\humanpp\backend; npm start" -WorkingDirectory "C:\Users\ohdav\onedrive\humanpp\backend"

# Give backend a moment
Start-Sleep -Seconds 2

# Start secure file server window
Write-Host "Starting file server..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\ohdav\onedrive\humanpp; node file-server.js" -WorkingDirectory "C:\Users\ohdav\onedrive\humanpp"

# Give file server a moment
Start-Sleep -Seconds 2

# Start ngrok tunnels
Write-Host "Starting ngrok..."
Start-Process powershell -ArgumentList "-NoExit","-Command","ngrok start --all --config C:\Users\ohdav\.ngrok2\config.yml" -WorkingDirectory "C:\Users\ohdav\.ngrok2"
