import React from 'react';
import { Settings2, Flag } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export const SettingsPage: React.FC = () => {
  const { showOnlyJapanese, setShowOnlyJapanese } = useSettingsStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold">設定</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">表示設定</h2>
          
          <div>
            <h3 className="font-medium mb-3">コンテンツフィルター</h3>
            <button
              onClick={() => setShowOnlyJapanese(!showOnlyJapanese)}
              className="flex items-center gap-3 cursor-pointer w-full"
            >
              <div
                className={`w-14 h-8 rounded-full p-1 transition-colors ${
                  showOnlyJapanese ? 'bg-purple-600' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    showOnlyJapanese ? 'translate-x-6' : ''
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-purple-400" />
                日本のアニメのみ表示
              </div>
            </button>
            <p className="text-sm text-gray-400 mt-2 ml-[4.5rem]">
              オンにすると、日本で制作されたアニメのみが表示されます
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">このサイトについて</h2>
          <p className="text-gray-400">
            アニメ評価・分析プラットフォームは、アニメファンのための総合的な情報サービスです。
            作品の評価、分析、そして新しい発見をサポートします。
          </p>
        </div>
      </div>
    </div>
  );
};