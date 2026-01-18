'use client';

import { Question, answerOptions } from '@/lib/questions';

interface QuizQuestionProps {
  question: Question;
  currentAnswer: number | undefined;
  onAnswer: (value: number) => void;
}

export default function QuizQuestion({ question, currentAnswer, onAnswer }: QuizQuestionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h2 className="text-xl md:text-2xl font-medium text-white text-center mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="flex justify-center gap-2 md:gap-4">
        {answerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value)}
            className={`
              flex flex-col items-center justify-center
              w-14 h-14 md:w-20 md:h-20
              rounded-xl md:rounded-2xl
              transition-all duration-200
              ${
                currentAnswer === option.value
                  ? 'bg-white/30 scale-110 ring-2 ring-white'
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105'
              }
            `}
            aria-label={option.label}
          >
            <span className="text-2xl md:text-4xl">{option.emoji}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-4 px-2 md:px-8 text-white/60 text-xs md:text-sm">
        <span>No way</span>
        <span>Yes!</span>
      </div>
    </div>
  );
}
