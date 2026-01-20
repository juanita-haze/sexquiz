'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categoryData, TOTAL_QUESTIONS, QUICK_QUIZ_TOTAL } from '@/lib/questions';

export default function HomePage() {
  const t = useTranslations('home');
  const cat = useTranslations('categories');
  const q = useTranslations('questionTexts');
  const router = useRouter();
  const [yourName, setYourName] = useState('');
  const [theirName, setTheirName] = useState('');
  const [yourAnatomy, setYourAnatomy] = useState<'male' | 'female' | ''>('');
  const [theirAnatomy, setTheirAnatomy] = useState<'male' | 'female' | ''>('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [couplesActive, setCouplesActive] = useState(0);
  const [quizMode, setQuizMode] = useState<'quick' | 'full'>('quick');

  // Simulate active couples counter
  useEffect(() => {
    const baseCount = Math.floor(Math.random() * 50) + 150; // 150-200
    setCouplesActive(baseCount);

    const interval = setInterval(() => {
      setCouplesActive((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(100, Math.min(300, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!yourName.trim() || !theirName.trim()) {
      setError(t('errorBothNames'));
      return;
    }

    if (!yourAnatomy || !theirAnatomy) {
      setError(t('errorBothAnatomy'));
      return;
    }

    if (!isAgeVerified) {
      setError(t('errorAgeVerification'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner_a_name: yourName.trim(),
          partner_b_name: theirName.trim(),
          partner_a_anatomy: yourAnatomy,
          partner_b_anatomy: theirAnatomy,
          quiz_mode: quizMode,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || t('errorCreatingQuiz'));
        return;
      }

      if (data.id) {
        // Store quiz mode in localStorage for the quiz page to read
        localStorage.setItem(`quiz_mode_${data.id}`, quizMode);
        router.push(`/quiz/${data.id}`);
      } else {
        setError(t('errorCreatingQuiz'));
      }
    } catch (err) {
      console.error('Error:', err);
      setError(t('errorCreatingQuiz'));
    } finally {
      setIsLoading(false);
    }
  };

  const questionCount = quizMode === 'quick' ? QUICK_QUIZ_TOTAL : TOTAL_QUESTIONS;
  const timeEstimate = quizMode === 'quick' ? t('timeEstimateQuick') : t('timeEstimate');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      {/* Hero + Form Section - Above the fold */}
      <section className="bg-gradient-to-b from-[#8B3A3A] to-[#6B2D2D] text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Hero content */}
            <div className="text-center lg:text-left">
              <div className="text-5xl mb-4">💕</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-white/90 mb-4">
                {t('heroSubtitle')}
              </p>

              {/* Active couples counter */}
              {couplesActive > 0 && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="text-green-300 text-sm font-medium">
                    🔥 {t('couplesActive', { count: couplesActive })}
                  </p>
                </div>
              )}

              {/* Trust badges - visible on large screens */}
              <div className="hidden lg:flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>🔒</span> {t('privacyTitle')}
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>⏱</span> {t('quickTitle')}
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>👍</span> {t('trustedTitle')}
                </div>
              </div>
            </div>

            {/* Right: Compact Form */}
            <div>
              <form
                onSubmit={handleStartQuiz}
                className="bg-white rounded-xl shadow-2xl p-6"
              >
                {/* Quiz Mode Toggle */}
                <div className="mb-5">
                  <p className="text-sm text-gray-500 mb-2 text-center">{t('quizModeLabel')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuizMode('quick')}
                      className={`py-3 px-4 rounded-lg text-center transition-all ${
                        quizMode === 'quick'
                          ? 'bg-[#8B3A3A] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">⚡</span>
                      <p className="font-semibold">{t('quizModeQuick')}</p>
                      <p className="text-xs opacity-80">{t('quizModeQuickDesc')}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizMode('full')}
                      className={`py-3 px-4 rounded-lg text-center transition-all ${
                        quizMode === 'full'
                          ? 'bg-[#8B3A3A] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">🔥</span>
                      <p className="font-semibold">{t('quizModeFull')}</p>
                      <p className="text-xs opacity-80">{t('quizModeFullDesc')}</p>
                    </button>
                  </div>
                </div>

                {/* Names row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('yourInfo')}</label>
                    <input
                      type="text"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      placeholder={t('yourNamePlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#8B3A3A] text-sm"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('partnerInfo')}</label>
                    <input
                      type="text"
                      value={theirName}
                      onChange={(e) => setTheirName(e.target.value)}
                      placeholder={t('partnerNamePlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#8B3A3A] text-sm"
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Anatomy row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('anatomyLabel')}</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        onClick={() => setYourAnatomy('male')}
                        className={`flex-1 py-2 text-center transition-colors text-xl ${
                          yourAnatomy === 'male'
                            ? 'bg-[#8B3A3A] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        🍆
                      </button>
                      <button
                        type="button"
                        onClick={() => setYourAnatomy('female')}
                        className={`flex-1 py-2 text-center transition-colors border-l border-gray-300 text-xl ${
                          yourAnatomy === 'female'
                            ? 'bg-[#8B3A3A] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        🍑
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('anatomyLabel')}</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        onClick={() => setTheirAnatomy('male')}
                        className={`flex-1 py-2 text-center transition-colors text-xl ${
                          theirAnatomy === 'male'
                            ? 'bg-[#8B3A3A] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        🍆
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheirAnatomy('female')}
                        className={`flex-1 py-2 text-center transition-colors border-l border-gray-300 text-xl ${
                          theirAnatomy === 'female'
                            ? 'bg-[#8B3A3A] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        🍑
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms - simplified */}
                <div className="text-center text-xs text-gray-400 mb-4">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAgeVerified}
                      onChange={(e) => setIsAgeVerified(e.target.checked)}
                      className="w-3 h-3 rounded border-gray-300 accent-[#8B3A3A]"
                    />
                    <span>
                      {t('ageVerification')}{' '}
                      <Link href="/terms" className="text-[#8B3A3A] hover:underline">
                        {t('termsLink')}
                      </Link>{' '}
                      {t('ageRequirement')}
                    </span>
                  </label>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mb-3">{error}</p>
                )}

                {/* Start Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#8B3A3A] to-[#6B2D2D] text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-[#6B2D2D] hover:to-[#8B3A3A] transition-all disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? t('starting') : `💕 ${t('startButton')}`}
                </button>

                <p className="text-center text-gray-400 text-xs mt-3">
                  📋 {t('questionCount', { count: questionCount })} ⏱ {timeEstimate}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Spice It Up Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#8B3A3A] text-sm font-medium mb-2 uppercase tracking-wide">{t('spiceItUp')}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {t('spiceItUpTitle')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                👍 {t('trustedTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {t('trustedDesc')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                ⏱ {t('quickTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {t('quickDesc')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🔒 {t('privacyTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {t('privacyDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#8B3A3A] text-sm font-medium mb-2 uppercase tracking-wide">{t('howItWorks')}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {t('howItWorksTitle')}
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-bold text-[#8B3A3A] text-lg">1.</div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('step1Title')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('step1Desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-[#8B3A3A] text-lg">2.</div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('step2Title')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('step2Desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-[#8B3A3A] text-lg">3.</div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('step3Title')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('step3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#8B3A3A] text-sm font-medium mb-2 uppercase tracking-wide">{t('allQuestions')}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('allQuestionsTitle')}</h2>
          <p className="text-gray-600 mb-8">
            {t('allQuestionsDesc', { categories: categoryData.length, total: TOTAL_QUESTIONS })}
          </p>

          <div className="space-y-3">
            {categoryData.map((category) => (
              <details
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.emoji}</span>
                    <span className="font-semibold text-gray-800">{cat(category.id)}</span>
                    <span className="text-gray-400 text-sm">({category.questions.length})</span>
                  </div>
                  <span className="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50">
                  <ul className="space-y-2">
                    {category.questions.map((question, i) => (
                      <li key={question.id} className="text-gray-600 text-sm">
                        {i + 1}. {q(question.id)}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
