import React from 'react';
import { Tag, TrendingUp, Users, Clock } from 'lucide-react';

interface Genre {
  id: number;
  name: string;
}

const GENRES: Genre[] = [
  { id: 1, name: 'アクション' },
  { id: 2, name: 'アドベンチャー' },
  { id: 4, name: 'コメディ' },
  { id: 8, name: 'ドラマ' },
  { id: 10, name: 'ファンタジー' },
  { id: 14, name: '恋愛' },
  { id: 18, name: 'ロボット' },
  { id: 22, name: '恋愛' },
  { id: 23, name: '学園' },
  { id: 24, name: 'SF' },
  { id: 36, name: '日常' },
  { id: 41, name: '青春' },
  { id: 62, name: '異世界' },
];

export type SortType = 'popularity' | 'trending' | 'newest';

interface SortOption {
  id: SortType;
  name: string;
  icon: React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'popularity',
    name: '人気順',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'trending',
    name: 'トレンド',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'newest',
    name: '新着順',
    icon: <Clock className="w-4 h-4" />,
  },
];

interface GenreFilterProps {
  selectedGenre: number | null;
  selectedSort: SortType | null;
  onGenreSelect: (genreId: number | null) => void;
  onSortSelect: (sort: SortType) => void;
  showSortOptions?: boolean;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenre,
  selectedSort,
  onGenreSelect,
  onSortSelect,
  showSortOptions = true,
}) => {
  return (
    <div className="space-y-6 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">ジャンル</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onGenreSelect(null)}
            className={`btn ${
              selectedGenre === null
                ? 'bg-yellow-500 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            すべて
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onGenreSelect(genre.id)}
              className={`btn ${
                selectedGenre === genre.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {showSortOptions && (
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onSortSelect(option.id)}
              className={`btn flex items-center gap-2 ${
                selectedSort === option.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {option.icon}
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};