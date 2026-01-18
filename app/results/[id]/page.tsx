'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { calculateMatches, MatchResult, getCategoryInfo } from '@/lib/matching';
import { categories } from '@/lib/questions';
import { QuizSession } from '@/lib/supabase';

const UNLOCK_PRICE = 4.95;

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const success = searchParams.get('success');

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/quiz?id=${id}`);
        const data = await response.json();

        if (data.error) {
          setError('Results not found');
          return;
        }

        setSession(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error loading results');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [id]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleUnlock = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error creating checkout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#e57373] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
            <p className="text-gray-600">{error || 'Results not found'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if both partners have completed
  if (!session.partner_a_answers || !session.partner_b_answers) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-6xl mb-4 block">⏳</span>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Waiting for your partner
            </h1>
            <p className="text-gray-600 mb-8">
              {session.partner_a_name} has completed the quiz. Waiting for{' '}
              {session.partner_b_name || 'partner'} to finish.
            </p>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-left">
              <p className="text-gray-600 text-sm mb-3">Share this link with your partner:</p>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                <input
                  type="text"
                  value={typeof window !== 'undefined' ? `${window.location.origin}/quiz/${id}` : ''}
                  readOnly
                  className="flex-1 bg-transparent text-gray-700 text-sm outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate matches
  const matchSummary = calculateMatches(session.partner_a_answers, session.partner_b_answers);
  const isPaid = session.paid;

  // Group matches by category
  const matchesByCategory: Record<string, MatchResult[]> = {};
  categories.forEach((cat) => {
    matchesByCategory[cat.id] = matchSummary.allMatches.filter(
      (m) => m.question.category === cat.id
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-8 px-4 border-b">
        <div className="max-w-4xl mx-auto">
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 mb-6 text-center">
              ✓ Payment successful! All matches unlocked.
            </div>
          )}

          <div className="flex items-start gap-2">
            <span className="text-4xl">🎉</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Results Are Ready!</h1>
              <p className="text-gray-600">
                {session.partner_a_name} and {session.partner_b_name}, here&apos;s what your answers reveal…
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm mb-2">On this page:</p>
            <ul className="text-[#e57373] text-sm space-y-1">
              <li><a href="#compatibility" className="hover:underline">Your Compatibility Score</a></li>
              <li><a href="#desires" className="hover:underline">Your Shared Desires</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Results */}
      <main className="flex-1 py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Compatibility Score */}
          <section id="compatibility" className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🏆 Your Compatibility Score
            </h2>

            <p className="text-gray-600 mb-4">
              You and {session.partner_b_name} have{' '}
              <span className="text-[#e57373] font-bold">{matchSummary.totalMatches} matching</span>{' '}
              sexual desires. This is {matchSummary.totalMatches > 60 ? 'above' : 'below'} the average of 60.80.
            </p>

            {/* Match Bar */}
            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>Your Matches</span>
                <span className="font-bold text-[#e57373]">{matchSummary.totalMatches}</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e57373] rounded-full"
                  style={{ width: `${Math.min((matchSummary.totalMatches / 148) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
                <span>60</span>
                <span>70</span>
              </div>
            </div>

            <p className="text-gray-600">
              You and {session.partner_b_name} are{' '}
              <span className="font-bold">{matchSummary.compatibilityScore.toFixed(2)}%</span> sexually compatible.
              The average compatibility score is 79.05%.
            </p>
          </section>

          {/* Shared Desires */}
          <section id="desires" className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              🔥 Your Shared Desires
            </h2>
            <p className="text-gray-600 mb-6">
              You have {matchSummary.totalMatches} shared sexual desires. Your shared desires are listed below.
            </p>

            {/* Unlock Button */}
            {!isPaid && matchSummary.totalMatches > 0 && (
              <button
                onClick={handleUnlock}
                className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-lg mb-6 transition-colors"
              >
                Unlock all {matchSummary.totalMatches} matches - ${UNLOCK_PRICE.toFixed(2)}
              </button>
            )}

            {/* Categories Accordion */}
            <div className="space-y-2">
              {categories.map((category) => {
                const categoryMatches = matchesByCategory[category.id] || [];
                const info = getCategoryInfo(category.id);
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{info?.emoji}</span>
                        <span className="font-medium text-gray-800">{info?.name}</span>
                        <span className="text-gray-400 text-sm">({categoryMatches.length} matches)</span>
                      </div>
                      <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        {categoryMatches.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">No matches in this category</p>
                        ) : isPaid ? (
                          <ul className="space-y-2">
                            {categoryMatches.map((match) => (
                              <li key={match.question.id} className="flex items-center gap-2 text-gray-700">
                                <span className="text-green-500">✓</span>
                                {match.question.text}
                                {match.strength === 'perfect' && (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Perfect Match!</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-4">
                            <span className="text-4xl block mb-2">🔒</span>
                            <p className="text-gray-500 text-sm">
                              Unlock to see {categoryMatches.length} matches
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* No matches message */}
            {matchSummary.totalMatches === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800 text-sm">
                  Don&apos;t feel down, you didn&apos;t get any matches for the kinkier categories, but that&apos;s ok.{' '}
                  <Link href="/" className="text-[#e57373] hover:underline">
                    Take the quiz again
                  </Link>
                  . It&apos;s likely you will get more matches next time.
                </p>
              </div>
            )}

            {/* Unlock Button (bottom) */}
            {!isPaid && matchSummary.totalMatches > 0 && (
              <button
                onClick={handleUnlock}
                className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-lg mt-6 transition-colors"
              >
                Unlock all {matchSummary.totalMatches} matches - ${UNLOCK_PRICE.toFixed(2)}
              </button>
            )}
          </section>

          {/* Thank You Section */}
          <section className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-2">🙏 Thank You!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Thanks for taking ThatSexQuiz. We hope you found something new to try with your partner. If you liked the quiz, please tell your friends about it!
              </p>
              <button className="text-[#e57373] text-sm hover:underline">
                🖨 Print Results
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-2">💬 Feedback</h3>
              <p className="text-gray-600 text-sm mb-4">
                Is there anything you wish we had asked about? Let us know! All feedback is private.
              </p>
              <button className="text-[#e57373] text-sm hover:underline">
                Leave us feedback
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-2">🔒 Privacy</h3>
              <p className="text-gray-600 text-sm">
                For privacy and security reasons we delete all sensitive information after 90 days. If you would like to save your results, use the print button.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Unlock Bar */}
      {!isPaid && matchSummary.totalMatches > 0 && (
        <div className="sticky bottom-0 bg-[#e57373] py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-white">Find something new to try tonight!</span>
            <button
              onClick={handleUnlock}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-lg transition-colors"
            >
              Unlock all {matchSummary.totalMatches} matches - ${UNLOCK_PRICE.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
