# Subscribe user to DingTalk notifications
# Usage: .\subscribe.ps1 -UserId "123456"

param(
    [Parameter(Mandatory=$true)]
    [string]$UserId
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$subscribersFile = Join-Path $scriptDir "subscribers.json"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $entry = "[$timestamp] [$Level] $Message"
    Write-Host $entry
}

# Validate UserId format (exactly 6 digits)
if ($UserId -notmatch '^\d{6}$') {
    Write-Log "Invalid UserId format: $UserId (must be exactly 6 digits)" -Level "ERROR"
    exit 1
}

# Load subscribers
if (-not (Test-Path $subscribersFile)) {
    $subscribersData = @{
        subscribers = @()
        lastNotification = $null
        metadata = @{
            version = "1.0"
            createdAt = (Get-Date -Format "o")
            robotCode = "dingng77jziptnvwbdvv"
        }
    }
} else {
    $subscribersData = Get-Content $subscribersFile -Raw | ConvertFrom-Json
}

# Check if already subscribed
$existing = $subscribersData.subscribers | Where-Object { $_.userId -eq $UserId }

if ($existing) {
    if ($existing.status -eq "active") {
        Write-Log "User $UserId is already subscribed" -Level "WARNING"
        exit 2
    } else {
        # Reactivate
        $existing.status = "active"
        $existing.unsubscribedAt = $null
        $existing.resubscribedAt = (Get-Date -Format "o")
        Write-Log "User $UserId reactivated subscription"
    }
} else {
    # New subscription
    $newSubscriber = @{
        userId = $UserId
        subscribedAt = (Get-Date -Format "o")
        unsubscribedAt = $null
        status = "active"
    }
    $subscribersData.subscribers += $newSubscriber
    Write-Log "New subscription: $UserId"
}

# Save
$subscribersData | ConvertTo-Json -Depth 3 | Out-File -FilePath $subscribersFile -Encoding UTF8
Write-Log "Subscription saved. Total subscribers: $($subscribersData.subscribers.Count)"

exit 0