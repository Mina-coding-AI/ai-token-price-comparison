# Notification script for AI Token Price Comparison system
# Usage: .\notify-owner.ps1 [changes.json]

param([string]$ChangesFile = "")

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($ChangesFile) {
    $changesFilePath = $ChangesFile
} else {
    $changesFilePath = Join-Path $scriptDir "latest-changes.json"
}

# CRITICAL: Only read the exact file specified, never fall back to archived files
# Verify the file is the main latest-changes.json, not an archived copy
if (-not (Test-Path $changesFilePath)) {
    Write-Host "No changes file found at: $changesFilePath"
    Write-Host "Skipping notification - this is expected if no changes were detected"
    exit 0
}

# Additional safety: Check if this is an archived file (contains date in filename)
$filename = Split-Path $changesFilePath -Leaf
if ($filename -match "latest-changes-\d{4}-\d{2}-\d{2}") {
    Write-Error "ERROR: Attempted to read archived file: $filename"
    Write-Error "Should only read latest-changes.json, not archived copies"
    exit 1
}

Write-Host "Checking for changes in: $changesFilePath"

if (-not (Test-Path $changesFilePath)) {
    Write-Host "No changes file found, skipping notification"
    exit 0
}

try {
    $jsonContent = Get-Content $changesFilePath -Raw -Encoding UTF8
    $changes = $jsonContent | ConvertFrom-Json
    Write-Host "Found $($changes.Count) total changes"
} catch {
    Write-Error "Error loading changes: $_"
    exit 1
}

if (-not $changes -or $changes.Count -eq 0) {
    Write-Host "No changes to report"
    exit 0
}

# Build message using simple string concatenation
$message = "[AI Token Price Change Alert]`n`n"

$priceChangeCount = 0
$newModelCount = 0
$priceChangeText = ""
$newModelText = ""

foreach ($c in $changes) {
    if ($c.type -eq "price_change") {
        if ($priceChangeCount -lt 3) {
            $direction = if ($c.pctChange -gt 0) { "UP" } else { "DOWN" }
            $providerName = if ($c.provider -eq "aliyun") { "Aliyun" } else { "Bytedance" }
            $modelLevel = if ($c.level) { $c.level } else { $c.model }
            $pctValue = [System.Math]::Abs($c.pctChange)
            $priceChangeText += "  * $providerName $modelLevel : CNY $($c.old) -> CNY $($c.new) ($direction ${pctValue}%)`n"
        }
        $priceChangeCount++
    } elseif ($c.type -eq "new_model") {
        $providerName = if ($c.provider -eq "aliyun") { "Aliyun" } else { "Bytedance" }
        $modelLevel = if ($c.level) { $c.level } else { $c.model }
        $newModelText += "  * $providerName $modelLevel`n"
        $newModelCount++
    }
}

if ($priceChangeCount -gt 0) {
    $message += "Price Changes (${priceChangeCount}):`n"
    $message += $priceChangeText
    if ($priceChangeCount -gt 3) {
        $remaining = $priceChangeCount - 3
        $message += "  ... and ${remaining} more changes...`n"
    }
    $message += "`n"
}

if ($newModelCount -gt 0) {
    $message += "New Models (${newModelCount}):`n"
    $message += $newModelText
    $message += "`n"
}

$htmlPath = Join-Path $scriptDir "token-price-comparison-v5.html"
$message += "View details: file://$htmlPath`n"
$currentTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$message += "Updated: $currentTime"

Write-Host "`n=== Notification Message ==="
Write-Host $message
Write-Host "==========================="

$outputFile = Join-Path $scriptDir "pending-notification.txt"
$message | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`nNotification saved to: $outputFile"
Write-Host "Next step: QoderWork cron job should monitor this file and send notifications"

exit 0
