# Antigravity IDE & Agent Data Migration Script (Automatic & Logged)
# Migrates database/state files and agent conversation history (.gemini) without prompts

$ErrorActionPreference = "Stop"

$LogPath = "c:\Users\mahen\OneDrive\Desktop\setmybizz-project\migration_log.txt"

function Log-Message {
    param([string]$Message)
    Write-Host $Message
    Add-Content -Path $LogPath -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message" -ErrorAction SilentlyContinue
}

try {
    Log-Message "Starting migration script..."
    
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

    Log-Message "IDE Source:      $SourceIDE"
    Log-Message "IDE Destination: $DestIDE"
    Log-Message "Agent Source:    $(if ($SourceGemini) { $SourceGemini } else { 'NOT FOUND' })"
    Log-Message "Agent Dest:      $DestGemini"

    # 1. Verify Sources Exist
    if (-not (Test-Path $SourceIDE)) {
        Log-Message "Error: Old IDE User database directory '$SourceIDE' not found."
        Exit
    }
    if ($null -eq $SourceGemini) {
        Log-Message "Error: Old Agent .gemini backup folder not found on Desktop."
        Exit
    }

    # 2. Automatically Close Running IDE & Agent Processes
    Start-Sleep -Seconds 2
    $processes = Get-Process | Where-Object { $_.Name -like "*Antigravity*" }
    if ($processes) {
        Log-Message "Closing running Antigravity IDE processes..."
        $processes | Stop-Process -Force
        Start-Sleep -Seconds 3
    }

    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

    # 3. Backup Current IDE User Profile
    if (Test-Path $DestIDE) {
        $BackupParentDir = Join-Path $env:APPDATA "Antigravity IDE"
        $BackupIDE = Join-Path $BackupParentDir "User_Backup_$Timestamp"
        Log-Message "Creating backup of current IDE settings to: $BackupIDE..."
        New-Item -ItemType Directory -Path $BackupIDE -Force | Out-Null
        Copy-Item -Path $DestIDE -Destination $BackupIDE -Recurse -Force
        Log-Message "IDE Backup completed."
    }

    # 4. Backup Current Active Agent .gemini Folder
    if (Test-Path $DestGemini) {
        $BackupGemini = Join-Path $env:USERPROFILE ".gemini_Backup_$Timestamp"
        Log-Message "Creating backup of active .gemini settings to: $BackupGemini..."
        New-Item -ItemType Directory -Path $BackupGemini -Force | Out-Null
        Copy-Item -Path $DestGemini -Destination $BackupGemini -Recurse -Force -ErrorAction SilentlyContinue
        Log-Message "Agent .gemini Backup completed."
    }

    # 5. Migrate IDE Data (Clean Overwrite)
    Log-Message "Migrating IDE database & settings..."
    if (Test-Path $DestIDE) {
        Remove-Item -Path $DestIDE -Recurse -Force -ErrorAction SilentlyContinue
    }
    Copy-Item -Path $SourceIDE -Destination $DestIDE -Recurse -Force
    Log-Message "IDE Data migrated successfully."

    # 6. Migrate Agent .gemini Data (Clean Overwrite)
    Log-Message "Migrating Agent history & logs..."
    if (Test-Path $DestGemini) {
        Remove-Item -Path $DestGemini -Recurse -Force -ErrorAction SilentlyContinue
    }
    Copy-Item -Path $SourceGemini -Destination $DestGemini -Recurse -Force
    Log-Message "Agent History migrated successfully."

    Log-Message "Migration finished successfully!"

    # 7. Restart IDE Automatically
    $exePath = "C:\Users\mahen\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe"
    if (Test-Path $exePath) {
        Log-Message "Launching Antigravity IDE..."
        Start-Process $exePath
    } else {
        Log-Message "Could not locate Antigravity IDE executable at $exePath."
    }
} catch {
    Log-Message "Error occurred during migration: $_"
    Log-Message $_.ScriptStackTrace
}
