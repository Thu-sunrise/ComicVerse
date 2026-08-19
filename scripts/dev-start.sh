#!/usr/bin/env bash
# ============================================================
# dev-start.sh
#
# One-command developer environment startup:
#   1. Validate environment configuration (.env)
#   2. Build shared contract module & all microservices via Maven reactor
#   3. Start Docker Compose infrastructure (Postgres, RabbitMQ, Redis, MinIO, Nginx)
#   4. Execute Flyway database migrations across all 10 databases
#   5. Verify health check suite
#   6. Execute smoke test suite
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "============================================================"
echo "🚀 Starting ComicVerse Development Platform..."
echo "============================================================"

# 1. Environment check
if [[ ! -f ".env" ]]; then
    echo "⚠️  .env file not found. Copying .env.example -> .env"
    cp .env.example .env
fi

# 2. Build multi-module Maven project from root
echo "📦 Building Maven multi-module reactor (shared + 11 microservices)..."
mvn clean package -DskipTests -B --no-transfer-progress

# 3. Start Docker Compose containers
echo "🐳 Starting local Docker infrastructure..."
docker compose -f infrastructure/dev/docker-compose.yml up -d --build

# 4. Wait for infrastructure readiness
echo "⏳ Waiting for PostgreSQL, RabbitMQ, Redis, and MinIO readiness..."
sleep 10

# 5. Run Flyway migrations
echo "🗃️  Executing Flyway database migrations..."
if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* || "$OSTYPE" == "cygwin"* ]]; then
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/migrate-all.ps1
else
    ./scripts/migrate-all.sh
fi

# 6. Health check
echo "🔍 Running health checks..."
./scripts/health-check.sh

# 7. Smoke test
echo "🧪 Running smoke tests..."
./scripts/smoke-test.sh

echo "============================================================"
echo "🎉 ComicVerse Base Platform is UP and HEALTHY!"
echo "   Nginx Entrypoint: http://localhost:80"
echo "   API Gateway:      http://localhost:8080"
echo "   RabbitMQ UI:      http://localhost:15672"
echo "   MinIO Console:    http://localhost:9001"
echo "============================================================"
