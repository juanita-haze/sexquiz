'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categoryData, TOTAL_QUESTIONS } from '@/lib/questions';

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
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || t('errorCreatingQuiz'));
        return;
      }

      if (data.id) {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#a83232] to-[#8b2828] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-white/90 mb-2">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Quiz Form Section */}
      <section className="py-8 px-4 -mt-6">
        <div className="max-w-md mx-auto">
          <form
            onSubmit={handleStartQuiz}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {t('formTitle')}
            </h2>

            {/* Your Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3 uppercase tracking-wide">{t('yourInfo')}</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    👤 {t('nameLabel')}
                  </label>
                  <input
                    type="text"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder={t('yourNamePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#a83232]"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {t('anatomyLabel')} 🔒
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                      type="button"
                      onClick={() => setYourAnatomy('male')}
                      className={`flex-1 py-2 text-center transition-colors ${
                        yourAnatomy === 'male'
                          ? 'bg-[#a83232] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🍆
                    </button>
                    <button
                      type="button"
                      onClick={() => setYourAnatomy('female')}
                      className={`flex-1 py-2 text-center transition-colors border-l border-gray-300 ${
                        yourAnatomy === 'female'
                          ? 'bg-[#a83232] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🍑
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3 uppercase tracking-wide">{t('partnerInfo')}</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    👤 {t('nameLabel')}
                  </label>
                  <input
                    type="text"
                    value={theirName}
                    onChange={(e) => setTheirName(e.target.value)}
                    placeholder={t('partnerNamePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#a83232]"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {t('anatomyLabel')} 🔒
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                      type="button"
                      onClick={() => setTheirAnatomy('male')}
                      className={`flex-1 py-2 text-center transition-colors ${
                        theirAnatomy === 'male'
                          ? 'bg-[#a83232] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🍆
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheirAnatomy('female')}
                      className={`flex-1 py-2 text-center transition-colors border-l border-gray-300 ${
                        theirAnatomy === 'female'
                          ? 'bg-[#a83232] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🍑
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgeVerified}
                  onChange={(e) => setIsAgeVerified(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#a83232]"
                />
                <span>
                  {t('ageVerification')}{' '}
                  <Link href="/terms" className="text-[#a83232] hover:underline">
                    {t('termsLink')}
                  </Link>{' '}
                  {t('ageRequirement')}
                </span>
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}

            {/* Start Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-[#a83232] to-[#8b2828] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-[#8b2828] hover:to-[#a83232] transition-all disabled:opacity-50 shadow-md"
            >
              {isLoading ? t('starting') : `💕 ${t('startButton')}`}
            </button>

            <p className="text-center text-gray-400 text-sm mt-3">
              📋 {t('questionCount', { count: TOTAL_QUESTIONS })} ⏱ {t('timeEstimate')}
            </p>
          </form>
        </div>
      </section>

      {/* Spice It Up Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#a83232] text-sm font-medium mb-2 uppercase tracking-wide">{t('spiceItUp')}</p>
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
          <p className="text-[#a83232] text-sm font-medium mb-2 uppercase tracking-wide">{t('howItWorks')}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {t('howItWorksTitle')}
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-bold text-[#a83232] text-lg">1.</div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('step1Title')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('step1Desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-[#a83232] text-lg">2.</div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('step2Title')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('step2Desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-[#a83232] text-lg">3.</div>
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
          <p className="text-[#a83232] text-sm font-medium mb-2 uppercase tracking-wide">{t('allQuestions')}</p>
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
