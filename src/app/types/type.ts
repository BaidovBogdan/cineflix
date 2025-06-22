export interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  avatar: string;
  date: string;
}
export const GENRES = [
  'Боевик',
  'Драма',
  'Комедия',
  'Триллер',
  'Ужасы',
  'Фантастика',
] as const;

export type Genre = (typeof GENRES)[number];

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: string;
  genre: Genre; // тут теперь все 6 жанров
  image: string;
}
