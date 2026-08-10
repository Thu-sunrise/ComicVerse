# Quy Chuẩn Đặt Tên (Naming Convention) - Smart Read (ComicVerse)

Để đảm bảo source code đồng nhất giữa các thành viên, toàn bộ dự án sẽ tuân thủ các quy chuẩn đặt tên dưới đây, chia theo từng công nghệ cụ thể.

---

## 1. Java / Spring Boot (Backend)

*   **Class / Interface:** Sử dụng `PascalCase` (Viết hoa chữ cái đầu của mỗi từ).
    *   *Ví dụ:* `UserController`, `StoryService`, `PaymentGateway`.
*   **Interface vs Implementation:**
    *   Interface: Bắt đầu bằng chữ `I` (ví dụ `IUserService`) HOẶC giữ nguyên tên (ví dụ `UserService`).
    *   Class triển khai (Implementation): Luôn thêm hậu tố `Impl` (ví dụ `UserServiceImpl`).
*   **Method (Hàm) / Variable (Biến):** Sử dụng `camelCase` (Viết thường chữ cái đầu tiên, viết hoa chữ cái đầu các từ tiếp theo).
    *   *Ví dụ:* `getUserById()`, `totalCoins`, `createdAt`.
*   **Constant (Hằng số):** Sử dụng `UPPER_SNAKE_CASE` (Viết hoa toàn bộ, phân cách bằng dấu gạch dưới).
    *   *Ví dụ:* `MAX_LOGIN_RETRY`, `DEFAULT_PAGE_SIZE`.
*   **Package Name:** Sử dụng toàn bộ chữ thường, phân cách bởi dấu chấm (.). Tránh dùng từ số nhiều.
    *   *Ví dụ:* `com.comicverse.auth.controller`, `com.comicverse.story.dto`.

---

## 2. Thiết kế RESTful API (Endpoints)

*   **Đường dẫn (URL):** Sử dụng chữ thường và `kebab-case` (gạch nối). Sử dụng **danh từ số nhiều** để đại diện cho tài nguyên.
    *   *Đúng:* `/api/v1/users`, `/api/v1/stories/{id}/chapters`
    *   *Sai:* `/api/v1/getUsers`, `/api/v1/User_List`
*   **Hành động (Action):** Thể hiện qua HTTP Methods (GET, POST, PUT, DELETE), không để hành động trong URL trừ những trường hợp đặc thù (VD: tính toán, xử lý hệ thống).
    *   *Tốt:* `POST /api/v1/stories/` (Tạo mới)
    *   *Chấp nhận:* `POST /api/v1/users/{id}/lock` (Khóa tài khoản - mang tính nghiệp vụ)

---

## 3. PostgreSQL Database (Neon DB)

*   **Table (Bảng) & Column (Cột):** Sử dụng `snake_case` (viết thường, phân cách bằng dấu gạch dưới).
    *   *Ví dụ Table:* `users`, `story_categories`, `payment_transactions`.
    *   *Ví dụ Column:* `first_name`, `created_at`, `is_active`.
*   **Primary Key (Khóa chính):** Luôn đặt là `id` hoặc `[tên_bảng_số_ít]_id` (vd: `user_id`).
*   **Foreign Key (Khóa ngoại):** Luôn dùng định dạng `[tên_bảng_tham_chiếu_số_ít]_id` (vd: bảng `chapters` sẽ có cột `story_id`).

---

## 4. React.js / TypeScript (Frontend & Web Admin)

*   **Component (Thành phần giao diện):** Sử dụng `PascalCase`. Tên file cũng trùng với tên Component.
    *   *Ví dụ:* `UserProfile.tsx`, `StoryCard.tsx`, `Button.tsx`.
*   **Hook (React Hooks):** Bắt đầu bằng chữ `use` theo `camelCase`.
    *   *Ví dụ:* `useFetchStory`, `useAuth`.
*   **Type / Interface (TypeScript):** Sử dụng `PascalCase`.
    *   *Ví dụ:* `type UserProfile = { ... }`, `interface StoryProps { ... }`.
*   **CSS / className:** Sử dụng `kebab-case` (nếu dùng CSS thuần) hoặc theo chuẩn của TailwindCSS.
    *   *Ví dụ:* `class="btn-primary"`, `class="text-blue-500"`.

---

## 5. Quy chuẩn Git (Branch & Commit)

*   **Tên Nhánh (Branch Name):** Sử dụng định dạng `[loại_nhánh]/[mô-tả-ngắn]`.
    *   `feature/add-login-google` (Tính năng mới)
    *   `bugfix/fix-payment-crash` (Sửa lỗi)
    *   `hotfix/database-connection` (Lỗi khẩn cấp trên Production)
*   **Tin nhắn Commit (Commit Message):** Dùng Conventional Commits: `[type]: [Mô tả ngắn gọn]`.
    *   `feat: thêm tính năng đăng nhập bằng Google`
    *   `fix: sửa lỗi crash khi nạp xu VNPay`
    *   `docs: cập nhật tài liệu SOLID và Naming Convention`
    *   `refactor: tối ưu lại code hàm tính tổng xu`

---

## 6. Tệp tin và Thư mục (Files & Folders)

*   **Các Service trong thư mục `src/`:** Tên thư mục chứa các microservices phải luôn sử dụng `kebab-case` và tốt nhất nên có hậu tố `-service` (hoặc tên theo chức năng rõ ràng).
    *   *Đúng:* `src/auth-service`, `src/api-gateway`, `src/user-service`
    *   *Sai:* `src/AuthService`, `src/user_service`, `src/Auth`
*   **Tài liệu Markdown (.md) và Thư mục thường:** Sử dụng `kebab-case` (chữ thường, cách nhau bằng gạch nối). Tránh viết hoa, tránh dùng khoảng trắng hay UPPER_SNAKE_CASE.
    *   *Đúng:* `naming-convention.md`, `solid-principles.md`, `src/utils/`
    *   *Sai:* `NAMING_CONVENTION.md`, `Solid Principles.md`
*   **Ngoại lệ:** Các file đặc biệt của dự án hoặc thư viện yêu cầu như `README.md`, `Dockerfile`, `docker-compose.yml`.
