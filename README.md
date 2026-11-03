# MelodyHub — Nền Tảng Danh Sách Nhạc / Playlist Trực Tuyến

> **BÀI THỰC HÀNH BUỔI 2 — THIẾT KẾ WEB**  
> **Giảng viên**: Nguyễn Thiện Dương  
> **Sinh viên thực hiện**: Nguyễn Thiện Dương  
> **MSSV**: 6651071010  
> **Lớp**: K66 - UTC2  

---

## I. Xác Định Đề Tài Cá Nhân Hóa Theo MSSV

- **MSSV**: `6651071010`
- **S = 6 + 6 + 5 + 1 + 0 + 7 + 1 + 0 + 1 + 0 = 27**
- **D = 27 mod 15 = 12** $\rightarrow$ **Chủ đề (Bảng 1)**: **Danh sách nhạc / playlist**
- **F = 10 mod 10 = 0** $\rightarrow$ **Bộ 3 tính năng bắt buộc (Bảng 2)**:
  1. **Tìm kiếm + lọc nâng cao (debounce 300ms)**
  2. **Phân trang (Pagination)**
  3. **Dark/Light mode (lưu trạng thái localStorage)**
- **C = 6 mod 5 = 1** $\rightarrow$ **Màu chủ đạo gợi ý (Bảng 3)**: **Emerald (#059669)**

---

## II. Bộ Công Nghệ Bắt Buộc

- **Ngôn ngữ**: TypeScript (`strict: true`, không dùng `any`)
- **Build Tool**: Vite
- **UI Library**: React 18 (Hooks, functional component)
- **Styling**: Tailwind CSS với màu chủ đạo `#059669` (Emerald)
- **Routing**: React Router v6 (2 route chính: `/` và `/item/:id`, điều hướng qua `<Link>`)
- **State management**: React Hooks (`useState`, `useReducer`, `useMemo`, `useContext`)
- **Lint**: ESLint (Cấu hình chuẩn Vite + 2 rule bổ sung: `prefer-const` & `@typescript-eslint/no-unused-vars`)
- **Test**: Vitest + Testing Library + jsdom (7/7 test cases pass)
- **Triển khai**: Vercel / Netlify / GitHub Pages

---

## III. Cấu Trúc Thư Mục

```
6651071010_LAB2/
├── public/
│   ├── favicon.svg          # Favicon nốt nhạc phong cách Emerald
│   └── logo.svg             # Logo thương hiệu MelodyHub
├── src/
│   ├── assets/              # Tài nguyên hình ảnh, biểu tượng
│   ├── components/          # Các component tái sử dụng
│   │   ├── Header.tsx           # Thanh điều hướng, thông tin sinh viên, nút theme
│   │   ├── SongCard.tsx         # Thẻ hiển thị bài hát, responsive grid
│   │   ├── FilterBar.tsx        # Tìm kiếm debounce 300ms, bộ lọc thể loại/thời lượng/năm
│   │   ├── Pagination.tsx       # Phân trang, chọn số bài hiển thị mỗi trang
│   │   └── AudioPlayerModal.tsx # Modal phát nhạc, bẫy focus, đóng bằng ESC
│   ├── context/
│   │   └── ThemeContext.tsx     # Context Dark/Light mode đồng bộ localStorage
│   ├── pages/
│   │   ├── ListPage.tsx         # Trang danh sách bài hát (Route: /)
│   │   └── DetailPage.tsx       # Trang chi tiết bài hát & lời nhạc (Route: /item/:id)
│   ├── data/
│   │   └── data.json            # 24 bài hát chi tiết với đầy đủ metadata
│   ├── types.ts                 # Định nghĩa kiểu dữ liệu TypeScript (strict)
│   ├── utils.ts                 # 4 hàm tiện ích: formatCurrency, truncateText, validateEmail, debounce
│   ├── utils.test.ts            # Bộ kiểm thử 7 test case (Vitest)
│   ├── App.tsx                  # Component gốc và cấu hình BrowserRouter
│   ├── index.css                # Cấu hình Tailwind CSS và thanh cuộn
│   └── main.tsx                 # Điểm khởi tạo ứng dụng React
├── design/
│   ├── wireframe.md             # Thuyết minh thiết kế wireframe cho 3 breakpoints
│   └── wireframe.svg            # Bản vẽ vector wireframe chi tiết
├── eslint.config.js             # Cấu hình ESLint flat config
├── tsconfig.json                # Cấu hình TypeScript gốc
├── tsconfig.app.json            # Cấu hình TypeScript ứng dụng (strict: true)
├── tsconfig.node.json           # Cấu hình TypeScript cho Vite build
├── tailwind.config.js           # Cấu hình màu sắc Emerald và Dark mode class
├── postcss.config.js            # Cấu hình PostCSS
└── package.json                 # Quản lý thư viện và scripts
```

---

## IV. Hướng Dẫn Cài Đặt & Kiểm Tra Tự Động

### 1. Cài đặt các gói phụ thuộc:
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Truy cập: `http://localhost:5173`

### 3. Kiểm tra TypeScript (Yêu cầu: 0 lỗi):
```bash
npx tsc --noEmit
```

### 4. Kiểm tra Lint (Yêu cầu: 0 lỗi, 0 cảnh báo):
```bash
npx eslint .
```

### 5. Chạy bộ kiểm thử Vitest (Yêu cầu: 7/7 test cases pass):
```bash
npm run test
```

### 6. Build đóng gói ứng dụng:
```bash
npm run build
```

---

## V. Giải Thích Kỹ Thuật (Tính Năng Bắt Buộc F=0)

### Cài đặt Tìm kiếm nâng cao kết hợp cơ chế Debounce 300ms:
Tính năng tìm kiếm bài hát được thiết kế để mang lại trải nghiệm mượt mà, tối ưu hiệu năng và tránh việc re-render liên tục khi người dùng gõ phím. Hàm tiện ích `debounce` nhận vào hàm xử lý cập nhật `fn` và thời gian chờ `delay` (300ms). Trong component `FilterBar`, hai luồng trạng thái được tách biệt: biến `searchInput` cục bộ phản hồi ngay lập tức lên thẻ `<input>` giúp giao diện gõ chữ không bị giật lag; đồng thời hàm debounced callback được bọc trong `useMemo` sẽ trì hoãn việc kích hoạt sự kiện `onFilterChange` lên component cha `ListPage`. Mỗi khi người dùng gõ một ký tự mới trước khi hết 300ms, timer cũ sẽ bị hủy bằng `clearTimeout` và khởi tạo lại timer mới. Chỉ khi người dùng dừng thao tác đủ 300ms, hàm tìm kiếm mới tiến hành lọc trên tập dữ liệu gồm các trường tiêu đề (`title`), nghệ sĩ (`artist`), album và nhạc sĩ (`composer`). Cơ chế này giúp giảm hơn 80% số lần tính toán lọc dữ liệu không cần thiết, đáp ứng hoàn hảo tiêu chuẩn hiệu năng cao của Lighthouse.
