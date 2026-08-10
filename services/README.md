# Cấu trúc thư mục chuẩn cho các Microservice

Thư mục `service/` này là nơi chứa toàn bộ mã nguồn của các microservices (ví dụ: `auth-service`, `user-service`, `api-gateway`, v.v.).

Mỗi microservice (Spring Boot) bên trong thư mục này cần tuân thủ cấu trúc chuẩn dưới đây để đảm bảo tính nhất quán, dễ đọc và dễ bảo trì:

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
 │   │       ├── application.yml  # File cấu hình biến môi trường, port, DB connection, JWT secret...
 │   │       └── static/          # (Tùy chọn) Chứa các tài nguyên tĩnh nếu có.
 │   │
 │   └── test/                    # Thư mục chứa Unit Test và Integration Test.
 │
 ├── .gitignore                   # Loại trừ các file rác, file build (target/, build/) không đưa lên Git.
 ├── pom.xml                      # (Maven) File quản lý các thư viện (dependencies) cần thiết cho service.
 └── Dockerfile                   # Kịch bản hướng dẫn đóng gói mã nguồn thành một Docker Container.
```

## Các Lưu Ý Quan Trọng
1. **Tuân thủ SOLID:** Đảm bảo Controller không chứa logic tính toán (chỉ nhận và trả data), chuyển hết logic về Service.
2. **Khai báo tên Service:** Tên thư mục gốc phải sử dụng `kebab-case` (ví dụ: `auth-service`), trong khi tên Java package phải là chữ thường dính liền (ví dụ: `com.comicverse.auth`).
3. **Môi trường cục bộ (.env):** Không được push các mật khẩu DB, khóa JWT trực tiếp vào `application.yml` rồi đưa lên Git. Hãy dùng biến môi trường (ví dụ: `${DB_PASSWORD}`) và cấu hình qua file `.env` ở local.
