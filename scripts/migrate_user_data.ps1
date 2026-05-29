# Antigravity IDE & Agent Data Migration Script
# Migrates database/state files and agent conversation history (.gemini)

$ErrorActionPreference = "Stop"

$SourceIDE = Join-Path $env:APPDATA "Antigravity\User"
$DestIDE = Join-Path $env:APPDATA "Antigravity IDE\User"
$DestGemini = Join-Path $env:USERPROFILE ".gemini"

# Detect desktop path for .gemini backup
$DesktopPaths = @(
    (Join-Path $env:USERPROFILE "OneDrive\Desktop\.gemini"),
    (Join-Path $env:USERPROFILE "Desktop\.gemini")
)
$SourceGemini = $null
foreach ($path in $DesktopPaths) {
    if (Test-Path $path) {
        $SourceGemini = $path
        break
    }
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Antigravity IDE & Agent Data Migrator  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "IDE Source:      $SourceIDE"
Write-Host "IDE Destination: $DestIDE"
Write-Host "Agent Source:    $(if ($SourceGemini) { $SourceGemini } else { 'NOT FOUND' })"
Write-Host "Agent Dest:      $DestGemini"
Write-Host ""

# 1. Verify Sources Exist
if (-not (Test-Path $SourceIDE)) {
    Write-Host "Error: Old IDE User database directory '$SourceIDE' not found." -ForegroundColor Red
    Exit
}
if ($null -eq $SourceGemini) {
    Write-Host "Error: Old Agent .gemini backup folder not found on Desktop." -ForegroundColor Red
    Exit
}

# 2. Check for Running IDE & Agent Processes
$processes = Get-Process | Where-Object { $_.Name -like "*Antigravity*" }
if ($processes) {
    Write-Host "Warning: Antigravity IDE is currently running." -ForegroundColor Yellow
    Write-Host "To prevent data corruption, the IDE must be closed during migration."
    Write-Host ""
    Write-Host "Please select an option:"
    Write-Host " [1] Force close Antigravity IDE & migrate now (recommended)"
    Write-Host " [2] Wait for me to close it manually"
    Write-Host " [3] Abort migration"
    
    $choice = Read-Host "Choice (1/2/3)"
    
    if ($choice -eq "1") {
        Write-Host "Closing Antigravity IDE processes..." -ForegroundColor Yellow
        $processes | Stop-Process -Force
        Start-Sleep -Seconds 3
    } elseif ($choice -eq "2") {
        Read-Host "Please close the Antigravity IDE, then press ENTER to continue..."
    } else {
        Write-Host "Migration aborted." -ForegroundColor Red
        Exit
    }
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# 3. Backup Current IDE User Profile
if (Test-Path $DestIDE) {
    $BackupParentDir = Join-Path $env:APPDATA "Antigravity IDE"
    $BackupIDE = Join-Path $BackupParentDir "User_Backup_$Timestamp"
    Write-Host "Creating backup of current IDE settings to: $BackupIDE..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $BackupIDE -Force | Out-Null
    Get-ChildItem -Path $DestIDE | ForEach-Object {
        $destPath = Join-Path $BackupIDE $_.Name
        if ($_.PSIsContainer) {
            Copy-Item -Path $_.FullName -Destination $destPath -Recurse -Force
        } else {
            Copy-Item -Path $_.FullName -Destination $destPath -Force
        }
    }
    Write-Host "IDE Backup completed." -ForegroundColor Green
} else {
    New-Item -ItemType Directory -Path $DestIDE -Force | Out-Null
}

# 4. Backup Current Active Agent .gemini Folder
if (Test-Path $DestGemini) {
    $BackupGemini = Join-Path $env:USERPROFILE ".gemini_Backup_$Timestamp"
    Write-Host "Creating backup of active .gemini settings to: $BackupGemini..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $BackupGemini -Force | Out-Null
    Get-ChildItem -Path $DestGemini -Force | ForEach-Object {
        $destPath = Join-Path $BackupGemini $_.Name
        if ($_.PSIsContainer) {
            Copy-Item -Path $_.FullName -Destination $destPath -Recurse -Force -ErrorAction SilentlyContinue
        } else {
            Copy-Item -Path $_.FullName -Destination $destPath -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "Agent .gemini Backup completed." -ForegroundColor Green
} else {
    New-Item -ItemType Directory -Path $DestGemini -Force | Out-Null
}

# 5. Migrate IDE Data
Write-Host "Migrating IDE database & settings..." -ForegroundColor Cyan
Get-ChildItem -Path $SourceIDE | ForEach-Object {
    $srcItem = $_.FullName
    $destItem = Join-Path $DestIDE $_.Name
    Write-Host " -> Copying: $($_.Name)"
    if ($_.PSIsContainer) {
        Copy-Item -Path $srcItem -Destination $destItem -Recurse -Force
    } else {
        Copy-Item -Path $srcItem -Destination $destItem -Force
    }
}

# 6. Migrate Agent .gemini Data
Write-Host "Migrating Agent history & logs..." -ForegroundColor Cyan
Get-ChildItem -Path $SourceGemini -Force | ForEach-Object {
    $srcItem = $_.FullName
    $destItem = Join-Path $DestGemini $_.Name
    Write-Host " -> Copying: $($_.Name)"
    if ($_.PSIsContainer) {
        Copy-Item -Path $srcItem -Destination $destItem -Recurse -Force -ErrorAction SilentlyContinue
    } else {
        Copy-Item -Path $srcItem -Destination $destItem -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Migration finished successfully!" -ForegroundColor Green

# 7. Prompt to Restart IDE
$restartChoice = Read-Host "Do you want to restart the Antigravity IDE now? (Y/N)"
if ($restartChoice -eq "Y" -or $restartChoice -eq "y") {
    $exePath = "C:\Users\mahen\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe"
    if (Test-Path $exePath) {
        Write-Host "Launching Antigravity IDE..." -ForegroundColor Green
        Start-Process $exePath
    } else {
        Write-Host "Could not locate Antigravity IDE executable at $exePath." -ForegroundColor Yellow
        Write-Host "Please start it manually."
    }
}
