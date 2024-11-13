import { AnimeBasic, AnimeDetailed } from '../types/anime';
import { useSettingsStore } from '../store/settingsStore';

const BASE_URL = 'https://api.jikan.moe/v4';

// 日本の主要アニメスタジオリスト
const JAPANESE_STUDIOS = [
  'Kyoto Animation', 'Studio Ghibli', 'Madhouse', 'Production I.G', 'A-1 Pictures',
  'ufotable', 'MAPPA', 'Shaft', 'Sunrise', 'TRIGGER', 'WIT STUDIO', 'P.A.Works',
  'J.C.Staff', 'Toei Animation', 'OLM', 'GAINAX', 'Kinema Citrus', 'GONZO',
  'GoHands', 'Satellite', 'Sanzigen', 'SILVER LINK.', 'XEBEC', 'Studio GoHands',
  'Studio Comet', 'Studio DEEN', 'ZEXCS', 'Zero-G', 'Tatsunoko Production',
  'Diomedéa', 'DLE', 'david production', 'TMS Entertainment', 'Fanworks', 'feel.',
  'Brains Base', 'project No.9', 'Production IMS', 'WHITE FOX', 'Bones',
  'Polygon Pictures', 'LIDEN FILMS', 'Lerche'
];

const GENRE_MAP: { [key: number]: string } = {
  1: 'アクション',
  2: 'アドベンチャー',
  4: 'コメディ',
  8: 'ドラマ',
  10: 'ファンタジー',
  14: '恋愛',
  18: 'ロボット',
  22: '恋愛',
  23: '学園',
  24: 'SF',
  36: '日常',
  37: '超自然',
  41: '青春',
  62: '異世界',
};

const fetchWithCache = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const isJapaneseAnime = (anime: any): boolean => {
  // 1. 制作会社チェック
  const hasJapaneseStudio = anime.studios?.some((studio: any) => 
    JAPANESE_STUDIOS.includes(studio.name) || 
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(studio.name)
  );
  
  // 2. 国籍チェック
  const isFromJapan = anime.origin_country === 'Japan';
  
  // 3. 制作会社名の日本語チェック
  const hasJapaneseStudioName = anime.studios?.some((studio: any) =>
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(studio.name)
  );

  return hasJapaneseStudio || isFromJapan || hasJapaneseStudioName;
};

export const fetchAnimeByGenre = async (
  genreId: number | null,
  sortType: 'popularity' | 'trending' | 'newest' | null,
  page: number = 1
): Promise<AnimeBasic[]> => {
  const { showOnlyJapanese } = useSettingsStore.getState();
  let url = `${BASE_URL}/anime?page=${page}&limit=24&sfw=true`;
  
  if (genreId) {
    url += `&genres=${genreId}`;
  }

  switch (sortType) {
    case 'trending':
      url += '&status=airing&order_by=score&sort=desc&min_scoring_users=1000';
      break;
    case 'newest':
      url += '&order_by=start_date&sort=desc';
      break;
    case 'popularity':
    default:
      url += '&order_by=members&sort=desc';
  }

  const data = await fetchWithCache(url);
  let animeList = data.data
    .map((anime: any) => ({
      ...formatAnimeData(anime),
      uniqueId: `${anime.mal_id}-${Date.now()}-${Math.random()}`
    }));

  if (showOnlyJapanese) {
    animeList = animeList.filter(anime => isJapaneseAnime(anime));
  }

  return animeList.slice(0, 10);
};

export const searchAnime = async (query: string, page: number = 1): Promise<AnimeBasic[]> => {
  const { showOnlyJapanese } = useSettingsStore.getState();
  const data = await fetchWithCache(
    `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=24&sfw=true`
  );
  
  let animeList = data.data
    .map((anime: any) => ({
      ...formatAnimeData(anime),
      uniqueId: `${anime.mal_id}-${Date.now()}-${Math.random()}`
    }));

  if (showOnlyJapanese) {
    animeList = animeList.filter(anime => isJapaneseAnime(anime));
  }

  return animeList.slice(0, 10);
};

export const fetchAnimeDetails = async (id: number): Promise<AnimeDetailed> => {
  const [animeData, charactersData] = await Promise.all([
    fetchWithCache(`${BASE_URL}/anime/${id}/full`),
    fetchWithCache(`${BASE_URL}/anime/${id}/characters`)
  ]);

  // 日本語の声優のみをフィルタリング
  const voiceActors = charactersData.data
    .filter((char: any) => 
      char.voice_actors?.some((va: any) => va.language === 'Japanese')
    )
    .map((char: any) => {
      const japaneseVA = char.voice_actors.find((va: any) => va.language === 'Japanese');
      return {
        person: {
          ...japaneseVA,
          name: japaneseVA.person.name
        },
        character: char.character
      };
    })
    .slice(0, 6);

  return {
    ...formatAnimeData(animeData.data),
    synopsis: animeData.data.synopsis || '概要は準備中です。',
    rating: animeData.data.rating,
    status: formatStatus(animeData.data.status),
    episodes: animeData.data.episodes || 0,
    duration: animeData.data.duration,
    aired: animeData.data.aired,
    voiceActors,
    uniqueId: `${animeData.data.mal_id}-${Date.now()}-${Math.random()}`
  };
};

const formatAnimeData = (anime: any): AnimeBasic => ({
  mal_id: anime.mal_id,
  title: anime.title_japanese || anime.title,
  images: anime.images,
  score: anime.score || 0,
  genres: anime.genres.map((genre: any) => ({
    mal_id: genre.mal_id,
    name: GENRE_MAP[genre.mal_id] || genre.name
  })),
  year: anime.year || new Date(anime.aired?.from).getFullYear() || null,
  season: formatSeason(anime.season),
  studios: anime.studios,
  uniqueId: `${anime.mal_id}-${Date.now()}-${Math.random()}`
});

const formatSeason = (season: string): string => {
  const seasonMap: { [key: string]: string } = {
    'spring': '春',
    'summer': '夏',
    'fall': '秋',
    'winter': '冬'
  };
  return seasonMap[season] || '';
};

const formatStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'Finished Airing': '放送終了',
    'Currently Airing': '放送中',
    'Not yet aired': '放送予定'
  };
  return statusMap[status] || status;
};