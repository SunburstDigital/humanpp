# humanpp-dev.ps1
# Full smoke test harness for Sunburst Voice System (Fastify - local dev)

$baseUrl = "http://localhost:3000"
Write-Host "🔄 Running Sunburst Voice System smoke test (DEV) against $baseUrl`n"

# 1. Health check
Write-Host "➡️  Checking /health..."
Invoke-RestMethod -Uri "$baseUrl/health" -Method Get | Format-List
Write-Host "`n"

# 2. Simulate inbound SMS webhook
Write-Host "➡️  Testing /twilio/incoming-sms..."
$smsBody = @{
    SmsSid   = "SMDEV123456789"
    From     = "+61411111111"
    To       = "+61422222222"
    Body     = "Hi, do you have any 3x2 rentals in Maylands?"
    MessageSid = "SMDEV123456789"
}
Invoke-RestMethod -Uri "$baseUrl/twilio/incoming-sms" -Method Post -Body $smsBody | Out-String | Write-Host
Write-Host "`n"

# 3. Simulate SMS status callback
Write-Host "➡️  Testing /twilio/sms-status..."
$statusBody = @{
    SmsSid    = "SMDEV123456789"
    MessageStatus = "delivered"
    To        = "+61411111111"
    From      = "+61422222222"
}
Invoke-RestMethod -Uri "$baseUrl/twilio/sms-status" -Method Post -Body $statusBody | Out-String | Write-Host
Write-Host "`n"

# 4. Simulate call status callback
Write-Host "➡️  Testing /twilio/call-status..."
$callBody = @{
    CallSid   = "CADEV123456789"
    CallStatus = "in-progress"
    From      = "+61411111111"
    To        = "+61422222222"
}
Invoke-RestMethod -Uri "$baseUrl/twilio/call-status" -Method Post -Body $callBody | Out-String | Write-Host
Write-Host "`n"

# 5. Simulate incoming call (TwiML check)
Write-Host "➡️  Testing /twilio/incoming-call..."
Invoke-RestMethod -Uri "$baseUrl/twilio/incoming-call" -Method Post -Body $callBody -ContentType "application/x-www-form-urlencoded" | Out-String | Write-Host
Write-Host "`n"

Invoke-RestMethod -Uri "$baseUrl/twilio/call-status" -Method Post -Body @{ 
    CallSid = "CADEV123456789"; 
    CallStatus = "completed"; 
    From = "+61411111111" 
}

# 6. Fetch recent logs
Write-Host "➡️  Fetching /logs/recent..."
Invoke-RestMethod -Uri "$baseUrl/logs/recent" -Method Get | ConvertTo-Json -Depth 5 | Write-Host
Write-Host "`n✅ DEV smoke test complete."
