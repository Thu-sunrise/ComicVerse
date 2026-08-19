#!/usr/bin/env bash
# ============================================================
# health-check.sh
#
# Probes health endpoints for Gateway, Nginx, and all 10 domain services.
# Returns 0 if all UP, non-zero if any service fails.
# ============================================================

set -euo pipefail

HOST="${1:-localhost}"

ENDPOINTS=(
    "http://${HOST}/nginx-health|Nginx"
    "http://${HOST}/api/v1/health|API-Gateway"
    "http://${HOST}/internal/auth/health|Auth-Service"
    "http://${HOST}/internal/story/health|Story-Service"
    "http://${HOST}/internal/sync/health|Sync-Service"
    "http://${HOST}/internal/user/health|User-Service"
    "http://${HOST}/internal/payment/health|Payment-Service"
    "http://${HOST}/internal/recommendation/health|Recommendation-Service"
    "http://${HOST}/internal/chat/health|Chat-Service"
    "http://${HOST}/internal/notification/health|Notification-Service"
    "http://${HOST}/internal/search/health|Search-Service"
    "http://${HOST}/internal/media/health|Media-Service"
)

FAILED=0

echo "🔍 Checking health across all components on ${HOST}..."
echo "------------------------------------------------------------"

for entry in "${ENDPOINTS[@]}"; do
    url="${entry%%|*}"
    name="${entry#*|}"

    if curl -s --max-time 5 "$url" | grep -q "UP"; then
        echo "✅ [UP]   $name -> $url"
    else
        echo "❌ [DOWN] $name -> $url"
        FAILED=$((FAILED + 1))
    fi
done

echo "------------------------------------------------------------"
if [[ $FAILED -eq 0 ]]; then
    echo "🎉 All services are healthy!"
    exit 0
else
    echo "⚠️  $FAILED service(s) failed health check!"
    exit 1
fi
