# TÀI LIỆU THIẾT KẾ WIREFRAME & BẢN VẼ HỆ THỐNG

**Dự án**: MelodyHub - Nền Tảng Danh Sách Nhạc / Playlist Trực Tuyến  
**Sinh viên thực hiện**: Nguyễn Thiện Dương  
**MSSV**: 6651071010  
**Lớp môn học**: Thiết Kế Web - Thực hành Buổi 2  
**Giảng viên**: Nguyễn Thiện Dương  

---

## 1. Thông số thiết kế cá nhân hóa theo MSSV

- **MSSV**: `6651071010`
- **S = 6 + 6 + 5 + 1 + 0 + 7 + 1 + 0 + 1 + 0 = 27**
- **D = 27 mod 15 = 12** $\rightarrow$ **Chủ đề**: Danh sách nhạc/playlist
- **F = 10 mod 10 = 0** $\rightarrow$ **Bộ 3 tính năng bắt buộc**:
  1. Tìm kiếm + lọc nâng cao (debounce 300ms)
  2. Phân trang (Pagination)
  3. Dark/Light mode (lưu trạng thái localStorage)
- **C = 6 mod 5 = 1** $\rightarrow$ **Màu chủ đạo**: Emerald (`#059669`)

---

## 2. Kiến trúc bố cục & Đáp ứng 3 Breakpoints (Mục III.3.4)

| Kích thước màn hình | Phân loại | Số cột lưới (Grid) | Bố cục điều hướng & thành phần |
| :--- | :--- | :--- | :--- |
| **< 640px** | Mobile | **1 cột** (`grid-cols-1`) | Header thu gọn; Thanh tìm kiếm & chip thể loại trượt ngang (scroll-x); Thẻ bài hát dạng thẻ dọc/ngang tối ưu cảm ứng; Phân trang rút gọn. |
| **640px – 1024px** | Tablet | **2 cột** (`sm:grid-cols-2`) | Header hiển thị đầy đủ tên & badge MSSV; Bộ lọc hiển thị dạng lưới 2 cột; Lưới thẻ bài hát 2 cột cân đối. |
| **> 1024px** | Desktop | **3 – 4 cột** (`lg:grid-cols-3 xl:grid-cols-4`) | Bố cục chuẩn Dashboard âm nhạc hiện đại; Hero Banner rộng với hiệu ứng gradient Emerald; Lưới bài hát 4 cột; Khung chi tiết bài hát mở rộng kèm Lyrics và danh sách gợi ý. |

---

## 3. Bản vẽ cấu trúc Wireframe

Bản vẽ vector trực quan đầy đủ được lưu tại file: `design/wireframe.svg`.

### 3.1. Trang danh sách bài hát (`/` - ListPage)
1. **Header (Sticky Navigation)**:
   - Logo MelodyHub + Icon sóng nhạc tông Emerald (`#059669`).
   - Badge định danh sinh viên: `MSSV: 6651071010`.
   - Nút điều hướng nội bộ bằng `<Link to="/">`.
   - Nút chuyển chế độ Giao diện Sáng/Tối (`ThemeToggle`) có `aria-label`.
2. **Hero Banner**:
   - Tiêu đề giới thiệu bộ sưu tập âm nhạc.
   - Các thống kê: tổng số bài hát (24), số thể loại (8), chất lượng 320 kbps.
3. **Thanh tìm kiếm & Bộ lọc nâng cao (FilterBar)**:
   - Ô nhập tìm kiếm debounced 300ms theo tên bài hát, ca sĩ, album, nhạc sĩ.
   - Hàng chip lọc theo Thể loại: Tất cả, Pop, Ballad, Hip-hop/Rap, R&B, Rock, Indie, EDM, Acoustic.
   - Bộ chọn Thời lượng (Ngắn, Vừa, Dài), Năm phát hành, Tiêu chí sắp xếp.
   - Nút Đặt lại bộ lọc (Reset) và hiển thị số kết quả tìm thấy.
4. **Lưới bài hát (Responsive Grid)**:
   - Thẻ bài hát (`SongCard`) chứa ảnh bìa album (có `alt` mô tả), badge thể loại, tên bài hát, ca sĩ, album, thời lượng, giá bản quyền định dạng qua `formatCurrency()`, nút nghe thử nhanh mở Modal.
5. **Thanh phân trang (Pagination)**:
   - Hiển thị bài bắt đầu - bài kết thúc trên tổng số bài.
   - Nút Trước/Sau, danh sách số trang có highlight trang hiện tại (`aria-current="page"`).
   - Dropdown chọn số lượng bài hiển thị: 6, 8, 12 bài/trang.
6. **Modal nghe thử (AudioPlayerModal)**:
   - Bẫy focus bên trong modal (Focus Trap).
   - Đóng bằng phím `Escape` hoặc click ra ngoài backdrop.
   - Trình phát âm thanh có thanh tiến trình và nút Play/Pause.

### 3.2. Trang chi tiết bài hát (`/item/:id` - DetailPage)
1. Nút quay lại danh sách bằng `<Link to="/">`.
2. Khung bìa album khổ lớn với độ tương phản cao, badge thể loại.
3. Thông tin chi tiết: Tên bài, ca sĩ, nhạc sĩ, album, năm phát hành, thời lượng, giá bản quyền.
4. Trình phát nhạc Audio Player trực quan với thanh thời gian thực.
5. Khung hiển thị toàn bộ Lời bài hát (Lyrics).
6. Danh sách các bài hát gợi ý cùng thể loại.

---

## 4. Chuẩn tiếp cận Accessibility (WCAG 2.1 AA)

- **Hình ảnh**: 100% thẻ `<img>` đều có thuộc tính `alt` mô tả chính xác ngữ cảnh.
- **Nút bấm icon**: Tất cả nút chỉ chứa icon đều có thuộc tính `aria-label` tương ứng.
- **Tương phản màu sắc**: Tỷ lệ tương phản chữ trên nền đạt tối thiểu 4.5:1 (Emerald đậm `#059669` trên nền sáng `#ffffff` và Emerald sáng `#10b981` / `#34d399` trên nền tối `#0f172a`).
- **Focus Trap & Bàn phím**: Modal được lập trình bẫy phím `Tab` và lắng nghe phím `Escape` để đóng modal chuẩn mực.
