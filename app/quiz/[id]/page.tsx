'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categories, answerOptions } from '@/lib/questions';
import { QuizSession } from '@/lib/supabase';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isPartnerB, setIsPartnerB] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(true);

  const currentCategory = categories[currentCategoryIndex];
  const partnerName = isPartnerB ? session?.partner_a_name : session?.partner_b_name;
  const yourName = isPartnerB ? session?.partner_b_name : session?.partner_a_name;

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
          setShowShareModal(false); // Partner B doesn't need to see share modal
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

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSaveAndContinue = async () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last category - submit all answers
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#e57373] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading quiz...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Category Header */}
      <section className="bg-gradient-to-b from-[#e57373] to-[#ef5350] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-4xl mb-2 block">{currentCategory.emoji}</span>
          <h1 className="text-2xl font-bold mb-2">{currentCategory.name}</h1>
          <p className="text-white/80">{getCategoryDescription(currentCategory.id)}</p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="bg-[#e57373] py-2">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between text-white text-sm">
            <span>{currentCategoryIndex + 1} of {categories.length} rounds, keep going, it only takes about 10 minutes!</span>
          </div>
          <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${((currentCategoryIndex + 1) / categories.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <main className="flex-1 py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Questions ({currentCategory.questions.length})
            </h2>
            <button
              onClick={() => setShowShareModal(true)}
              className="text-sm text-[#e57373] hover:underline"
            >
              Instructions
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {currentCategory.questions.map((question) => (
              <div
                key={question.id}
                className="card p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <p className="flex-1 text-gray-800">
                  {personalizeQuestion(question.text, partnerName || 'your partner')}
                </p>
                <div className="flex gap-2">
                  {answerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={`emoji-btn ${
                        answers[question.id] === option.value ? 'selected' : ''
                      }`}
                      title={option.label}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-8">
            {currentCategoryIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="w-12 h-12 rounded-lg bg-[#e57373] text-white flex items-center justify-center hover:bg-[#ef5350] transition-colors"
              >
                ◀
              </button>
            )}
            <button
              onClick={handleSaveAndContinue}
              disabled={isSubmitting}
              className="flex-1 btn-primary py-3 text-lg disabled:opacity-50"
            >
              {isSubmitting
                ? 'Submitting...'
                : currentCategoryIndex === categories.length - 1
                ? 'Finish Quiz ➤'
                : 'Save & Continue ▶'}
            </button>
          </div>
        </div>
      </main>

      {/* Share Modal for Partner A */}
      {showShareModal && !isPartnerB && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <div className="text-center mb-6">
              <span className="text-5xl block mb-4">💕</span>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                💌 Share the quiz with {partnerName}
              </h2>
              <p className="text-gray-600 text-sm">
                To get results, both of you need to take the quiz separately, without peeking 😉.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2 mb-4">
              <span className="text-gray-400">🔗</span>
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? `${window.location.origin}/quiz/${id}` : ''}
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
            </div>

            <p className="text-gray-500 text-xs mb-2">
              🔗 Send this link to {partnerName} if they&apos;re on another device.
            </p>
            <p className="text-gray-500 text-xs mb-4">
              📱 On one device? Take turns, {partnerName} can start after you finish.
            </p>
            <p className="text-gray-500 text-xs mb-6">
              ✨ You can skip any question. Only things you both say YES to will appear in results.
            </p>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full btn-primary py-3"
            >
              ➡️ Start My Quiz
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    basics: "Let's Warm Things Up - These are everyday desires. Answer honestly, only mutual YESes will show up later!",
    roleplay: "Adult pretend playtime - I'll play the bass, you'll play the angler.",
    anal: "Questions about butt stuff! We've got your back.",
    positions: "Kama Sutra Anyone? - Doggy style, Reverse Cowgirl, and much more!",
    bdsm: "Bondage, Discipline, Submission and Masochism - What's so sexy about BDSM? Beats me.",
    frequency: "When, Where, and How Often - Where should we meet up? See you at the library ;)",
    toys: "What toys sound interesting? Shopping online together is fun!",
    body: "All the finest details... If you think Chewbacca is hairy just wait till you see my wookie.",
    group: "Sharing is caring! The more the merrier!",
  };
  return descriptions[categoryId] || '';
}

function personalizeQuestion(text: string, partnerName: string): string {
  // Replace generic references with partner's name
  return text
    .replace(/my partner/gi, partnerName)
    .replace(/your partner/gi, partnerName)
    .replace(/partner/gi, partnerName);
}
