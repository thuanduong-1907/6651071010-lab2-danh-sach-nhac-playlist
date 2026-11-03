import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import rawData from '../data/data.json';
import { Song } from '../types';
import { formatCurrency } from '../utils';

const allSongs: Song[] = rawData as Song[];

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const song = allSongs.find((item) => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [id]);

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Không tìm thấy bài hát yêu cầu
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Bài hát với mã &quot;{id}&quot; không tồn tại trong hệ thống.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow"
        >
          &larr; Trở về danh sách bài hát
        </Link>
      </div>
    );
  }

  // Các bài hát liên quan cùng thể loại
  const relatedSongs = allSongs
    .filter((s) => s.genre === song.genre && s.id !== song.id)
    .slice(0, 4);

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

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Nút quay lại danh sách điều hướng bằng Link */}
      <div>
        <button
          onClick={() => navigate('/')}
          type="button"
          aria-label="Quay lại danh sách bài hát"
          className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách
        </button>
      </div>

      {/* Header bài hát chi tiết */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Ảnh bìa album lớn */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            <img
              src={song.coverImage}
              alt={`Ảnh bìa album ${song.album} của bài hát ${song.title} do nghệ sĩ ${song.artist} trình bày`}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              {song.genre}
            </span>
          </div>

          {/* Thông tin mô tả chi tiết */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              Mã bài hát: {song.id}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {song.title}
            </h1>

            <div className="text-lg text-emerald-600 dark:text-emerald-400 font-semibold">
              {song.artist}
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {song.description}
            </p>

            {/* Thông số kỹ thuật của bài hát */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Album</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {song.album}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Năm phát hành</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  {song.releaseYear}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Thời lượng</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  {song.duration}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block">Bản quyền (formatCurrency)</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block">
                  {formatCurrency(song.price)}
                </span>
              </div>
            </div>

            {/* Tags bài hát */}
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              {song.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trình phát nhạc Audio Player tích hợp ngay trên trang */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <audio
            ref={audioRef}
            src={song.previewAudioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={togglePlay}
              type="button"
              aria-label={isPlaying ? `Tạm dừng bài hát ${song.title}` : `Phát bài hát ${song.title}`}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 transition transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
                <span className="text-slate-800 dark:text-slate-200">
                  {isPlaying ? 'Đang phát bản nghe thử...' : 'Bấm nút để nghe thử'}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {formatSeconds(currentTime)} / {formatSeconds(duration || song.durationSeconds)}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-100"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lời bài hát (Lyrics) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Lời bài hát (Lyrics)
        </h2>
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {song.lyrics}
        </div>
      </section>

      {/* Bài hát gợi ý cùng thể loại */}
      {relatedSongs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Bài hát cùng thể loại {song.genre}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedSongs.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="group flex items-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition space-x-3"
              >
                <img
                  src={item.coverImage}
                  alt={`Bìa bài hát gợi ý ${item.title}`}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.artist}
                  </p>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
