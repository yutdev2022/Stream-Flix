export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  duration: number; // in minutes
  thumbnailUrl: string;
  videoUrl: string;
  trailerUrl: string;
  type: 'movie' | 'show';
  genres: string[];
  cast: string[];
  rating: number;
}

export interface WatchHistoryItem {
  contentId: string;
  watchedDuration: number; // in seconds
  lastWatched: Date;
}

export interface WatchlistItem {
  contentId: string;
  addedAt: Date;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}