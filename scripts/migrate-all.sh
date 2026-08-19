#!/usr/bin/env bash
# ============================================================
# migrate-all.sh
#
# Runs Flyway migrations for all 10 domain services.
# Fails immediately with non-zero exit code if any migration fails.
# ============================================================

set -euo pipefail

SERVICES=(
    "auth-service"
    "story-service"
    "sync-service"
    "user-service"
    "payment-service"
    "recommendation-service"
    "chat-service"
    "notification-service"
    "search-service"
    "media-service"
)

declare -A DB_PREFIXES=(
    ["auth-service"]="AUTH"
    ["story-service"]="STORY"
    ["sync-service"]="SYNC"
    ["user-service"]="USER"
    ["payment-service"]="PAYMENT"
    ["recommendation-service"]="RECOMMENDATION"
    ["chat-service"]="CHAT"
    ["notification-service"]="NOTIFICATION"
    ["search-service"]="SEARCH"
    ["media-service"]="MEDIA"
)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f ".env" ]]; then
    export $(grep -v '^#' .env | xargs)
fi

FAILED_SERVICES=()

run_migration() {
    local service="$1"
    local prefix="${DB_PREFIXES[$service]}"
    local url_var="${prefix}_DATABASE_URL"
    local user_var="${prefix}_DATABASE_USERNAME"
    local pass_var="${prefix}_DATABASE_PASSWORD"

    local db_url="${!url_var:-}"
    local db_user="${!user_var:-}"
    local db_pass="${!pass_var:-}"

    if [[ -z "$db_url" ]]; then
        echo "❌ ERROR: $service database URL ($url_var) is not set!"
        FAILED_SERVICES+=("$service")
        return 1
    fi

    echo "🗃️  Migrating $service ($db_url)..."
    cd "$ROOT_DIR/services/$service"
    
    if mvn flyway:migrate \
        -Dflyway.url="$db_url" \
        -Dflyway.user="$db_user" \
        -Dflyway.password="$db_pass" \
        -Dflyway.locations="classpath:db/migration" \
        -q; then
        echo "✅ $service — Migration succeeded."
    else
        echo "❌ $service — Migration FAILED!"
        FAILED_SERVICES+=("$service")
    fi
    cd "$ROOT_DIR"
}

if [[ $# -gt 0 ]]; then
    for arg in "$@"; do
        run_migration "${arg}-service" 2>/dev/null || run_migration "$arg" || true
    done
else
    for service in "${SERVICES[@]}"; do
        run_migration "$service" || true
    done
fi

echo ""
if [[ ${#FAILED_SERVICES[@]} -gt 0 ]]; then
    echo "============================================================"
    echo "❌ MIGRATION FAILED for services: ${FAILED_SERVICES[*]}"
    echo "============================================================"
    exit 1
else
    echo "============================================================"
    echo "🎉 All 10 database Flyway migrations completed successfully!"
    echo "============================================================"
    exit 0
fi
