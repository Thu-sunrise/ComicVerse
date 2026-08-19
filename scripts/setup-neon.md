# ============================================================
# Neon PostgreSQL Setup Guide
# ============================================================
#
# Create 10 separate databases in Neon (one per service).
# Database-per-service is mandatory in this architecture.
# Cross-service database queries are STRICTLY FORBIDDEN.
#
# ============================================================
# STEPS
# ============================================================
#
# 1. Log in to Neon Dashboard: https://console.neon.tech
#
# 2. Create a NEW PROJECT named "comicverse-dev"
#
# 3. Create 10 databases in the project:
#    - auth_db
#    - story_db
#    - sync_db
#    - user_db
#    - payment_db
#    - recommendation_db
#    - chat_db
#    - notification_db
#    - search_db
#    - media_db
#
# 4. For each database, copy the connection string from Neon Dashboard.
#    It looks like:
#    postgresql://{username}:{password}@{host}/{dbname}?sslmode=require
#
# 5. Convert to JDBC format for Spring Boot:
#    Original:  postgresql://user:pass@ep-xxx.region.aws.neon.tech/auth_db?sslmode=require
#    JDBC:      jdbc:postgresql://ep-xxx.region.aws.neon.tech/auth_db?sslmode=require
#
# 6. Fill in .env:
#    AUTH_DATABASE_URL=jdbc:postgresql://ep-xxx.region.aws.neon.tech/auth_db?sslmode=require
#    AUTH_DATABASE_USERNAME=your-neon-username
#    AUTH_DATABASE_PASSWORD=your-neon-password
#    ... (repeat for all 10 services)
#
# 7. Run migrations:
#    source .env && ./scripts/migrate-all.sh
#
# ============================================================
# PRODUCTION (AWS RDS / Aurora Serverless)
# ============================================================
#
# Replace Neon connection strings with RDS connection strings.
# No code changes required — only env var updates.
#
# RDS JDBC format:
#   jdbc:postgresql://{rds-endpoint}:5432/{dbname}?sslmode=require
#
# Use AWS IAM DB Authentication in production for zero-credential security.
