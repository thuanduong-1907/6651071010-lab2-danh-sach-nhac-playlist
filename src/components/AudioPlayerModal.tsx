import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Song } from '../types';
import { formatCurrency, truncateText } from '../utils';

interface AudioPlayerModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ song, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Lưu focus trước khi mở modal và phục hồi khi đóng
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setIsPlaying(false);
      setCurrentTime(0);

      // Focus phần tử đầu tiên sau khi mở
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Bẫy focus (Focus Trap) và lắng nghe phím ESC để đóng modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Phím Escape: đóng modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // 2. Phím Tab: Bẫy focus bên trong modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: lùi
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: tiến
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Xử lý play/pause audio
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatSeconds = (sec: number): string => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !song) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-song-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng modal bằng phím hoặc click chuột */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Đóng cửa sổ phát nhạc"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Nội dung modal */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Ảnh bìa album có alt mô tả thật */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
              <img
                src={song.coverImage}
                alt={`Ảnh bìa album của bài hát ${song.title} do ca sĩ ${song.artist} thể hiện`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-emerald-600 text-white shadow">
                {song.genre}
              </span>
            </div>

            {/* Thông tin bài hát */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3
                id="modal-song-title"
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate"
              >
                {song.title}
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm sm:text-base mt-1">
                {song.artist}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                Album: {song.album} ({song.releaseYear})
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {song.bitrate}
                </span>
                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
                  Bản quyền: {formatCurrency(song.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Trích đoạn lời bài hát (sử dụng truncateText) */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
            &ldquo;{truncateText(song.lyrics.replace(/\n/g, ' '), 110)}&rdquo;
          </div>

          {/* Thanh audio trình phát */}
          <div className="mt-6 space-y-3">
            <audio
              ref={audioRef}
              src={song.previewAudioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              preload="metadata"
            />

            {/* Tiến trình phát */}
            <div className="space-y-1">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-100"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(duration || song.durationSeconds)}</span>
              </div>
            </div>

            {/* Nút điều khiển phát / dừng */}
            <div className="flex items-center justify-center space-x-4 pt-2">
              <button
                onClick={togglePlay}
                type="button"
                aria-label={isPlaying ? 'Tạm dừng nghe thử bài hát' : 'Bắt đầu nghe thử bài hát'}
                className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 transition transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Nút điều hướng chi tiết */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Đóng (ESC)
            </button>
            <Link
              to={`/item/${song.id}`}
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
            >
              Xem trang chi tiết &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
