# ComicVerse / Smart Read Platform

A multi-platform Manga / Webtoon / Light Novel digital reading system built on enterprise microservices architecture and Clean Architecture frontend applications.

> **AI Coding Agents:** Start by reading [AI_CONTEXT.md](file:///c:/workSpace/KITS/ComicVerse/AI_CONTEXT.md) before making code changes.

---

## 💻 Frontend Applications

ComicVerse Web bao gồm các ứng dụng web độc lập (Standalone Vite + React + TypeScript apps), mỗi ứng dụng tự quản lý dependencies và chứa thư viện riêng biệt (`src/lib/`):

```text
apps/
├── web-reader/          # Reader Web Application (Vite + React + TS, Port 5173)
│   ├── src/lib/         # Embedded libraries: ui, api-client, types, utils, config, testing
│   ├── package.json     # Independent dependencies & build config
│   └── vite.config.ts   # Standalone Vite configuration with @lib/* alias
│
└── web-admin/           # Admin Portal Application (Vite + React + TS, Port 3001)
    ├── src/lib/         # Embedded libraries: ui, api-client, types, utils, config, testing
    ├── package.json     # Independent dependencies & build config
    └── vite.config.ts   # Standalone Vite configuration with @lib/* alias
```

### ⚡ Quickstart Frontend Commands

```bash
# 1. Cài đặt dependencies (tại root hoặc trong từng app)
pnpm install

# 2. Khởi chạy TẤT CẢ Web Apps cùng lúc (Reader + Admin)
pnpm dev
# hoặc
pnpm dev:all

# 3. Khởi chạy riêng từng Web App
pnpm dev:reader   # Web Reader trên http://localhost:5173
pnpm dev:admin    # Web Admin trên http://localhost:3001

# 4. Kiểm tra chất lượng code & build
pnpm lint         # Chạy ESLint cho cả 2 apps
pnpm typecheck    # Kiểm tra TypeScript typecheck cho cả 2 apps
pnpm test         # Chạy Vitest unit tests cho cả 2 apps
pnpm build        # Build production bundles cho Reader & Admin
```

---

## 🚀 Backend Quickstart Guide

```bash
# 1. Copy environment configuration and generate RSA JWT keys
cp .env.example .env
./scripts/generate-jwt-keys.sh

# 2. Build shared contract module
cd services/shared && mvn clean install -DskipTests && cd ../..

# 3. Run unit tests across all microservices (Zero DB / external dependency)
mvn test

# 4. Start full local development infrastructure (1 Lệnh cho toàn bộ Backend)
./scripts/dev-start.sh
# Hoặc dùng Docker Compose trực tiếp:
docker compose -f infrastructure/dev/docker-compose.yml up -d --build

# 5. Verify health and smoke tests
./scripts/health-check.sh
./scripts/smoke-test.sh
```

---

## 🏛️ Microservice Architecture

The platform comprises 11 microservices on a private Docker network (`comicverse-network`). Only Nginx (Port 80) and API Gateway (Port 8080) are public entrypoints.

| Service Name | Port | Database | Primary Function |
|---|---|---|---|
| `api-gateway` | 8080 | Stateless | Edge Routing, RSA JWT, CORS, Request ID |
| `auth-service` | 8081 | `auth_db` | Register, Login, RSA Signing, Refresh Token Rotation |
| `story-service` | 8082 | `story_db` | Titles, Metadata, Chapter publishing |
| `sync-service` | 8083 | `sync_db` | Multi-device progress synchronization |
| `user-service` | 8084 | `user_db` | User profiles, reading lists, preferences |
| `payment-service` | 8085 | `payment_db` | User wallets, coin transactions |
| `recommendation-service` | 8086 | `recommendation_db` | Recommendations, story catalog local read model |
| `chat-service` | 8087 | `chat_db` | Ably token authentication, chat rooms, messages |
| `notification-service` | 8088 | `notification_db` | FCM device tokens, push notifications |
| `search-service` | 8089 | `search_db` | PostgreSQL Full-Text Search tsvector engine |
| `media-service` | 8090 | `media_db` | Media assets, Local / MinIO / S3 storage |

---

## 📚 Documentation

- [Full Technical & Architecture Documentation](file:///c:/workSpace/KITS/ComicVerse/docs/DOCUMENTATION.md)
- [AI Context & Rules](file:///c:/workSpace/KITS/ComicVerse/AI_CONTEXT.md)
