# Unsubscribe user from DingTalk notifications
# Usage: .\unsubscribe.ps1 -UserId "123456"

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
    Write-Log "No subscribers file found" -Level "ERROR"
    exit 1
}

$subscribersData = Get-Content $subscribersFile -Raw | ConvertFrom-Json

# Find subscriber
$subscriber = $subscribersData.subscribers | Where-Object { $_.userId -eq $UserId }

if (-not $subscriber) {
    Write-Log "User $UserId not found in subscribers" -Level "WARNING"
    exit 2
}

if ($subscriber.status -eq "unsubscribed") {
    Write-Log "User $UserId is already unsubscribed" -Level "WARNING"
    exit 3
}

# Unsubscribe
$subscriber.status = "unsubscribed"
$subscriber.unsubscribedAt = (Get-Date -Format "o")

# Save
$subscribersData | ConvertTo-Json -Depth 3 | Out-File -FilePath $subscribersFile -Encoding UTF8
Write-Log "User $UserId unsubscribed successfully"

exit 0