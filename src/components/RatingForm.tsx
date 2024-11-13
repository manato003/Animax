import React, { useState } from 'react';
import { RATING_CRITERIA, getRatingLabel, getRatingColor } from '../types/rating';
import { useUserStore } from '../store/userStore';

interface RatingFormProps {
  animeId: number;
  onSubmit: (ratings: Record<string, number>, comment: string) => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({ animeId, onSubmit }) => {
  const { addRating } = useUserStore();
  const [ratings, setRatings] = useState<Record<string, number>>(() => 
    RATING_CRITERIA.reduce((acc, criteria) => ({
      ...acc,
      [criteria.id]: 5
    }), {})
  );
  const [comment, setComment] = useState('');

  const handleRatingChange = (criteriaId: string, value: string) => {
    setRatings(prev => ({
      ...prev,
      [criteriaId]: parseInt(value)
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(ratings).reduce((a, b) => a + b, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rating = {
      animeId,
      userId: 'user', // TODO: 実際のユーザーID
      ratings,
      comment,
      createdAt: new Date().toISOString(),
    };
    addRating(rating);
    onSubmit(ratings, comment);
  };

  const totalScore = calculateTotalScore();
  const ratingLabel = getRatingLabel(totalScore);
  const ratingColor = getRatingColor(totalScore);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {RATING_CRITERIA.map((criteria) => (
          <div key={criteria.id} className="bg-white/5 px-4 py-3 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{criteria.name}</h4>
                  <p className="text-xs text-gray-400">{criteria.description}</p>
                </div>
                <div className="text-lg font-medium text-purple-400 min-w-[3rem] text-center">
                  {ratings[criteria.id]}点
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">0</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={ratings[criteria.id]}
                  onChange={(e) => handleRatingChange(criteria.id, e.target.value)}
                  className="flex-1 appearance-none bg-purple-900/30 h-1.5 rounded-full outline-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 
                    [&::-webkit-slider-thumb]:hover:bg-purple-400 [&::-webkit-slider-thumb]:transition-colors
                    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 
                    [&::-moz-range-thumb]:hover:bg-purple-400 [&::-moz-range-thumb]:transition-colors
                    [&::-moz-range-thumb]:border-0"
                />
                <span className="text-xs text-gray-400">10</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 p-4 rounded-lg">
        <label className="block mb-2 font-medium">レビューコメント</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-32 bg-black/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="作品の感想を書いてください..."
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-lg">
        <div className="flex flex-col items-center md:items-start">
          <div className={`text-2xl font-bold ${ratingColor}`}>
            {ratingLabel}
          </div>
          <div className="text-xl font-bold text-purple-400">
            {totalScore}点
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full md:w-auto"
          disabled={Object.keys(ratings).length < RATING_CRITERIA.length}
        >
          評価を送信
        </button>
      </div>
    </form>
  );
};