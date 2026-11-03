import React, { useMemo, useState } from 'react';
import rawData from '../data/data.json';
import { FilterState, Song } from '../types';
import { FilterBar } from '../components/FilterBar';
import { SongCard } from '../components/SongCard';
import { Pagination } from '../components/Pagination';
import { AudioPlayerModal } from '../components/AudioPlayerModal';

const allSongs: Song[] = rawData as Song[];

export const ListPage: React.FC = () => {
  // Bộ lọc nâng cao & tìm kiếm debounce 300ms
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedGenre: 'Tất cả',
    durationFilter: 'all',
    releaseYearFilter: 'all',
    sortBy: 'popular',
  });

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);

  // Modal nghe nhạc nhanh
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Lọc và sắp xếp danh sách bài hát
  const filteredAndSortedSongs = useMemo(() => {
    let result = [...allSongs];

    // 1. Tìm kiếm (được debounce 300ms tại FilterBar)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q) ||
          song.album.toLowerCase().includes(q) ||
          song.composer.toLowerCase().includes(q)
      );
    }

    // 2. Lọc theo Thể loại
    if (filters.selectedGenre !== 'Tất cả') {
      result = result.filter((song) => song.genre === filters.selectedGenre);
    }

    // 3. Lọc theo Thời lượng
    if (filters.durationFilter === 'short') {
      result = result.filter((song) => song.durationSeconds < 180);
    } else if (filters.durationFilter === 'medium') {
      result = result.filter((song) => song.durationSeconds >= 180 && song.durationSeconds <= 270);
    } else if (filters.durationFilter === 'long') {
      result = result.filter((song) => song.durationSeconds > 270);
    }

    // 4. Lọc theo Năm phát hành
    if (filters.releaseYearFilter !== 'all') {
      if (filters.releaseYearFilter === 'older') {
        result = result.filter((song) => song.releaseYear < 2018);
      } else {
        const year = Number(filters.releaseYearFilter);
        result = result.filter((song) => song.releaseYear === year);
      }
    }

    // 5. Sắp xếp
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.releaseYear - a.releaseYear;
        case 'popular':
          return b.playCount - a.playCount;
        case 'title-asc':
          return a.title.localeCompare(b.title, 'vi');
        case 'title-desc':
          return b.title.localeCompare(a.title, 'vi');
        case 'duration-asc':
          return a.durationSeconds - b.durationSeconds;
        case 'duration-desc':
          return b.durationSeconds - a.durationSeconds;
        default:
          return 0;
      }
    });

    return result;
  }, [filters]);

  // Xử lý thay đổi bộ lọc -> quay về trang 1
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Tính toán phân trang
  const totalItems = filteredAndSortedSongs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSongs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedSongs, currentPage, itemsPerPage]);

  const handleQuickPlay = (song: Song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner giới thiệu playlist */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-4 border border-emerald-400/30">
            <span>Chủ đề: Danh sách nhạc / Playlist</span>
            <span>&bull;</span>
            <span>Màu chủ đạo: Emerald (#059669)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Khám Phá Giai Điệu Cuộc Sống
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Tuyển tập hơn 20 bài hát hot nhất Việt Nam với đầy đủ thể loại: Pop, Ballad, Rap, R&amp;B, Acoustic...
            Tích hợp bộ lọc đa tiêu chí debounced 300ms, phân trang linh hoạt và chế độ tối/sáng.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm font-medium text-emerald-200">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>{allSongs.length} bài hát chọn lọc</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>8 thể loại âm nhạc</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              <span>Chuẩn chất lượng 320 kbps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Thanh tìm kiếm & Lọc nâng cao (debounced 300ms) */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        totalResults={totalItems}
      />

      {/* Danh sách bài hát dạng Responsive Grid đúng 3 breakpoint quy định ở Mục III.3.4:
          < 640px: 1 cột (grid-cols-1)
          640px - 1024px: 2 cột (sm:grid-cols-2)
          > 1024px: 3 đến 4 cột (lg:grid-cols-3 xl:grid-cols-4)
      */}
      {currentItems.length > 0 ? (
        <main
          aria-label="Danh sách các bài hát trong playlist"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {currentItems.map((song) => (
            <SongCard key={song.id} song={song} onQuickPlay={handleQuickPlay} />
          ))}
        </main>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Không tìm thấy bài hát phù hợp
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc thiết lập lại bộ lọc để xem toàn bộ danh sách bài hát.
          </p>
          <button
            onClick={() =>
              handleFilterChange({
                searchQuery: '',
                selectedGenre: 'Tất cả',
                durationFilter: 'all',
                releaseYearFilter: 'all',
                sortBy: 'popular',
              })
            }
            type="button"
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Xem tất cả bài hát
          </button>
        </div>
      )}

      {/* Phân trang (Pagination) */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modal nghe nhạc nhanh */}
      <AudioPlayerModal
        song={selectedSong}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
