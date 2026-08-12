# Cấu trúc thư mục chuẩn cho các Microservice

Thư mục `services/` này là nơi chứa toàn bộ mã nguồn của các microservices (ví dụ: `auth-service`, `story-service`, `sync-service`, `api-gateway`, v.v.).

Mỗi microservice (Spring Boot) bên trong thư mục này tuân thủ cấu trúc chuẩn dưới đây để đảm bảo tính nhất quán, dễ đọc và dễ bảo trì:

```text
[tên-service]/
 ├── src/
 │   ├── main/
 │   │   ├── java/com/comicverse/[tên_service]/
 │   │   │   ├── controller/      # Nơi tiếp nhận Request (HTTP GET, POST, ...) và trả về Response.
 │   │   │   ├── service/         # Nơi chứa logic nghiệp vụ (Business logic). Thường chia làm Interface và Impl.
 │   │   │   ├── repository/      # Nơi chứa các interface tương tác trực tiếp với Database (Spring Data JPA).
 │   │   │   ├── model/           # Nơi chứa các class Entity (map với bảng CSDL).
 │   │   │   ├── dto/             # Nơi chứa các class Data Transfer Object (để gửi/nhận dữ liệu API).
 │   │   │   ├── config/          # Chứa các cấu hình (Security, CORS, Bean config...).
 │   │   │   └── exception/       # Nơi xử lý các lỗi ngoại lệ tập trung (GlobalExceptionHandler).
 │   │   │
 │   │   └── resources/
 │   │       ├── application.yml  # File cấu hình biến môi trường, port, DB connection...
 │   │       └── db/migration/    # File script Flyway migration CSDL (vd: V1__create_tables.sql).
 │   │
 │   └── test/                    # Thư mục chứa Unit Test và Integration Test.
 │
 ├── .env.example                 # Mẫu khai báo biến môi trường cho CSDL local / cloud.
 ├── pom.xml                      # (Maven) File quản lý dependencies của service.
 └── Dockerfile                   # Kịch bản đóng gói service thành Docker Container.
```

---

## 🚀 Hướng Dẫn Khởi Chạy 3 Microservices (POC)

### 1. Bảng Thông Tin Danh Sách Microservices

| Service | Thư mục | Port | Database (Neon) | Health Check Endpoint | Main API Endpoint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth Service** | `services/auth-service` | `8081` | `kits-user` | `GET /api/v1/health` | `GET /api/v1/users` |
| **Story Service** | `services/story-service` | `8082` | `kits-story` | `GET /api/v1/health` | `GET /api/v1/stories` |
| **Sync Service** | `services/sync-service` | `8083` | `kits-sync` | `GET /api/v1/health` | `GET /api/v1/reading-progress` |

---

### 2. Hướng Dẫn Khởi Chạy Từng Service

#### **Cách 1: Khởi chạy bằng Terminal (Maven & Java)**

##### A. Auth Service (Port 8081)
```bash
cd services/auth-service

# Build file JAR
mvn clean package -DskipTests

# Thiết lập biến môi trường DB Neon và chạy
$env:DB_URL="jdbc:postgresql://<NEON_USER_HOST>/neondb?sslmode=require"
$env:DB_USERNAME="<NEON_USER>"
$env:DB_PASSWORD="<NEON_PASSWORD>"
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

##### B. Story Service (Port 8082)
```bash
cd services/story-service

# Build file JAR
mvn clean package -DskipTests

# Thiết lập biến môi trường DB Neon và chạy
$env:DB_URL="jdbc:postgresql://<NEON_STORY_HOST>/neondb?sslmode=require"
$env:DB_USERNAME="<NEON_USER>"
$env:DB_PASSWORD="<NEON_PASSWORD>"
java -jar target/story-service-0.0.1-SNAPSHOT.jar
```

##### C. Sync Service (Port 8083)
```bash
cd services/sync-service

# Build file JAR
mvn clean package -DskipTests

# Thiết lập biến môi trường DB Neon và chạy
$env:DB_URL="jdbc:postgresql://<NEON_SYNC_HOST>/neondb?sslmode=require"
$env:DB_USERNAME="<NEON_USER>"
$env:DB_PASSWORD="<NEON_PASSWORD>"
java -jar target/sync-service-0.0.1-SNAPSHOT.jar
```

---

#### **Cách 2: Khởi chạy bằng IDE (IntelliJ IDEA / Eclipse / VS Code)**
1. Mở từng thư mục service (`services/auth-service`, `services/story-service`, `services/sync-service`) dưới dạng dự án Maven.
2. Trong cấu hình **Run/Debug Configurations**, thêm các biến môi trường:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
3. Chạy hàm `main()` tại các file:
   - `AuthServiceApplication.java` (Auth Service)
   - `StoryServiceApplication.java` (Story Service)
   - `SyncServiceApplication.java` (Sync Service)

---

## Các Lưu Ý Quan Trọng
1. **Tuân thủ SOLID:** Đảm bảo Controller không chứa logic tính toán (chỉ nhận và trả data), chuyển hết logic về Service.
2. **Khai báo tên Service:** Tên thư mục gốc phải sử dụng `kebab-case` (ví dụ: `auth-service`), trong khi tên Java package phải là chữ thường dính liền (ví dụ: `com.comicverse.auth`).
3. **Môi trường cục bộ (.env):** Không được push các mật khẩu DB, khóa JWT trực tiếp vào `application.yml` rồi đưa lên Git. Hãy dùng biến môi trường (ví dụ: `${DB_PASSWORD}`) và cấu hình qua file `.env` ở local.
