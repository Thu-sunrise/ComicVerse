# ComicVerse — Full Technical & Architecture Documentation

Tài liệu kỹ thuật tổng hợp toàn bộ hệ thống **ComicVerse (Smart Read Platform)** bao gồm Kiến trúc Microservices Backend, Kiến trúc Clean Architecture Frontend, Quản lý Môi trường, Cơ sở dữ liệu và Hướng dẫn phát triển.

---

## 1. Tổng quan Dự án (Project Overview)

ComicVerse là nền tảng đọc truyện kỹ thuật số đa nền tảng (Manga, Webtoon, Light Novel) được xây dựng theo kiến trúc Microservices hướng sự kiện (Event-driven) cho Backend và Clean Architecture cho Frontend.

### Các tính năng cốt lõi:
- **Đồng bộ hóa tiến độ đọc (Sync Progress):** Đọc tiếp liền mạch giữa nhiều thiết bị.
- **Phòng chat cộng đồng Realtime:** Tích hợp Ably Realtime cho chat trực tiếp theo đầu truyện.
- **Thông báo đẩy (Push Notifications):** Firebase Cloud Messaging (FCM) thông báo chương mới, bình luận.
- **Tìm kiếm nâng cao (Full-Text Search):** PostgreSQL `tsvector` + GIN Index tối ưu tốc độ tìm kiếm.
- **Cơ chế thanh toán & Ví (Payment & Wallet):** Quản lý số dư coin, giao dịch mở khóa chương.

---

## 2. Kiến trúc Hệ thống (Architecture)

### 2.1 Backend Microservices

Hệ thống Backend gồm **11 Microservices** chạy trên mạng nội bộ Docker (`comicverse-network`). Chỉ **Nginx (Port 80)** và **API Gateway (Port 8080)** là cổng giao tiếp công khai.

| Service | Port nội bộ | Database | Chức năng chính |
|---|---|---|---|
| `api-gateway` | 8080 | Stateless | Định tuyến, xác thực RSA JWT, CORS, Request ID tracing |
| `auth-service` | 8081 | `auth_db` | Đăng ký, đăng nhập, cấp & xoay vòng Refresh Token, ký RSA JWT |
| `story-service` | 8082 | `story_db` | Quản lý danh mục truyện, metadata, phát hành chương |
| `sync-service` | 8083 | `sync_db` | Đồng bộ tiến độ đọc giữa các thiết bị |
| `user-service` | 8084 | `user_db` | Hồ sơ người dùng, danh sách yêu thích, cài đặt cá nhân |
| `payment-service` | 8085 | `payment_db` | Ví người dùng, giao dịch coin, lịch sử mua |
| `recommendation-service` | 8086 | `recommendation_db` | Gợi ý truyện cá nhân hóa, local read model cho danh mục truyện |
| `chat-service` | 8087 | `chat_db` | Xác thực Ably token, phòng chat theo truyện, tin nhắn |
| `notification-service` | 8088 | `notification_db` | Quản lý FCM device tokens, gửi thông báo đẩy |
| `search-service` | 8089 | `search_db` | Động cơ tìm kiếm toàn văn PostgreSQL Full-Text Search |
| `media-service` | 8090 | `media_db` | Quản lý media assets, trừu tượng hóa Local / MinIO / S3 Storage |

#### Nguyên tắc Database-per-Service:
* Mỗi microservice sở hữu cơ sở dữ liệu độc lập (10 database Neon PostgreSQL).
* **Tuyệt đối không truy vấn chéo database giữa các service**.
* Giao tiếp giữa các service sử dụng **REST API nội bộ qua Gateway** hoặc **RabbitMQ Domain Events**.

---

### 2.2 Frontend Applications (Clean Architecture)

Các ứng dụng Web Frontend độc lập (Standalone Vite + React + TypeScript apps), mỗi ứng dụng tự quản lý thư viện và dependencies riêng trong thư mục `src/lib/`:

```text
apps/
├── web-reader/          # Ứng dụng đọc truyện (Vite + React + TS, Port 5173)
│   ├── src/lib/         # Embedded libraries: ui, api-client, types, utils, config, testing
│   ├── package.json     # Standalone dependencies
│   └── vite.config.ts   # Cấu hình Vite với alias @lib/*
│
└── web-admin/           # Cổng quản trị Admin (Vite + React + TS, Port 3001)
    ├── src/lib/         # Embedded libraries: ui, api-client, types, utils, config, testing
    ├── package.json     # Standalone dependencies
    └── vite.config.ts   # Cấu hình Vite với alias @lib/*
```

#### Phân tầng Clean Architecture trong mỗi ứng dụng:
1. **Domain Layer (`src/domain/`):** Pure TypeScript entities, value objects, repository interfaces. Không phụ thuộc React, Vite hay thư viện ngoài.
2. **Application Layer (`src/application/`):** Chứa các Use Cases nghiệp vụ (`GetComicDetailUseCase`, `GetDashboardStatsUseCase`).
3. **Infrastructure Layer (`src/infrastructure/`):** Hiện thực Repository interfaces (`ComicApiRepository`), gọi API qua `@lib/api-client`, chuyển đổi DTO sang Entity qua Mappers.
4. **Presentation Layer (`src/presentation/`):** Giao diện người dùng React (Pages, Components, Hooks, Router).

---

## 3. Cấu hình Môi trường (.env Guide)

Toàn bộ hệ thống chỉ sử dụng **1 file `.env` duy nhất tại thư mục root** (`.env`):

| Biến môi trường | Mục đích | Mặc định Local / Dev |
|---|---|---|
| `GATEWAY_PORT` | Cổng API Gateway | `8080` |
| `GATEWAY_SECRET` | Khóa bí mật bảo vệ giao tiếp giữa Gateway và Services | Chuỗi ngẫu nhiên |
| `JWT_PRIVATE_KEY_BASE64` | Khóa riêng RSA 2048-bit (Base64) để ký Access Token | Đã sinh tự động |
| `JWT_PUBLIC_KEY_BASE64` | Khóa công khai RSA 2048-bit (Base64) để giải mã Token | Đã sinh tự động |
| `CORS_ALLOWED_ORIGINS` | Danh sách URL Frontend được phép gọi API | `http://localhost:5173,http://localhost:3001` |
| `RABBITMQ_HOST` / `PORT` | Kết nối Message Broker RabbitMQ | `rabbitmq:5672` (nội bộ Docker) |
| `RABBITMQ_MANAGEMENT_PORT` | Dashboard quản trị RabbitMQ | `15672` (User: `comicverse`) |
| `MINIO_PORT` / `CONSOLE_PORT` | Object Storage MinIO & Web Console | `9000` / `9001` (User: `comicverse`) |
| `*_DATABASE_URL` | Chuỗi kết nối JDBC cho 10 database Neon PostgreSQL | Dán connection string từ Neon |

---

## 4. Hướng dẫn Khởi chạy (Quickstart Guide)

### 4.1 Khởi chạy Frontend Web Apps
```bash
# 1. Cài đặt dependencies (tại root)
pnpm install

# 2. Khởi chạy đồng thời cả Web Reader & Web Admin (1 Lệnh)
pnpm dev
# hoặc
pnpm dev:all

# 3. Khởi chạy riêng lẻ từng web app
pnpm dev:reader   # Web Reader: http://localhost:5173
pnpm dev:admin    # Web Admin: http://localhost:3001
```

### 4.2 Khởi chạy Backend & Infrastructure (Docker)
```bash
# 1. Khởi động toàn bộ 11 Microservices + Nginx + RabbitMQ + Redis + MinIO
docker compose -f infrastructure/dev/docker-compose.yml up -d --build

# 2. Dừng hệ thống Docker
docker compose -f infrastructure/dev/docker-compose.yml down
```

---

## 5. Quy tắc Kiểm thử & Chất lượng Code (Quality Assurance)

* **Kiểm tra TypeScript & Linter:**
  ```bash
  pnpm typecheck   # Kiểm tra type toàn bộ Frontend
  pnpm lint        # Kiểm tra ESLint Clean Architecture rules
  ```
* **Chạy Unit Tests:**
  ```bash
  pnpm test        # Chạy Vitest unit tests cho Frontend
  mvn test         # Chạy JUnit 5 unit tests cho Backend (Zero DB dependencies)
  ```
* **Build Production Bundle:**
  ```bash
  pnpm build       # Build bundle cho cả Reader và Admin
  ```
