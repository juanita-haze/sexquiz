'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FeedbackPage() {
  const t = useTranslations('feedback');
  const common = useTranslations('common');

  const [rating, setRating] = useState<number | null>(null);
  const [liked, setLiked] = useState('');
  const [improve, setImprove] = useState('');
  const [missing, setMissing] = useState('');
  const [recommend, setRecommend] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const ratingEmojis = ['😠', '😕', '😐', '😊', '😍'];
  const ratingMessages: Record<number, string> = {
    1: t('rating1'),
    2: t('rating2'),
    3: t('rating3'),
    4: t('rating4'),
    5: t('rating5'),
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">🙏</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('thankYouTitle')}</h1>
            <p className="text-gray-600 mb-6">{t('thankYouDesc')}</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#a83232] to-[#8b2828] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#8b2828] hover:to-[#a83232] transition-all"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">💬</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('ratingLabel')}
                </label>
                <div className="flex justify-center gap-2">
                  {ratingEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index + 1)}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        rating === index + 1
                          ? 'bg-[#a83232] scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {rating && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {ratingMessages[rating]}
                  </p>
                )}
              </div>

              {/* What did you like */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('likedLabel')}
                </label>
                <textarea
                  value={liked}
                  onChange={(e) => setLiked(e.target.value)}
                  rows={3}
                  placeholder={t('likedPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#a83232] resize-none"
                />
              </div>

              {/* What could be improved */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('improveLabel')}
                </label>
                <textarea
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                  rows={3}
                  placeholder={t('improvePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#a83232] resize-none"
                />
              </div>

              {/* Missing questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('missingLabel')}
                </label>
                <textarea
                  value={missing}
                  onChange={(e) => setMissing(e.target.value)}
                  rows={3}
                  placeholder={t('missingPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#a83232] resize-none"
                />
              </div>

              {/* Would recommend */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('recommendLabel')}
                </label>
                <div className="flex gap-2">
                  {['yes', 'maybe', 'no'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRecommend(option)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        recommend === option
                          ? 'bg-[#a83232] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option === 'yes' && t('recommendYes')}
                      {option === 'maybe' && t('recommendMaybe')}
                      {option === 'no' && t('recommendNo')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#a83232]"
                />
                <p className="text-xs text-gray-500 mt-1">{t('emailHint')}</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !rating}
                className="w-full bg-gradient-to-r from-[#a83232] to-[#8b2828] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#8b2828] hover:to-[#a83232] transition-all disabled:opacity-50"
              >
                {isSubmitting ? common('loading') : t('submitButton')}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
