# ComicVerse — AI Context & Architectural Principles

> **IMPORTANT FOR AI AGENTS:** Read this document BEFORE writing code or modifying any component in this repository.

## 1. Executive Project Overview
**ComicVerse / Smart Read** is a multi-platform Manga / Webtoon / Light Novel reading platform built with a high-performance microservices architecture.

- **Organization:** KITS
- **Architecture:** 11 Microservices (1 Gateway + 10 Domain Services)
- **Data Strategy:** Strictly Database-per-Service (10 independent Neon PostgreSQL databases). NO cross-service DB access. NO cross-service SQL Foreign Keys.
- **Asynchronous Bus:** RabbitMQ (Topic Exchange `comicverse.events`, DLX `comicverse.dlx`).
- **Edge Routing & Auth:** Spring Cloud Gateway with RSA 2048-bit JWT verification. Passwords hashed with BCrypt.
- **Realtime Transport:** Ably Realtime (`chat-service`).
- **Push Notifications:** Firebase Cloud Messaging FCM (`notification-service`).
- **Search Engine:** PostgreSQL Full-Text Search tsvector + GIN Index (`search-service`).
- **Media Assets:** Local filesystem for offline dev; S3 / MinIO for object storage (`media-service`).

---

## 2. Mandatory Rules for AI Agents

1. **Unit Test Isolation:**
   - **CRITICAL:** Unit tests (`mvn test`) MUST NEVER connect to a real database (Neon PostgreSQL), Redis, RabbitMQ, or external APIs.
   - ALWAYS use Mockito and JUnit 5 mocks. Unit tests MUST pass in a clean environment without Docker or local servers running.
2. **Database-per-Service:**
   - Direct database access to another service's DB is STRICTLY FORBIDDEN.
   - Services MUST synchronize data using RabbitMQ domain events or local read models.
3. **Gateway Boundary:**
   - All client traffic MUST pass through `api-gateway` (port 8080 or via Nginx on port 80).
   - Domain services validate `X-Gateway-Secret` header to reject direct access.
4. **Third-Party Abstractions:**
   - Ably is abstracted behind `RealtimePublisher`.
   - FCM is abstracted behind `NotificationSender`.
   - Media storage is abstracted behind `StorageProvider`.
5. **No Secret Leaks:**
   - NEVER hardcode credentials, RSA private keys, or API tokens in code or Git. All secrets MUST be driven by environment variables (`.env`).

---

## 3. Microservice Catalog & Port Mappings

| Service | Port | Database | Responsibilities |
|---|---|---|---|
| `api-gateway` | 8080 | Stateless | Edge routing, JWT validation, CORS, Request ID tracing |
| `auth-service` | 8081 | `auth_db` | Registration, Login, RSA token signing, Refresh Token rotation (SHA-256) |
| `story-service` | 8082 | `story_db` | Manga / Webtoon titles, metadata, chapters |
| `sync-service` | 8083 | `sync_db` | Multi-device reading progress synchronization |
| `user-service` | 8084 | `user_db` | User profiles, preferences, reading lists |
| `payment-service` | 8085 | `payment_db` | Wallets, transactions, coin balance |
| `recommendation-service` | 8086 | `recommendation_db` | Recommendations, story catalog local read model |
| `chat-service` | 8087 | `chat_db` | Ably realtime token generation, chat rooms, messages |
| `notification-service` | 8088 | `notification_db` | Device token registry, FCM push notifications |
| `search-service` | 8089 | `search_db` | PostgreSQL tsvector FTS, auto-trigger, GIN index |
| `media-service` | 8090 | `media_db` | Media assets, Local/S3 storage abstraction |

---

## 4. Key Developer Commands

```bash
# 1. Generate RSA JWT Keys
./scripts/generate-jwt-keys.sh

# 2. Run Flyway migrations across all services
./scripts/migrate-all.sh

# 3. Start full local environment (Docker Compose)
./scripts/dev-start.sh

# 4. Execute unit tests (zero external DB dependency)
mvn test

# 5. Execute health and smoke tests
./scripts/health-check.sh
./scripts/smoke-test.sh
```

---

## 5. Documentation Index

- Architecture: [ARCHITECTURE.md](file:///c:/workSpace/KITS/ComicVerse/docs/ARCHITECTURE.md)
- Services Catalog: [SERVICES.md](file:///c:/workSpace/KITS/ComicVerse/docs/SERVICES.md)
- Databases Topology: [DATABASES.md](file:///c:/workSpace/KITS/ComicVerse/docs/DATABASES.md)
- Migration Policy: [DATABASE-MIGRATIONS.md](file:///c:/workSpace/KITS/ComicVerse/docs/DATABASE-MIGRATIONS.md)
- Testing Strategy: [TESTING.md](file:///c:/workSpace/KITS/ComicVerse/docs/TESTING.md)
- Deployment Guide: [DEPLOYMENT.md](file:///c:/workSpace/KITS/ComicVerse/docs/DEPLOYMENT.md)
