'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '@/components/QuizQuestion';
import ProgressBar from '@/components/ProgressBar';
import { allQuestions, TOTAL_QUESTIONS } from '@/lib/questions';

interface QuizSession {
  id: string;
  partner_a_name: string | null;
  partner_b_name: string | null;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isPartnerB, setIsPartnerB] = useState(false);
  const [partnerBName, setPartnerBName] = useState('');
  const [showNameForm, setShowNameForm] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch quiz session
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/quiz?id=${id}`);
        const data = await response.json();

        if (data.error) {
          setError('Quiz not found');
          return;
        }

        setSession(data);

        // Determine if this is partner A or B
        if (data.partner_a_answers) {
          // Partner A has already completed, this is partner B
          setIsPartnerB(true);
          setShowNameForm(true);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Error loading quiz');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [id]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleAnswer = useCallback((value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 300);
  }, [currentQuestion, currentQuestionIndex]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < TOTAL_QUESTIONS) {
      const unanswered = TOTAL_QUESTIONS - answeredCount;
      setError(`Please answer all questions. ${unanswered} remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: id,
          answers,
          isPartnerB,
          partnerBName: isPartnerB ? partnerBName : undefined,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (isPartnerB) {
        // Both partners completed, go to results
        router.push(`/results/${id}`);
      } else {
        // Partner A completed, show sharing screen
        router.push(`/quiz/${id}/share`);
      }
    } catch (err) {
      console.error('Error submitting:', err);
      setError('Error submitting quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartnerBStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerBName.trim()) {
      setError('Please enter your name');
      return;
    }
    setShowNameForm(false);
    setError('');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading quiz...</p>
        </div>
      </main>
    );
  }

  if (error && !session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-white/70">{error}</p>
        </div>
      </main>
    );
  }

  // Show name form for Partner B
  if (showNameForm && isPartnerB) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">💕</span>
            <h1 className="text-3xl font-bold text-white mb-2">
              {session?.partner_a_name} invited you!
            </h1>
            <p className="text-white/70">
              Take this quiz and discover what you both want.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="text-green-400">✓</span>
              <span>Only mutual matches are shown</span>
            </div>
          </div>

          <form onSubmit={handlePartnerBStart} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-white/80 mb-2 text-sm">
                Your name (or nickname)
              </label>
              <input
                type="text"
                id="name"
                value={partnerBName}
                onChange={(e) => setPartnerBName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40"
                maxLength={50}
              />
            </div>

            {error && (
              <p className="text-red-300 text-sm bg-red-500/20 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all text-lg"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </main>
    );
  }

  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;
  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === TOTAL_QUESTIONS;

  return (
    <main className="min-h-screen flex flex-col p-4 pt-8">
      {/* Progress */}
      <ProgressBar
        currentQuestion={currentQuestionIndex}
        totalQuestions={TOTAL_QUESTIONS}
        currentCategory={currentQuestion.category}
      />

      {/* Question */}
      <div className="flex-1 flex items-center justify-center py-8">
        <QuizQuestion
          question={currentQuestion}
          currentAnswer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-8">
        {error && (
          <p className="text-red-300 text-sm bg-red-500/20 px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
            >
              Next
            </button>
          )}
        </div>

        {/* Skip indicator */}
        <p className="text-center text-white/50 text-sm mt-4">
          {answeredCount} of {TOTAL_QUESTIONS} answered
        </p>
      </div>
    </main>
  );
}
