# Send DingTalk notifications to subscribers
# Usage: .\notify-subscribers.ps1 -Type "price_change" -Message "..."

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("price_change", "new_model", "model_replacement")]
    [string]$Type,

    [Parameter(Mandatory=$true)]
    [string]$Message,

    [string]$RobotCode = "dingng77jziptnvwbdvv"
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$subscribersFile = Join-Path $scriptDir "subscribers.json"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logFile = Join-Path $scriptDir "logs\notifications-$(Get-Date -Format 'yyyy-MM-dd').log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $entry = "[$timestamp] [$Level] $Message"
    Write-Host $entry
    Add-Content -Path $logFile -Value $entry
}

# Ensure logs directory exists
$logsDir = Join-Path $scriptDir "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

Write-Log "=== Notification Send Started ==="
Write-Log "Type: $Type"

# Load subscribers
if (-not (Test-Path $subscribersFile)) {
    Write-Log "No subscribers file found" -Level "ERROR"
    exit 1
}

$subscribersData = Get-Content $subscribersFile -Raw | ConvertFrom-Json

# Filter active subscribers
$activeSubscribers = $subscribersData.subscribers | Where-Object { $_.status -eq "active" }

if ($activeSubscribers.Count -eq 0) {
    Write-Log "No active subscribers found" -Level "WARNING"
    exit 0
}

Write-Log "Found $($activeSubscribers.Count) active subscribers"

# Format message based on type
$formattedMessage = $Message
if (-not $Message.EndsWith("回复`"退订`"取消通知")) {
    $formattedMessage += "`n`n回复`"退订`"取消通知"
}

# Send to each subscriber
$successCount = 0
$failCount = 0

foreach ($subscriber in $activeSubscribers) {
    try {
        # Here we would call the DingTalk robot API
        # For now, we log what would be sent
        Write-Log "Sending to $($subscriber.userId): $formattedMessage"

        # Actual implementation would use:
        # $body = @{
        #     robotCode = $RobotCode
        #     userIds = @($subscriber.userId)
        #     title = "AI Token 价格提醒"
        #     markdown = $formattedMessage
        # } | ConvertTo-Json
        # Invoke-RestMethod -Uri "https://api.dingtalk.com/..." -Method POST -Body $body

        $successCount++
    } catch {
        Write-Log "Failed to send to $($subscriber.userId): $_" -Level "ERROR"
        $failCount++
    }
}

# Update last notification
$subscribersData.lastNotification = @{
    sentAt = (Get-Date -Format "o")
    type = $Type
    recipientCount = $successCount
    failedCount = $failCount
    content = $Message
}

$subscribersData | ConvertTo-Json -Depth 3 | Out-File -FilePath $subscribersFile -Encoding UTF8

Write-Log "=== Notification Send Completed ==="
Write-Log "Success: $successCount, Failed: $failCount"

exit 0