import React, { useEffect, useMemo, useState } from 'react';
import { DurationFilter, FilterState, MusicGenre, SortOption } from '../types';
import { debounce } from '../utils';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResults: number;
}

const GENRES: MusicGenre[] = [
  'Tất cả',
  'Pop',
  'Ballad',
  'Hip-hop/Rap',
  'R&B',
  'Rock',
  'Indie',
  'EDM',
  'Acoustic',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  // Input local state để phản hồi gõ ngay lập tức
  const [searchInput, setSearchInput] = useState<string>(filters.searchQuery);

  // Tạo hàm debounce 300ms theo đúng yêu cầu đề bài
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        onFilterChange({
          ...filters,
          searchQuery: query,
        });
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    debouncedSearch(val);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({
      ...filters,
      searchQuery: '',
    });
  };

  const handleGenreSelect = (genre: MusicGenre) => {
    onFilterChange({
      ...filters,
      selectedGenre: genre,
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      durationFilter: e.target.value as DurationFilter,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      releaseYearFilter: e.target.value,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as SortOption,
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    onFilterChange({
      searchQuery: '',
      selectedGenre: 'Tất cả',
      durationFilter: 'all',
      releaseYearFilter: 'all',
      sortBy: 'popular',
    });
  };

  // Đồng bộ searchInput nếu bên ngoài reset
  useEffect(() => {
    setSearchInput(filters.searchQuery);
  }, [filters.searchQuery]);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedGenre !== 'Tất cả' ||
    filters.durationFilter !== 'all' ||
    filters.releaseYearFilter !== 'all' ||
    filters.sortBy !== 'popular';

  return (
    <section aria-label="Bộ lọc và tìm kiếm bài hát" className="space-y-4">
      {/* Thanh tìm kiếm chính với debounce 300ms */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Tìm bài hát theo tên, ca sĩ, album... (tự động lọc sau 300ms)"
          aria-label="Tìm kiếm bài hát nâng cao"
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
        />
        {searchInput && (
          <button
            onClick={handleClearSearch}
            type="button"
            aria-label="Xóa từ khóa tìm kiếm"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Danh sách chip lọc theo Thể loại */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex-shrink-0">
          Thể loại:
        </span>
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            type="button"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              filters.selectedGenre === genre
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Các bộ lọc phụ: Thời lượng, Năm phát hành, Sắp xếp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Lọc thời lượng */}
        <div>
          <label htmlFor="duration-select" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Thời lượng
          </label>
          <select
            id="duration-select"
            value={filters.durationFilter}
            onChange={handleDurationChange}
            aria-label="Lọc theo thời lượng bài hát"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả thời lượng</option>
            <option value="short">Ngắn (&lt; 3 phút)</option>
            <option value="medium">Vừa (3:00 - 4:30)</option>
            <option value="long">Dài (&gt; 4:30)</option>
          </select>
        </div>

        {/* Lọc năm phát hành */}
        <div>
          <label htmlFor="year-select" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Năm phát hành
          </label>
          <select
            id="year-select"
            value={filters.releaseYearFilter}
            onChange={handleYearChange}
            aria-label="Lọc theo năm phát hành"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả các năm</option>
            <option value="2024">Năm 2024</option>
            <option value="2023">Năm 2023</option>
            <option value="2022">Năm 2022</option>
            <option value="2020">Năm 2020</option>
            <option value="2018">Năm 2018</option>
            <option value="older">Trước năm 2018</option>
          </select>
        </div>

        {/* Sắp xếp */}
        <div>
          <label htmlFor="sort-select" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Sắp xếp theo
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={handleSortChange}
            aria-label="Sắp xếp danh sách bài hát"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="popular">Lượt nghe nhiều nhất</option>
            <option value="newest">Mới nhất (Năm phát hành)</option>
            <option value="title-asc">Tên bài hát (A &rarr; Z)</option>
            <option value="title-desc">Tên bài hát (Z &rarr; A)</option>
            <option value="duration-asc">Thời lượng ngắn nhất</option>
            <option value="duration-desc">Thời lượng dài nhất</option>
          </select>
        </div>

        {/* Kết quả và Đặt lại bộ lọc */}
        <div className="flex items-end justify-between sm:justify-end space-x-2">
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              type="button"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Đặt lại bộ lọc
            </button>
          )}
          <div className="text-right px-2 py-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {totalResults}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              kết quả
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
