'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categoryData, answerOptionValues, TOTAL_QUESTIONS } from '@/lib/questions';

interface QuizData {
  id: string;
  partner_a_name: string;
  partner_b_name: string;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
}

type Partner = 'A' | 'B';

export default function QuizPage() {
  const t = useTranslations('quiz');
  const cat = useTranslations('categories');
  const q = useTranslations('questionTexts');
  const ans = useTranslations('answerOptions');
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showShareModal, setShowShareModal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const [lastMilestone, setLastMilestone] = useState(0);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  // Calculate global progress
  const globalProgress = useMemo(() => {
    const answered = Object.keys(answers).length;
    const percentage = Math.round((answered / TOTAL_QUESTIONS) * 100);
    return { answered, percentage };
  }, [answers]);

  // Check for milestones
  useEffect(() => {
    const milestones = [25, 50, 75];
    for (const milestone of milestones) {
      if (globalProgress.percentage >= milestone && lastMilestone < milestone) {
        setShowMilestone(milestone);
        setLastMilestone(milestone);
        setTimeout(() => setShowMilestone(null), 3000);
        break;
      }
    }
  }, [globalProgress.percentage, lastMilestone]);

  const fetchQuizData = async () => {
    try {
      console.log('Fetching quiz data for ID:', quizId);
      const response = await fetch(`/api/quiz/${quizId}`);
      
      console.log('Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok || data.error) {
        console.error('Error in response:', data.error || data.details);
        setError(data.error || data.details || t('errorLoading'));
        return;
      }

      if (!data || !data.id) {
        console.error('No valid quiz data returned');
        setError(t('errorLoading'));
        return;
      }

      setQuizData(data);

      // Determine which partner is taking the quiz
      if (!data.partner_a_answers) {
        setCurrentPartner('A');
      } else if (!data.partner_b_answers) {
        setCurrentPartner('B');
      } else {
        // Both have completed, redirect to results
        router.push(`/results/${quizId}`);
        return;
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextCategory = async () => {
    if (currentCategoryIndex < categoryData.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit the quiz
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!currentPartner || !quizData) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner: currentPartner,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || t('errorSubmitting'));
        return;
      }

      // Redirect based on partner
      if (currentPartner === 'A') {
        router.push(`/quiz/${quizId}/share`);
      } else {
        router.push(`/results/${quizId}`);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(t('errorSubmitting'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🌶️</div>
            <p className="text-gray-600">{t('loadingQuiz')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <div className="text-4xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('oops')}</h1>
            <p className="text-gray-600 mb-4">{error || t('notFound')}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
              <p className="text-sm font-semibold text-red-800 mb-2">Detalles del error:</p>
              <p className="text-xs text-red-700 font-mono break-all">
                Quiz ID: {quizId || 'N/A'}<br/>
                Error: {error || 'Desconocido'}<br/>
                URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}
              </p>
            </div>
            <button
              onClick={() => {
                setError('');
                setLoading(true);
                fetchQuizData();
              }}
              className="mt-4 bg-[#a83232] text-white px-6 py-2 rounded-lg hover:bg-[#8b2828] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const partnerName = currentPartner === 'A' ? quizData.partner_a_name : quizData.partner_b_name;
  const otherPartnerName = currentPartner === 'A' ? quizData.partner_b_name : quizData.partner_a_name;
  const currentCategory = categoryData[currentCategoryIndex];
  const totalCategories = categoryData.length;

  // Show share modal for partner A before starting
  if (showShareModal && currentPartner === 'A') {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-5xl mb-4">💕</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {t('shareModalTitle', { partner: otherPartnerName })}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('shareModalDesc')}
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  {t('shareModalLinkHint', { partner: otherPartnerName })}
                </p>
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700"
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {t('shareModalSameDevice', { partner: otherPartnerName })}
              </p>
              <p className="text-xs text-gray-400 mb-6">
                {t('shareModalSkipHint')}
              </p>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gradient-to-r from-[#a83232] to-[#8b2828] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#8b2828] hover:to-[#a83232] transition-all"
              >
                {t('startMyQuiz')}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const answerLabels: Record<number, string> = {
    1: ans('noWay'),
    2: ans('probablyNot'),
    3: ans('maybe'),
    4: ans('sure'),
    5: ans('yes'),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      {/* Milestone celebration popup */}
      {showMilestone && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg">
            🎉 {showMilestone === 25 ? t('milestone25') : showMilestone === 50 ? t('milestone50') : t('milestone75')}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          {/* Global progress */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              {t('progressGlobal', { answered: globalProgress.answered, total: TOTAL_QUESTIONS })}
            </span>
            <span className="text-xs font-bold text-[#a83232]">
              {globalProgress.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${globalProgress.percentage}%` }}
            />
          </div>

          {/* Category progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {t('roundProgress', { current: currentCategoryIndex + 1, total: totalCategories })}
            </span>
            <span className="text-sm font-medium text-[#a83232]">
              {currentCategory.emoji} {cat(currentCategory.id)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#a83232] to-[#8b2828] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCategoryIndex + 1) / totalCategories) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category header */}
      <div className="bg-gradient-to-b from-[#a83232] to-[#8b2828] text-white py-6 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-2">{currentCategory.emoji}</div>
          <h1 className="text-2xl font-bold mb-1">{cat(currentCategory.id)}</h1>
          <p className="text-white/80 text-sm">{cat(`${currentCategory.id}Desc`)}</p>
        </div>
      </div>

      {/* Questions */}
      <section className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentCategory.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <p className="text-gray-800 font-medium mb-4">
                {index + 1}. {q(question.id)}
              </p>
              <div className="flex flex-wrap gap-2">
                {answerOptionValues.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      answers[question.id] === option.value
                        ? 'bg-[#a83232] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span className="hidden sm:inline ml-1">{answerLabels[option.value]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          {/* Navigation button */}
          <button
            onClick={handleNextCategory}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#a83232] to-[#8b2828] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#8b2828] hover:to-[#a83232] transition-all disabled:opacity-50 shadow-md"
          >
            {isSubmitting
              ? t('submitting')
              : currentCategoryIndex < totalCategories - 1
              ? t('saveAndContinue')
              : t('finishQuiz')}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
