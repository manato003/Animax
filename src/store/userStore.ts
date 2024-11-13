import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnimeBasic } from '../types/anime';
import { AnimeRating } from '../types/rating';

interface UserStore {
  watchlist: AnimeBasic[];
  watchedList: AnimeBasic[];
  ratings: AnimeRating[];
  addToWatchlist: (anime: AnimeBasic) => void;
  removeFromWatchlist: (animeId: number) => void;
  isInWatchlist: (animeId: number) => boolean;
  addToWatchedList: (anime: AnimeBasic) => void;
  removeFromWatchedList: (animeId: number) => void;
  isInWatchedList: (animeId: number) => boolean;
  addRating: (rating: AnimeRating) => void;
  getRating: (animeId: number) => AnimeRating | undefined;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      watchlist: [],
      watchedList: [],
      ratings: [],
      addToWatchlist: (anime) => {
        const isAlreadyInWatchlist = get().watchlist.some(
          (item) => item.mal_id === anime.mal_id
        );
        if (!isAlreadyInWatchlist) {
          set((state) => ({
            watchlist: [...state.watchlist, anime],
          }));
        }
      },
      removeFromWatchlist: (animeId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((anime) => anime.mal_id !== animeId),
        }));
      },
      isInWatchlist: (animeId) => {
        return get().watchlist.some((anime) => anime.mal_id === animeId);
      },
      addToWatchedList: (anime) => {
        const isAlreadyWatched = get().watchedList.some(
          (item) => item.mal_id === anime.mal_id
        );
        if (!isAlreadyWatched) {
          set((state) => ({
            watchedList: [...state.watchedList, anime],
            // 視聴済みに追加したらウォッチリストから削除
            watchlist: state.watchlist.filter((item) => item.mal_id !== anime.mal_id),
          }));
        }
      },
      removeFromWatchedList: (animeId) => {
        set((state) => ({
          watchedList: state.watchedList.filter((anime) => anime.mal_id !== animeId),
        }));
      },
      isInWatchedList: (animeId) => {
        return get().watchedList.some((anime) => anime.mal_id === animeId);
      },
      addRating: (rating) => {
        set((state) => ({
          ratings: [
            ...state.ratings.filter((r) => r.animeId !== rating.animeId),
            rating,
          ],
        }));
      },
      getRating: (animeId) => {
        return get().ratings.find((rating) => rating.animeId === animeId);
      },
    }),
    {
      name: 'anime-user-storage',
    }
  )
);