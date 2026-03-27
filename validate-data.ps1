# Data Validation Script for AI Token Price Comparison
# Usage: .\validate-data.ps1

param(
    [string]$DataFile = "price-data.js",
    [switch]$Strict = $false
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataFilePath = Join-Path $scriptDir $DataFile

Write-Host "=== AI Token Price Data Validation ===" -ForegroundColor Cyan
Write-Host "Validating: $dataFilePath"
Write-Host ""

$errors = @()
$warnings = @()

# Check 1: File exists
if (-not (Test-Path $dataFilePath)) {
    Write-Error "Data file not found: $dataFilePath"
    exit 1
}

# Check 2: Can read as text
try {
    $content = Get-Content $dataFilePath -Raw -Encoding UTF8
} catch {
    Write-Error "Cannot read data file: $_"
    exit 1
}

# Check 3: Extract and validate metadata
try {
    # Extract metadata section
    if ($content -match 'metadata:\s*\{([^}]+)\}') {
        $metadataSection = $matches[1]
        
        # Check lastUpdated
        if ($metadataSection -match 'lastUpdated:\s*"([^"]+)"') {
            $lastUpdated = $matches[1]
            $today = Get-Date -Format "yyyy-MM-dd"
            
            if ($lastUpdated -eq $today) {
                Write-Host "✓ lastUpdated is current: $lastUpdated" -ForegroundColor Green
            } else {
                $daysOld = (Get-Date $today) - (Get-Date $lastUpdated)
                $warnings += "lastUpdated is stale: $lastUpdated ($($daysOld.Days) days old)"
                Write-Host "⚠ lastUpdated is stale: $lastUpdated ($($daysOld.Days) days old)" -ForegroundColor Yellow
            }
        } else {
            $errors += "lastUpdated field not found in metadata"
            Write-Host "✗ lastUpdated field not found" -ForegroundColor Red
        }
    } else {
        $errors += "Metadata section not found"
        Write-Host "✗ Metadata section not found" -ForegroundColor Red
    }
} catch {
    $errors += "Error parsing metadata: $_"
    Write-Host "✗ Error parsing metadata: $_" -ForegroundColor Red
}

# Check 4: Validate model structure
$requiredLevels = @('Flagship', 'Pro', 'Flash', 'Coder Pro', 'Coder', 'Vision Max', 'Vision Plus', 'Vision Lite')
$missingLevels = @()

foreach ($level in $requiredLevels) {
    # Check if level exists in data (simple pattern match)
    $pattern = "level:\s*[`"']?$level[`"']?"
    if ($content -notmatch $pattern) {
        $missingLevels += $level
    }
}

if ($missingLevels.Count -eq 0) {
    Write-Host "✓ All required levels present" -ForegroundColor Green
} else {
    $warnings += "Missing levels: $($missingLevels -join ', ')"
    Write-Host "⚠ Missing levels: $($missingLevels -join ', ')" -ForegroundColor Yellow
}

# Check 5: Validate price ranges
$pricePattern = 'input:\s*(\d+\.?\d*)'
$prices = [regex]::Matches($content, $pricePattern) | ForEach-Object { [decimal]$_.Groups[1].Value }

$outOfRange = $prices | Where-Object { $_ -lt 0.1 -or $_ -gt 100 }
if ($outOfRange.Count -eq 0) {
    Write-Host "✓ All input prices within valid range (0.1-100)" -ForegroundColor Green
} else {
    $errors += "Found $($outOfRange.Count) prices outside valid range"
    Write-Host "✗ Found $($outOfRange.Count) prices outside valid range" -ForegroundColor Red
}

# Check 6: Check for suspicious patterns
$suspiciousPatterns = @(
    @{ Pattern = 'doubao-seed-3\.0'; Description = "Suspicious model version (3.0 doesn't exist yet)" },
    @{ Pattern = 'qwen4-'; Description = "Suspicious model version (Qwen4 not released)" },
    @{ Pattern = 'price.*2\.0.*2\.5'; Description = "Suspicious price change pattern" }
)

foreach ($suspicious in $suspiciousPatterns) {
    if ($content -match $suspicious.Pattern) {
        $warnings += "Suspicious pattern found: $($suspicious.Description)"
        Write-Host "⚠ Suspicious pattern: $($suspicious.Description)" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "=== Validation Summary ===" -ForegroundColor Cyan
Write-Host "Errors: $($errors.Count)" -ForegroundColor $(if ($errors.Count -gt 0) { "Red" } else { "Green" })
Write-Host "Warnings: $($warnings.Count)" -ForegroundColor $(if ($warnings.Count -gt 0) { "Yellow" } else { "Green" })

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "ERRORS:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "WARNINGS:" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

# Exit code
if ($errors.Count -gt 0) {
    exit 1
} elseif ($Strict -and $warnings.Count -gt 0) {
    exit 2
} else {
    Write-Host ""
    Write-Host "✓ Validation passed" -ForegroundColor Green
    exit 0
}
