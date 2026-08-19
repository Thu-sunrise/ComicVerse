#!/usr/bin/env bash
# ============================================================
# dev-stop.sh — Graceful local environment shutdown
# ============================================================

set -euo pipefail

COMPOSE_FILE="infrastructure/dev/docker-compose.yml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "🛑 Stopping ComicVerse local environment..."
docker compose -f "$COMPOSE_FILE" down

echo "✅ Environment stopped cleanly."
