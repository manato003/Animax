import React, { useState, useEffect } from 'react';
import { useAnimeStore } from './store/animeStore';
import { useSettingsStore } from './store/settingsStore';
import { AnimeBasic } from './types/anime';
import { HeroSection } from './components/HeroSection';
import { GenreFilter, SortType } from './components/GenreFilter';
import { AnimeGrid } from './components/AnimeGrid';
import { Footer } from './components/Footer';
import { MyPage } from './pages/MyPage';
import { RankingPage } from './pages/RankingPage';
import { SettingsPage } from './pages/SettingsPage';
import { searchAnime, fetchAnimeByGenre } from './services/animeService';

type Page = 'home' | 'mypage' | 'ranking' | 'settings';

function App() {
  const { setTrendingAnime } = useAnimeStore();
  const { showOnlyJapanese } = useSettingsStore();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortType>('popularity');
  const [filteredAnime, setFilteredAnime] = useState<AnimeBasic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState<Page>('home');

  useEffect(() => {
    const loadAnime = async () => {
      try {
        if (searchQuery) {
          const results = await searchAnime(searchQuery, 1);
          setFilteredAnime(results);
        } else {
          const anime = await fetchAnimeByGenre(selectedGenre, selectedSort, 1);
          setFilteredAnime(anime);
          if (!selectedGenre) {
            setTrendingAnime(anime);
          }
        }
      } catch (error) {
        console.error('アニメの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    setPage(1);
    loadAnime();
  }, [selectedGenre, selectedSort, searchQuery, setTrendingAnime, showOnlyJapanese]);

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
    setSearchQuery('');
  };

  const handleSortSelect = (sort: SortType) => {
    setSelectedSort(sort);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    setPage(1);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;

    try {
      let newAnime;
      if (searchQuery) {
        newAnime = await searchAnime(searchQuery, nextPage);
      } else {
        newAnime = await fetchAnimeByGenre(selectedGenre, selectedSort, nextPage);
      }
      
      setFilteredAnime(prev => [...prev, ...newAnime]);
      setPage(nextPage);
    } catch (error) {
      console.error('追加のアニメの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <nav className="bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="h-8">
              <img 
                src="/animax-logo.svg" 
                alt="ANIMAX" 
                className="h-full w-auto"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))' }}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActivePage('home')}
                className={`btn ${
                  activePage === 'home'
                    ? 'bg-yellow-500 text-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ホーム
              </button>
              <button
                onClick={() => setActivePage('ranking')}
                className={`btn ${
                  activePage === 'ranking'
                    ? 'bg-yellow-500 text-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ランキング
              </button>
              <button
                onClick={() => setActivePage('mypage')}
                className={`btn ${
                  activePage === 'mypage'
                    ? 'bg-yellow-500 text-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                マイページ
              </button>
              <button
                onClick={() => setActivePage('settings')}
                className={`btn ${
                  activePage === 'settings'
                    ? 'bg-yellow-500 text-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                設定
              </button>
            </div>
          </div>
        </div>
      </nav>

      {activePage === 'home' && (
        <>
          <HeroSection onSearch={handleSearch} />
          
          <main className="container mx-auto px-4 py-12">
            <GenreFilter
              selectedGenre={selectedGenre}
              selectedSort={selectedSort}
              onGenreSelect={handleGenreSelect}
              onSortSelect={handleSortSelect}
            />
            <AnimeGrid 
              isLoading={isLoading}
              anime={filteredAnime}
              selectedGenre={selectedGenre}
              onLoadMore={handleLoadMore}
              searchQuery={searchQuery}
            />
          </main>
        </>
      )}

      {activePage === 'mypage' && <MyPage />}
      {activePage === 'ranking' && <RankingPage />}
      {activePage === 'settings' && <SettingsPage />}

      <Footer />
    </div>
  );
}

export default App;