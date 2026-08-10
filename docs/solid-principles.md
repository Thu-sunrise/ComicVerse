# Nguyên tắc thiết kế SOLID trong Dự án Smart Read (ComicVerse)

Tài liệu này dùng làm kim chỉ nam cho team phát triển trong việc tuân thủ 5 nguyên tắc SOLID khi xây dựng các Microservices (Spring Boot) và Giao diện (React.js/React Native). Việc tuân thủ SOLID giúp code dễ đọc, dễ bảo trì và dễ mở rộng.

---

## 1. S - Single Responsibility Principle (SRP)
**Nguyên tắc Đơn trách nhiệm**: Mỗi class, module hoặc function chỉ nên có MỘT lý do duy nhất để thay đổi. Nó chỉ nên đảm nhận một trách nhiệm cụ thể.

### Áp dụng vào dự án:
- **Tách biệt Controller, Service và Repository:**
  - `UserController` chỉ làm nhiệm vụ nhận Request (HTTP) và trả về Response. KHÔNG chứa logic nghiệp vụ.
  - `UserService` xử lý các logic nghiệp vụ (mã hóa password, kiểm tra email tồn tại). KHÔNG trực tiếp thao tác SQL.
  - `UserRepository` chỉ làm nhiệm vụ giao tiếp với Database (Neon Postgres).
- **Microservices Level:** Mỗi service chỉ nên làm tốt một việc. Ví dụ, `AuthService` chỉ lo việc đăng nhập và cấp token, không nên ôm thêm việc quản lý tủ truyện của người dùng (việc đó dành cho `LibraryService`).

---

## 2. O - Open/Closed Principle (OCP)
**Nguyên tắc Đóng/Mở**: Phần mềm (class, module, function) nên MỞ cho việc mở rộng (thêm tính năng mới), nhưng ĐÓNG cho việc sửa đổi (không sửa code cũ đang chạy tốt).

### Áp dụng vào dự án:
- **Sử dụng Interface / Abstract Class:**
  - Giả sử tính năng thanh toán (Payment) hỗ trợ nhiều cổng: VNPay, MoMo, IAP.
  - Hãy tạo một interface `PaymentGateway`.
  - Khi cần thêm thanh toán qua ZaloPay, ta chỉ việc tạo class `ZaloPayService implements PaymentGateway` thay vì phải vào class cũ thêm một đống câu lệnh `if-else`.

---

## 3. L - Liskov Substitution Principle (LSP)
**Nguyên tắc Thay thế Liskov**: Các object của class con có thể thay thế class cha mà không làm thay đổi tính đúng đắn của chương trình.

### Áp dụng vào dự án:
- Nếu class con kế thừa class cha (hoặc implement interface), nó phải thực hiện đúng hành vi mà class cha mong đợi, không được "ném ngoại lệ" bừa bãi hay làm sai lệch ý nghĩa của method.
- **Ví dụ vi phạm:** `VIPUser` kế thừa `User` nhưng khi gọi hàm `watchAds()` (xem quảng cáo) thì báo lỗi (vì VIP không cần xem quảng cáo). Thay vì kế thừa gượng ép, hãy thiết kế lại interface sao cho phù hợp (vd: tách riêng interface `AdWatcher`).

---

## 4. I - Interface Segregation Principle (ISP)
**Nguyên tắc Phân tách Interface**: Tốt hơn là có nhiều Interface nhỏ, cụ thể cho từng mục đích, thay vì một Interface lớn nhồi nhét mọi thứ. Client không nên bị ép buộc phải implement những method mà nó không sử dụng.

### Áp dụng vào dự án:
- Đừng tạo ra một interface quá to như `IStoryManager` chứa cả `createStory()`, `deleteStory()`, `addChapter()`, `rateStory()`.
- Tách ra thành các interface nhỏ hơn:
  - `IStoryEditor` (cho Admin/Author): `createStory()`, `deleteStory()`, `addChapter()`.
  - `IStoryViewer` (cho Reader): `rateStory()`, `readChapter()`.

---

## 5. D - Dependency Inversion Principle (DIP)
**Nguyên tắc Đảo ngược Phụ thuộc**: 
1. Các module cấp cao không nên phụ thuộc vào các module cấp thấp. Cả hai nên phụ thuộc vào abstractions (Interface).
2. Abstractions không nên phụ thuộc vào chi tiết. Chi tiết nên phụ thuộc vào abstractions.

### Áp dụng vào dự án (rất quan trọng trong Spring Boot):
- **Dependency Injection (DI):** Trong Spring Boot, luôn dùng `@Autowired` hoặc Constructor Injection để tiêm các `Interface` thay vì các class cụ thể.
- **Ví dụ:** Trong `StoryController`, bạn tiêm `IStoryService` thay vì `StoryServiceImpl`.
```java
@RestController
@RequiredArgsConstructor
public class StoryController {
    // Phụ thuộc vào Abstraction (Interface), không phụ thuộc vào chi tiết thực thi
    private final IStoryService storyService;
}
```
Điều này giúp bạn dễ dàng viết Mock Unit Test hoặc thay đổi implementation mà không ảnh hưởng tới Controller.

---

> **Checklist trước khi tạo Pull Request:**
> 1. Class này có đang ôm đồm quá 2 nhiệm vụ không? (SRP)
> 2. Nếu tôi thêm tính năng mới, tôi có phải sửa lại code cốt lõi của class này không? (OCP)
> 3. Tôi có đang Dependency Injection đúng chuẩn Spring Boot chưa? (DIP)
