# Sunburst Digital AI - PowerShell Dev Automation Orchestrator
# ------------------------------------------------------------
# This script automates backend server startup, health checks, test execution,
# and process management for local development. It is idempotent and safe to rerun.

param(
    [string]$ServerScript = "backend/app.js",
    [string]$HealthUrl = "http://localhost:3000/health",
    [string]$TestScript = "tools/test-all.ps1", # Change to your test runner or script
    [string]$LogFile = "dev-orchestrator.log"
)

function Write-Color($Message, $Color) {
    Write-Host $Message -ForegroundColor $Color
}

function Start-BackendServer {
    Write-Color "[INFO] Starting backend server..." Yellow
    $existing = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node.exe" }
    if ($existing) {
        Write-Color "[WARN] Node process already running. Attempting to stop..." Red
        $existing | Stop-Process -Force
        Start-Sleep -Seconds 2
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "node $ServerScript" -WindowStyle Minimized
}

function Wait-For-Health {
    Write-Color "[INFO] Waiting for backend /health endpoint..." Yellow
    $maxTries = 20
    $tries = 0
    while ($tries -lt $maxTries) {
        try {
            $resp = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 2
            if ($resp.StatusCode -eq 200) {
                Write-Color "[SUCCESS] Backend is live!" Green
                return $true
            }
        } catch {}
        Start-Sleep -Seconds 1
        $tries++
    }
    Write-Color "[ERROR] Backend did not become healthy in time." Red
    return $false
}

function Run-Tests {
    Write-Color "[INFO] Running tests..." Yellow
    try {
        $testResult = & $TestScript 2>&1 | Tee-Object -FilePath $LogFile
        if ($LASTEXITCODE -eq 0) {
            Write-Color "[SUCCESS] All tests passed." Green
            return $true
        } else {
            Write-Color "[FAIL] Tests failed. See $LogFile for details." Red
            return $false
        }
    } catch {
        Write-Color "[ERROR] Test script crashed: $_" Red
        return $false
    }
}

function Stop-BackendServer {
    Write-Color "[INFO] Stopping backend server..." Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
}

# Main Orchestration
Write-Color "==== Sunburst Digital AI Dev Orchestrator ====" Cyan
Start-BackendServer
if (-not (Wait-For-Health)) {
    Write-Color "[FATAL] Backend failed to start. Exiting." Red
    exit 1
}

if (Run-Tests) {
    Write-Color "[READY] All systems go. Backend server is running." Green
    Write-Color "Press Ctrl+C to stop the orchestrator. Server will keep running." Cyan
    while ($true) { Start-Sleep -Seconds 60 }
} else {
    Stop-BackendServer
    Write-Color "[ACTION REQUIRED] Tests failed. Review $LogFile. Choose an option:" Yellow
    Write-Color "1. Retry tests" Cyan
    Write-Color "2. Restart server and retry" Cyan
    Write-Color "3. Exit" Cyan
    $choice = Read-Host "Enter choice (1/2/3)"
    switch ($choice) {
        '1' { Run-Tests }
        '2' {
            Stop-BackendServer
            Start-BackendServer
            if (Wait-For-Health) { Run-Tests }
        }
        default { Write-Color "[EXITING]" Magenta; exit 1 }
    }
}
