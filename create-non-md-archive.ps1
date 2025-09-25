# PowerShell script to create a ZIP archive of all files EXCEPT markdown files
param(
    [string]$OutputPath = "non-markdown-files.zip"
)

Write-Host "🔍 Finding all files EXCEPT .md files in the repository..." -ForegroundColor Yellow

# Get all files, excluding .md files, node_modules, .git directories, and common build/temp files
$allFiles = Get-ChildItem -Path . -Recurse -File | 
    Where-Object { 
        $_.Extension -ne ".md" -and
        $_.FullName -notmatch "node_modules|\.git|\.vs|\.vscode|bin|obj|dist|build|temp|tmp" -and
        $_.Name -ne "package-lock.json" -and
        $_.Name -notlike "*.log" -and
        $_.Name -notlike "*.zip"
    }

Write-Host "📁 Found $($allFiles.Count) non-markdown files" -ForegroundColor Green

if ($allFiles.Count -eq 0) {
    Write-Host "❌ No non-markdown files found!" -ForegroundColor Red
    exit 1
}

# Remove existing zip if it exists
if (Test-Path $OutputPath) {
    Remove-Item $OutputPath -Force
    Write-Host "🗑️  Removed existing $OutputPath" -ForegroundColor Gray
}

Write-Host "📦 Creating ZIP archive: $OutputPath" -ForegroundColor Yellow

# Create the ZIP file using .NET compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipFile = [System.IO.Compression.ZipFile]::Open((Resolve-Path .).Path + "\$OutputPath", 'Create')

try {
    $fileCount = 0
    foreach ($file in $allFiles) {
        # Get relative path from repo root
        $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
        
        # Add file to ZIP with relative path structure
        $entry = $zipFile.CreateEntry($relativePath)
        $entryStream = $entry.Open()
        $fileStream = [System.IO.File]::OpenRead($file.FullName)
        
        $fileStream.CopyTo($entryStream)
        $fileStream.Close()
        $entryStream.Close()
        
        $fileCount++
        Write-Host "  ✅ Added: $relativePath" -ForegroundColor Gray
    }
} finally {
    $zipFile.Dispose()
}

$zipInfo = Get-Item $OutputPath
Write-Host "🎉 Successfully created archive!" -ForegroundColor Green
Write-Host "📊 Archive size: $([math]::Round($zipInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "📂 Location: $($zipInfo.FullName)" -ForegroundColor Cyan
Write-Host "📦 Files archived: $fileCount" -ForegroundColor Cyan

# Group files by extension for summary
Write-Host "`n📋 File types included:" -ForegroundColor Yellow
$fileTypes = $allFiles | Group-Object Extension | Sort-Object Count -Descending
foreach ($type in $fileTypes | Select-Object -First 10) {
    $ext = if ($type.Name -eq "") { "(no extension)" } else { $type.Name }
    Write-Host "  • $ext : $($type.Count) files" -ForegroundColor Gray
}

if ($fileTypes.Count -gt 10) {
    Write-Host "  ... and $($fileTypes.Count - 10) more file types" -ForegroundColor Gray
}

Write-Host "`n🔗 You can now download the file: $((Get-Item $OutputPath).FullName)" -ForegroundColor Green

# Show some example files
Write-Host "`n📋 Example files included (first 10):" -ForegroundColor Yellow
$allFiles | Select-Object -First 10 | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    Write-Host "  • $relativePath" -ForegroundColor Gray
}

if ($allFiles.Count -gt 10) {
    Write-Host "  ... and $($allFiles.Count - 10) more files" -ForegroundColor Gray
}