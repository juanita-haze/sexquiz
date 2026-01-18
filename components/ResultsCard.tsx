'use client';

import { MatchResult, getCategoryInfo } from '@/lib/matching';
import { answerOptions } from '@/lib/questions';

interface ResultsCardProps {
  match: MatchResult;
  isLocked?: boolean;
}

export default function ResultsCard({ match, isLocked = false }: ResultsCardProps) {
  const categoryInfo = getCategoryInfo(match.question.category);
  const answerA = answerOptions.find((a) => a.value === match.answerA);
  const answerB = answerOptions.find((a) => a.value === match.answerB);

  if (isLocked) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-2 block">🔒</span>
            <span className="text-white/80 text-sm">Unlock to see</span>
          </div>
        </div>
        <div className="blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{categoryInfo?.emoji}</span>
            <span className="text-white/60 text-sm">{categoryInfo?.name}</span>
          </div>
          <p className="text-white font-medium">Hidden match...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryInfo?.emoji}</span>
          <span className="text-white/60 text-sm">{categoryInfo?.name}</span>
        </div>
        {match.strength === 'perfect' && (
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-black">
            Perfect Match
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-white font-medium mb-4">{match.question.text}</p>

      {/* Both responses */}
      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <span className="text-3xl block mb-1">{answerA?.emoji}</span>
          <span className="text-white/60 text-xs">Partner A</span>
        </div>
        <div className="text-pink-400 text-2xl">❤️</div>
        <div className="text-center">
          <span className="text-3xl block mb-1">{answerB?.emoji}</span>
          <span className="text-white/60 text-xs">Partner B</span>
        </div>
      </div>
    </div>
  );
}
