'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categoryData, answerOptionValues, TOTAL_QUESTIONS } from '@/lib/questions';
import { calculateMatches, getTeaserMatches, MatchResult, MatchSummary } from '@/lib/matching';

interface QuizData {
  id: string;
  partner_a_name: string;
  partner_b_name: string;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
  paid: boolean;
}

export default function ResultsPage() {
  const t = useTranslations('results');
  const common = useTranslations('common');
  const cat = useTranslations('categories');
  const q = useTranslations('questionTexts');
  const ans = useTranslations('answerOptions');
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<MatchSummary | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [showAnswers, setShowAnswers] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    fetchQuizData();
    // Check for payment success
    if (searchParams.get('success') === 'true') {
      setIsPaid(true);
    }
  }, [quizId, searchParams]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || t('errorLoading'));
        return;
      }

      if (!data) {
        setError(t('errorLoading'));
        return;
      }

      setQuizData(data);

      if (data.paid) {
        setIsPaid(true);
      }

      // Calculate matches if both partners have completed
      if (data.partner_a_answers && data.partner_b_answers) {
        const matchResults = calculateMatches(data.partner_a_answers, data.partner_b_answers);
        setMatches(matchResults);
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const applyReferralCode = async () => {
    try {
      const response = await fetch(`/api/referral/validate?code=${referralCode}`);
      const data = await response.json();
      if (data.valid) {
        setReferralDiscount(data.discount || 20);
        setReferralStatus('valid');
      } else {
        setReferralStatus('invalid');
      }
    } catch (err) {
      setReferralStatus('invalid');
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          referralCode: referralDiscount > 0 ? referralCode : undefined,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🌶️</div>
            <p className="text-gray-600">{t('loadingResults')}</p>
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('oops')}</h1>
            <p className="text-gray-600">{error || t('notFound')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Waiting for partner B
  if (!quizData.partner_b_answers) {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/quiz/${quizId}` : '';

    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <section className="flex-1 py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {t('waitingTitle')}
              </h1>
              <p className="text-gray-600 mb-6">
                {t('waitingDesc', { partnerA: quizData.partner_a_name, partnerB: quizData.partner_b_name })}
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">{t('shareLinkHint')}</p>
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!matches) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🌶️</div>
            <p className="text-gray-600">{t('loadingResults')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const teaserMatches = getTeaserMatches(matches.allMatches, 5);
  const displayMatches = isPaid ? matches.allMatches : teaserMatches;
  const lockedCount = matches.totalMatches - teaserMatches.length;
  const averageMatches = 15;
  const averageCompatibility = 42;

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

      {/* Success banner */}
      {searchParams.get('success') === 'true' && (
        <div className="bg-green-500 text-white py-3 px-4 text-center">
          🎉 {t('paymentSuccess')}
        </div>
      )}

      {/* Results Header */}
      <section className="bg-gradient-to-b from-[#a83232] to-[#8b2828] text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">💕</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('resultsReady')}</h1>
          <p className="text-white/90">
            {t('resultsIntro', { partnerA: quizData.partner_a_name, partnerB: quizData.partner_b_name })}
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <nav className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-4 text-sm">
          <a href="#compatibility" className="text-[#a83232] hover:underline">{t('compatibilityLink')}</a>
          <a href="#desires" className="text-[#a83232] hover:underline">{t('desiresLink')}</a>
        </div>
      </nav>

      {/* Compatibility Score */}
      <section id="compatibility" className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('compatibilityTitle')}</h2>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-[#a83232]">{matches.totalMatches}</p>
                <p className="text-gray-500 text-sm">{t('matchingDesires', { count: matches.totalMatches })}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-700">{matches.compatibilityScore}%</p>
                <p className="text-gray-500 text-sm">{t('compatibilityLink')}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              {t('compatibilityDesc', {
                partner: quizData.partner_b_name,
                matches: matches.totalMatches,
                comparison: matches.totalMatches >= averageMatches ? t('above') : t('below'),
                average: averageMatches,
              })}
            </p>

            {/* Score bars */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{t('yourMatches')}</span>
                  <span className="font-medium">{matches.totalMatches}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#a83232] to-[#8b2828] h-3 rounded-full"
                    style={{ width: `${Math.min((matches.totalMatches / TOTAL_QUESTIONS) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{t('average')}</span>
                  <span className="font-medium">{averageMatches}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-400 h-3 rounded-full"
                    style={{ width: `${Math.min((averageMatches / TOTAL_QUESTIONS) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Desires */}
      <section id="desires" className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('sharedDesiresTitle')}</h2>
            <p className="text-gray-600 text-sm mb-6">
              {t('sharedDesiresDesc', { count: matches.totalMatches })}
            </p>

            {/* Matches by category */}
            <div className="space-y-4">
              {categoryData.map((category) => {
                const categoryMatches = matches.matchesByCategory[category.id] || [];
                const visibleMatches = isPaid
                  ? categoryMatches
                  : categoryMatches.filter((m) => displayMatches.includes(m));

                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.emoji}</span>
                        <span className="font-medium text-gray-800">{cat(category.id)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {categoryMatches.length} {t('matches')}
                      </span>
                    </div>
                    <div className="p-4">
                      {categoryMatches.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">{t('noMatchesCategory')}</p>
                      ) : (
                        <ul className="space-y-2">
                          {visibleMatches.map((match) => (
                            <li key={match.question.id} className="flex items-start gap-2">
                              <span className={match.strength === 'perfect' ? 'text-yellow-500' : 'text-green-500'}>
                                {match.strength === 'perfect' ? '⭐' : '✓'}
                              </span>
                              <span className="text-gray-700 text-sm">{q(match.question.id)}</span>
                              {match.strength === 'perfect' && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full ml-auto">
                                  {t('perfectMatch')}
                                </span>
                              )}
                            </li>
                          ))}
                          {!isPaid && categoryMatches.length > visibleMatches.length && (
                            <li className="text-gray-400 text-sm italic">
                              + {categoryMatches.length - visibleMatches.length} {t('unlockToSee', { count: categoryMatches.length - visibleMatches.length })}
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment section */}
            {!isPaid && lockedCount > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-[#a83232] to-[#8b2828] rounded-xl text-white">
                <h3 className="text-lg font-bold mb-2">{t('unlockAll', { count: matches.totalMatches })}</h3>
                <p className="text-white/80 text-sm mb-4">{t('stickyUnlock')}</p>

                {/* Referral code */}
                <div className="mb-4">
                  <label className="text-sm text-white/70 block mb-1">{t('referralLabel')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder={t('referralPlaceholder')}
                      className="flex-1 px-3 py-2 rounded-lg text-gray-800 text-sm"
                    />
                    <button
                      onClick={applyReferralCode}
                      className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      {t('apply')}
                    </button>
                  </div>
                  {referralStatus === 'valid' && (
                    <p className="text-green-300 text-sm mt-1">{t('codeApplied', { discount: referralDiscount })}</p>
                  )}
                  {referralStatus === 'invalid' && (
                    <p className="text-red-300 text-sm mt-1">{t('invalidCode')}</p>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-white text-[#a83232] py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  {referralDiscount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">$9.99</span>
                      ${(9.99 * (1 - referralDiscount / 100)).toFixed(2)}
                    </>
                  ) : (
                    '$9.99'
                  )}{' '}
                  - {t('unlockAll', { count: matches.totalMatches })}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Debug: View Answers */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">{t('viewAnswersTitle')}</h2>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="text-[#a83232] text-sm hover:underline"
              >
                {showAnswers ? t('hide') : t('viewAnswers')}
              </button>
            </div>

            {showAnswers && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Question</th>
                      <th className="text-center py-2 px-2">{quizData.partner_a_name}</th>
                      <th className="text-center py-2 px-2">{quizData.partner_b_name}</th>
                      <th className="text-center py-2 px-2">{t('match')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.flatMap((category) =>
                      category.questions.map((question) => {
                        const answerA = quizData.partner_a_answers?.[question.id];
                        const answerB = quizData.partner_b_answers?.[question.id];
                        const isMatch = answerA !== undefined && answerB !== undefined && answerA >= 4 && answerB >= 4;

                        return (
                          <tr key={question.id} className="border-b">
                            <td className="py-2 px-2 text-gray-700">{q(question.id)}</td>
                            <td className="text-center py-2 px-2">
                              {answerA ? answerOptionValues.find((o) => o.value === answerA)?.emoji : '-'}
                            </td>
                            <td className="text-center py-2 px-2">
                              {answerB ? answerOptionValues.find((o) => o.value === answerB)?.emoji : '-'}
                            </td>
                            <td className="text-center py-2 px-2">
                              {isMatch ? '✅' : ''}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Thank you section */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🙏</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('thankYouTitle')}</h2>
            <p className="text-gray-600 text-sm mb-4">{t('thankYouDesc')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                🖨️ {t('printResults')}
              </button>
              <Link
                href="/feedback"
                className="px-4 py-2 bg-[#a83232] text-white rounded-lg text-sm hover:bg-[#8b2828] transition-colors"
              >
                💬 {t('leaveFeedback')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy notice */}
      <section className="py-4 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400 text-xs">
            🔒 {t('privacyDesc')}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
