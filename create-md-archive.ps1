# PowerShell script to create a ZIP archive of all markdown files
param(
    [string]$OutputPath = "markdown-files.zip"
)

Write-Host "🔍 Finding all .md files in the repository..." -ForegroundColor Yellow

# Get all .md files, excluding node_modules and .git directories
$markdownFiles = Get-ChildItem -Path . -Recurse -Include "*.md" | 
    Where-Object { $_.FullName -notmatch "node_modules|\.git" }

Write-Host "📁 Found $($markdownFiles.Count) markdown files" -ForegroundColor Green

if ($markdownFiles.Count -eq 0) {
    Write-Host "❌ No markdown files found!" -ForegroundColor Red
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
    foreach ($file in $markdownFiles) {
        # Get relative path from repo root
        $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
        
        # Add file to ZIP with relative path structure
        $entry = $zipFile.CreateEntry($relativePath)
        $entryStream = $entry.Open()
        $fileStream = [System.IO.File]::OpenRead($file.FullName)
        
        $fileStream.CopyTo($entryStream)
        $fileStream.Close()
        $entryStream.Close()
        
        Write-Host "  ✅ Added: $relativePath" -ForegroundColor Gray
    }
} finally {
    $zipFile.Dispose()
}

$zipInfo = Get-Item $OutputPath
Write-Host "🎉 Successfully created archive!" -ForegroundColor Green
Write-Host "📊 Archive size: $([math]::Round($zipInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "📂 Location: $($zipInfo.FullName)" -ForegroundColor Cyan

# List first 10 files as preview
Write-Host "`n📋 Archive contents (first 10 files):" -ForegroundColor Yellow
$markdownFiles | Select-Object -First 10 | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    Write-Host "  • $relativePath" -ForegroundColor Gray
}

if ($markdownFiles.Count -gt 10) {
    Write-Host "  ... and $($markdownFiles.Count - 10) more files" -ForegroundColor Gray
}

Write-Host "`n🔗 You can now download the file: $((Get-Item $OutputPath).FullName)" -ForegroundColor Green