import React from 'react';
import { Link } from 'react-router-dom';
import { Song } from '../types';
import { formatCurrency, truncateText } from '../utils';

interface SongCardProps {
  song: Song;
  onQuickPlay: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onQuickPlay }) => {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Khung ảnh bìa Album */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={song.coverImage}
          alt={`Ảnh bìa album ${song.album} của bài hát ${song.title} do ca sĩ ${song.artist} biểu diễn`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge Thể loại */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
          {song.genre}
        </span>

        {/* Nút Play nhanh nổi trên ảnh bìa */}
        <button
          onClick={() => onQuickPlay(song)}
          type="button"
          aria-label={`Nghe thử nhanh bài hát ${song.title}`}
          className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transform sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-200 focus:opacity-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
        >
          <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Thông tin bài hát */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            <Link
              to={`/item/${song.id}`}
              className="focus:outline-none focus-visible:underline"
              title={song.title}
            >
              {song.title}
            </Link>
          </h3>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 truncate">
            {song.artist}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            Album: {song.album} &bull; {song.releaseYear}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {truncateText(song.description, 85)}
          </p>
        </div>

        {/* Chỉ số phụ & Hành động */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center" title="Thời lượng">
              <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {song.duration}
            </span>
            <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
              {formatCurrency(song.price)}
            </span>
          </div>

          <Link
            to={`/item/${song.id}`}
            aria-label={`Xem chi tiết bài hát ${song.title}`}
            className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
          >
            Chi tiết &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
