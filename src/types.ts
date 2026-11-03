export type MusicGenre =
  | 'Tất cả'
  | 'Pop'
  | 'Ballad'
  | 'Hip-hop/Rap'
  | 'R&B'
  | 'Rock'
  | 'Indie'
  | 'EDM'
  | 'Acoustic';

export type DurationFilter = 'all' | 'short' | 'medium' | 'long';

export type SortOption =
  | 'newest'
  | 'popular'
  | 'title-asc'
  | 'title-desc'
  | 'duration-asc'
  | 'duration-desc';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: MusicGenre;
  duration: string;
  durationSeconds: number;
  releaseYear: number;
  playCount: number;
  price: number;
  coverImage: string;
  previewAudioUrl: string;
  description: string;
  lyrics: string;
  composer: string;
  bitrate: string;
  tags: string[];
}

export interface FilterState {
  searchQuery: string;
  selectedGenre: MusicGenre;
  durationFilter: DurationFilter;
  releaseYearFilter: string;
  sortBy: SortOption;
}

export type Theme = 'light' | 'dark';
