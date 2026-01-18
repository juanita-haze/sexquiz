'use client';

import { categories } from '@/lib/questions';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  currentCategory: string;
}

export default function ProgressBar({
  currentQuestion,
  totalQuestions,
  currentCategory,
}: ProgressBarProps) {
  const percentage = ((currentQuestion + 1) / totalQuestions) * 100;
  const category = categories.find((c) => c.id === currentCategory);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Category indicator */}
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">{category?.emoji}</span>
        <span className="text-white/80 font-medium">{category?.name}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Question count */}
      <div className="flex justify-between mt-2 text-white/60 text-sm">
        <span>
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
    </div>
  );
}
