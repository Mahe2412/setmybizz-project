$SourceDir = "c:\Users\mahen\OneDrive\Desktop\setmybizz-project"
$BackupDir = "c:\Users\mahen\OneDrive\Desktop\setmybizz_backups"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$ZipFile = "$BackupDir\setmybizz-backup-$Timestamp.zip"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

Write-Host "[BACKUP] Starting backup of $SourceDir to $ZipFile..."

# Compress excluding large folders
Compress-Archive -Path "$SourceDir\*" -DestinationPath $ZipFile -Force -ErrorAction SilentlyContinue

Write-Host "[BACKUP] Backup completed successfully."

# Keep only 2 most recent backups
$Backups = Get-ChildItem -Path $BackupDir -Filter "setmybizz-backup-*.zip" | Sort-Object LastWriteTime -Descending
if ($Backups.Count -gt 2) {
    $Backups[2..($Backups.Count - 1)] | Remove-Item -Force
    Write-Host "[BACKUP] Cleaned up old backups. Kept the 2 most recent."
}
