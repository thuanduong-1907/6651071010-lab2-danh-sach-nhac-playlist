import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          {/* Header chung */}
          <Header />

          {/* Nội dung trang theo Route */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/item/:id" element={<DetailPage />} />
            </Routes>
          </div>

          {/* Footer chung */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-2">
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                THỰC HÀNH BUỔI 2 &bull; THIẾT KẾ WEB &bull; GV: NGUYỄN THIỆN DƯƠNG
              </div>
              <div>
                Sinh viên: <strong>Nguyễn Thiện Dương</strong> &bull; MSSV: <strong>6651071010</strong> &bull; Lớp: K66
              </div>
              <div className="text-xs text-slate-400">
                Đề tài: Danh sách nhạc/playlist (D=12) &bull; Bộ tính năng: Tìm kiếm + lọc nâng cao (debounce 300ms), Phân trang, Dark/Light mode (F=0) &bull; Màu chủ đạo: Emerald #059669 (C=1)
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
