#!/usr/bin/env bash
# ============================================================
# generate-jwt-keys.sh
#
# Generates RSA 2048-bit key pair for JWT signing.
# Auth-service uses the PRIVATE key to sign tokens.
# All other services use the PUBLIC key to verify tokens.
#
# Usage:
#   ./scripts/generate-jwt-keys.sh
#
# Output:
#   .keys/jwt_private.pem      — RSA private key (PEM)
#   .keys/jwt_public.pem       — RSA public key (PEM)
#   .keys/jwt_private.b64      — Base64-encoded private key (for JWT_PRIVATE_KEY_BASE64)
#   .keys/jwt_public.b64       — Base64-encoded public key (for JWT_PUBLIC_KEY_BASE64)
#
# IMPORTANT:
#   - NEVER commit .keys/ to Git (it is in .gitignore)
#   - Copy the .b64 values into your .env file
#   - For production: store in AWS Secrets Manager or Vault
# ============================================================

set -euo pipefail

KEYS_DIR=".keys"
mkdir -p "$KEYS_DIR"

echo "🔐 Generating RSA 2048-bit key pair..."

# Generate RSA private key (PKCS#8 format — required by Java)
openssl genpkey -algorithm RSA -out "$KEYS_DIR/jwt_private.pem" -pkeyopt rsa_keygen_bits:2048
echo "✅ Private key: $KEYS_DIR/jwt_private.pem"

# Extract public key
openssl rsa -pubout -in "$KEYS_DIR/jwt_private.pem" -out "$KEYS_DIR/jwt_public.pem"
echo "✅ Public key:  $KEYS_DIR/jwt_public.pem"

# Base64-encode (single line, no newlines — needed by Spring Security)
# Use -A flag on macOS, -w 0 on Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    base64 -i "$KEYS_DIR/jwt_private.pem" > "$KEYS_DIR/jwt_private.b64"
    base64 -i "$KEYS_DIR/jwt_public.pem"  > "$KEYS_DIR/jwt_public.b64"
else
    base64 -w 0 "$KEYS_DIR/jwt_private.pem" > "$KEYS_DIR/jwt_private.b64"
    base64 -w 0 "$KEYS_DIR/jwt_public.pem"  > "$KEYS_DIR/jwt_public.b64"
fi

echo ""
echo "============================================================"
echo "Add these values to your .env file:"
echo "============================================================"
echo ""
echo "JWT_PRIVATE_KEY_BASE64=$(cat "$KEYS_DIR/jwt_private.b64")"
echo ""
echo "JWT_PUBLIC_KEY_BASE64=$(cat "$KEYS_DIR/jwt_public.b64")"
echo ""
echo "============================================================"
echo "⚠️  NEVER commit .keys/ directory or .env to Git!"
echo "============================================================"
