# ComicVerse (Smart Read)

> **A modern, scalable comic reading platform with a robust distributed backend, delivering a seamless experience for manga and webtoon lovers.**

[![Java Support](https://img.shields.io/badge/Java-17-orange.svg)](https://java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Cross_Platform-0ea5e9.svg)](https://reactnative.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

ComicVerse là nền tảng đọc truyện (Comic, Manga, Light Novel) đa nền tảng được thiết kế với kiến trúc **Microservices** tiên tiến, đáp ứng khả năng mở rộng cực cao (High Availability & Scalability) và cá nhân hóa trải nghiệm người dùng.

---

## Kiến trúc Kho lưu trữ (Monorepo Architecture)

Dự án này sử dụng mô hình **Monorepo** để quản lý toàn bộ hệ thống từ Backend, Frontend, cho đến Cấu hình Hạ tầng Cloud.

```text
smart-read-platform/
├── apps/                 # Frontend & Mobile Apps
│   ├── web-admin/        # CMS quản trị nội dung (React.js)
│   ├── web-reader/       # Cổng đọc truyện trên Web (React.js)
│   └── mobile-app/       # Ứng dụng đọc truyện trên ĐTDĐ (React Native / Flutter)
│
├── services/             # Backend Microservices (Spring Boot 3)
│   ├── api-gateway/      # Spring Cloud Gateway định tuyến tập trung
│   ├── auth-service/     # Quản lý xác thực (JWT & Firebase Auth)
│   ├── story-service/    # Quản lý truyện và nội dung chapter
│   ├── payment-service/  # Ví điện tử & Tích hợp thanh toán
│   ├── sync-service/     # Đồng bộ tiến độ đọc truyện Real-time
│   └── recommendation/   # Gợi ý truyện thông minh
│
├── infrastructure/       # Infrastructure & DevOps
│   ├── dev/              # Cấu hình Local Development (Docker Compose, Redis, DB)
│   └── prod/             # Cấu hình Production (Terraform, AWS EKS, Helm Charts)
│
├── docs/                 # Tài liệu dự án (SRS, API Specs, Quy chuẩn)
└── .github/workflows/    # CI/CD Pipelines
```

---

## Công nghệ Sử dụng (Tech Stack)

### Backend & Core Services
- **Framework:** Java 17, Spring Boot 3.x, Spring Cloud
- **Database:** PostgreSQL (Neon Serverless), Redis (Caching)
- **Realtime & Storage:** Firebase Firestore, FCM, Firebase Storage, AWS S3
- **Message Broker:** RabbitMQ / Apache Kafka

### Frontend & Mobile
- **Web App:** React.js, TypeScript, TailwindCSS, Vite
- **Mobile App:** React Native / Flutter (có hỗ trợ Offline Storage với SQLite/WatermelonDB)

### DevOps & Infrastructure
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes (K3s/EKS), Helm
- **IaC & CI/CD:** Terraform, GitHub Actions

---

## Khởi chạy Môi trường Local (Getting Started)

Dự án sử dụng mô hình **Hybrid Local/Cloud** cho môi trường phát triển: PostgreSQL được host trên Cloud (Neon Serverless) để giảm tải cho máy cá nhân, trong khi các Middleware (Redis, RabbitMQ, Eureka) chạy qua Docker Compose.

### Yêu cầu hệ thống:
* Docker & Docker Compose
* Java 17 (JDK)
* Node.js (>= 18)
* Tài khoản Neon Serverless (hoặc Cloud PostgreSQL tương đương)

### Các bước khởi chạy:

**1. Cấu hình biến môi trường**
Copy file mẫu để tạo file biến môi trường cục bộ:
```bash
cd infrastructure/dev
cp .env.example .env
```
*Mở file `.env` và điền chuỗi kết nối Database Cloud của bạn vào các biến `SPRING_DATASOURCE_*`.*

**2. Khởi động Hạ tầng Local (Middleware)**
```bash
docker-compose up -d
```
*(Lệnh này sẽ khởi động Redis, RabbitMQ và Eureka Service Registry)*
- RabbitMQ Management UI: `http://localhost:15672`
- Eureka Dashboard: `http://localhost:8761`

**3. Khởi chạy Backend Microservices (POC)**

Chi tiết hướng dẫn khởi chạy từng service xem tại [services/README.md](services/README.md). Tóm tắt các lệnh chạy local trên Terminal (PowerShell):

- **Auth Service (Port 8081):**
  ```powershell
  cd services/auth-service
  $env:DB_URL="jdbc:postgresql://ep-withered-water-azrelm0x-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  $env:DB_USERNAME="neondb_owner"
  $env:DB_PASSWORD="npg_fmZOuPX8xh5J"
  java -jar target/auth-service-0.0.1-SNAPSHOT.jar
  ```

- **Story Service (Port 8082):**
  ```powershell
  cd services/story-service
  $env:DB_URL="jdbc:postgresql://ep-empty-dew-azuxyot6-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  $env:DB_USERNAME="neondb_owner"
  $env:DB_PASSWORD="npg_DPmt3eNdzL9i"
  java -jar target/story-service-0.0.1-SNAPSHOT.jar
  ```

- **Sync Service (Port 8083):**
  ```powershell
  cd services/sync-service
  $env:DB_URL="jdbc:postgresql://ep-super-snow-az7yq1ge-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  $env:DB_USERNAME="neondb_owner"
  $env:DB_PASSWORD="npg_fqRyD54ACZxO"
  java -jar target/sync-service-0.0.1-SNAPSHOT.jar
  ```

**4. Khởi chạy Frontend (Web Reader)**
```bash
cd apps/web-reader
npm install
npm run dev
```
Giao diện Web đọc truyện sẽ khởi chạy tại: `http://localhost:5173`


---

## Tài liệu Tham khảo
Đội ngũ phát triển vui lòng đọc kỹ các tài liệu tiêu chuẩn trước khi viết code:
- [Quy chuẩn Đặt tên (Naming Convention)](docs/naming-convention.md)
- [Nguyên tắc Thiết kế SOLID](docs/solid-principles.md)
- [Quy chuẩn Cấu trúc Microservice](services/README.md)

---
*© 2026 ComicVerse. Designed for scalability and perfect reading experience.*
