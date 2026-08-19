$ErrorActionPreference = 'Stop'

$services = @(
    @{ Name = 'auth-service'; Prefix = 'AUTH' },
    @{ Name = 'story-service'; Prefix = 'STORY' },
    @{ Name = 'sync-service'; Prefix = 'SYNC' },
    @{ Name = 'user-service'; Prefix = 'USER' },
    @{ Name = 'payment-service'; Prefix = 'PAYMENT' },
    @{ Name = 'recommendation-service'; Prefix = 'RECOMMENDATION' },
    @{ Name = 'chat-service'; Prefix = 'CHAT' },
    @{ Name = 'notification-service'; Prefix = 'NOTIFICATION' },
    @{ Name = 'search-service'; Prefix = 'SEARCH' },
    @{ Name = 'media-service'; Prefix = 'MEDIA' }
)

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (Test-Path '.env') {
    Get-Content '.env' | Where-Object { $_ -match '^[^#][^=]*=' } | ForEach-Object {
        $name, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim().Trim('"'), 'Process')
    }
}

$failed = @()
foreach ($service in $services) {
    $prefix = $service.Prefix
    $url = [Environment]::GetEnvironmentVariable("${prefix}_DATABASE_URL", 'Process')
    $user = [Environment]::GetEnvironmentVariable("${prefix}_DATABASE_USERNAME", 'Process')
    $password = [Environment]::GetEnvironmentVariable("${prefix}_DATABASE_PASSWORD", 'Process')

    if ([string]::IsNullOrWhiteSpace($url) -or $url.Contains('<')) {
        Write-Error "$($service.Name): ${prefix}_DATABASE_URL is missing or still a placeholder."
        $failed += $service.Name
        continue
    }

    Write-Host "Migrating $($service.Name)..."
    Push-Location (Join-Path $root "services/$($service.Name)")
    try {
        & mvn flyway:migrate "-Dflyway.url=$url" "-Dflyway.user=$user" "-Dflyway.password=$password" '-Dflyway.locations=classpath:db/migration' -q
        if ($LASTEXITCODE -ne 0) {
            $failed += $service.Name
        }
    }
    finally {
        Pop-Location
    }
}

if ($failed.Count -gt 0) {
    throw "Flyway migration failed for: $($failed -join ', ')"
}

Write-Host 'All 10 database Flyway migrations completed successfully.'