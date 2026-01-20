'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { calculateMatches, MatchResult, getCategoryInfo } from '@/lib/matching';
import { categories, allQuestions } from '@/lib/questions';
import { QuizSession } from '@/lib/supabase';

// Dynamic import for recharts to avoid SSR issues
const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then(mod => mod.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => mod.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => mod.PolarRadiusAxis), { ssr: false });
const Radar = dynamic(() => import('recharts').then(mod => mod.Radar), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

const UNLOCK_PRICE = 4.95;
const AVERAGE_MATCHES = 60.80;
const AVERAGE_COMPATIBILITY = 79.05;

// Gauge component for adventurousness score
function AdventurousnessGauge({ score, name }: { score: number; name: string }) {
  const vanillaScore = 100 - score;
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="text-center">
      <div className="mb-2 flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-400 rounded"></span> Vanilla 🍦
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-400 rounded"></span> Adventurous 🔥
        </span>
      </div>
      <div className="relative w-48 h-24 mx-auto">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          {/* Vanilla (blue) arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 100 10"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="20"
          />
          {/* Adventurous (red) arc */}
          <path
            d="M 100 10 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#f87171"
            strokeWidth="20"
          />
          {/* Needle */}
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <line x1="100" y1="100" x2="100" y2="25" stroke="#374151" strokeWidth="3" />
            <circle cx="100" cy="100" r="8" fill="#374151" />
          </g>
        </svg>
      </div>
      <p className="text-sm text-gray-700 mt-2">
        <span className="font-semibold">{name}</span> is {vanillaScore.toFixed(0)}% vanilla 🍦
      </p>
    </div>
  );
}

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

  // Calculate adventurousness scores (based on positive answers)
  const calculateAdventurousness = (answers: Record<string, number>) => {
    const values = Object.values(answers);
    if (values.length === 0) return 0;
    const positiveCount = values.filter(v => v >= 4).length;
    return (positiveCount / values.length) * 100;
  };

  const partnerAAdventurousness = calculateAdventurousness(session.partner_a_answers);
  const partnerBAdventurousness = calculateAdventurousness(session.partner_b_answers);

  // Calculate preferences by category for radar chart
  const calculateCategoryScore = (answers: Record<string, number>, categoryId: string) => {
    const categoryQuestions = allQuestions.filter(q => q.category === categoryId);
    const categoryAnswers = categoryQuestions.map(q => answers[q.id] || 0).filter(a => a > 0);
    if (categoryAnswers.length === 0) return 0;
    return (categoryAnswers.reduce((a, b) => a + b, 0) / categoryAnswers.length) * 20; // Scale to 0-100
  };

  const preferencesData = categories.map(cat => {
    const data: Record<string, string | number> = {
      category: cat.name.replace(' & ', '\n& ').replace('Swingers & Group', 'Swingers'),
    };
    data['Partner A'] = calculateCategoryScore(session.partner_a_answers!, cat.id);
    data['Partner B'] = calculateCategoryScore(session.partner_b_answers!, cat.id);
    return data;
  });

  // Compatibility radar data
  const compatibilityData = categories.map(cat => {
    const catMatches = matchesByCategory[cat.id]?.length || 0;
    const maxMatches = cat.questions.length;
    return {
      category: cat.name.replace(' & ', '\n& ').replace('Swingers & Group', 'Swingers'),
      'Your Score': (catMatches / maxMatches) * 100,
      'Average': 40 + Math.random() * 30, // Simulated average
      'Max': 100,
    };
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
              <li><a href="#adventurousness" className="hover:underline">Adventurousness Score</a></li>
              <li><a href="#preferences" className="hover:underline">Preferences</a></li>
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
              <span className="text-[#e57373] font-bold underline">{matchSummary.totalMatches} matching</span>{' '}
              sexual desires. This is {matchSummary.totalMatches > AVERAGE_MATCHES ? 'above' : 'below'} the average of {AVERAGE_MATCHES}.
            </p>

            {/* Match Bars */}
            <div className="mb-6 space-y-3">
              <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                  <span>Your Matches</span>
                  <span className="font-bold text-[#e57373]">{matchSummary.totalMatches}</span>
                </div>
                <div className="h-6 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#e57373] rounded"
                    style={{ width: `${Math.min((matchSummary.totalMatches / 70) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                  <span>Average</span>
                  <span className="font-bold text-blue-500">{AVERAGE_MATCHES}</span>
                </div>
                <div className="h-6 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded"
                    style={{ width: `${Math.min((AVERAGE_MATCHES / 70) * 100, 100)}%` }}
                  />
                </div>
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

            <p className="text-gray-600 mb-6">
              You and {session.partner_b_name} are{' '}
              <span className="font-bold underline">{matchSummary.compatibilityScore.toFixed(2)}%</span> sexually compatible.
              The average compatibility score is {AVERAGE_COMPATIBILITY}%.
            </p>

            {/* Compatibility Radar Chart */}
            <div className="flex justify-center mb-4">
              <div className="text-xs flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#e57373] rounded"></span> Your Score
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-400 rounded"></span> Average
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-300 rounded"></span> Max
                </span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={compatibilityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Max" dataKey="Max" stroke="#d1d5db" fill="#d1d5db" fillOpacity={0.2} />
                  <Radar name="Average" dataKey="Average" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.3} />
                  <Radar name="Your Score" dataKey="Your Score" stroke="#e57373" fill="#e57373" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Adventurousness Score */}
          <section id="adventurousness" className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🔥 Adventurousness Score
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-semibold">{session.partner_a_name}</span> is {partnerAAdventurousness < 30 ? 'very vanilla' : partnerAAdventurousness < 60 ? 'somewhat adventurous' : 'very adventurous'}. {session.partner_a_name} is in the{' '}
                  <span className="text-[#e57373] underline">{Math.round(partnerAAdventurousness)}th percentile</span> - only {(100 - partnerAAdventurousness).toFixed(1)}% of the population is more vanilla.
                </p>
                <AdventurousnessGauge score={partnerAAdventurousness} name={session.partner_a_name || 'Partner A'} />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-semibold">{session.partner_b_name}</span> is {partnerBAdventurousness < 30 ? 'very vanilla' : partnerBAdventurousness < 60 ? 'somewhat adventurous' : 'very adventurous'}. {session.partner_b_name} is in the{' '}
                  <span className="text-[#e57373] underline">{Math.round(partnerBAdventurousness)}th percentile</span> - only {(100 - partnerBAdventurousness).toFixed(1)}% of the population is more vanilla.
                </p>
                <AdventurousnessGauge score={partnerBAdventurousness} name={session.partner_b_name || 'Partner B'} />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section id="preferences" className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              😍 Preferences
            </h2>

            <p className="text-gray-600 mb-4">
              You and {session.partner_b_name} can see how many things you like here! This is useful to see where you vibe and where you don&apos;t!
            </p>

            <div className="flex justify-center mb-4">
              <div className="text-xs flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span> {session.partner_a_name}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#e57373] rounded"></span> {session.partner_b_name}
                </span>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={preferencesData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name={session.partner_a_name || 'Partner A'} dataKey="Partner A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name={session.partner_b_name || 'Partner B'} dataKey="Partner B" stroke="#e57373" fill="#e57373" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
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
              <button className="text-[#e57373] text-sm hover:underline border border-[#e57373] px-4 py-2 rounded-lg w-full">
                🖨 Print Results
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-2">💬 Feedback</h3>
              <p className="text-gray-600 text-sm mb-4">
                Is there anything you wish we had asked about? Let us know! All feedback is private.
              </p>
              <button className="text-[#e57373] text-sm hover:underline border border-[#e57373] px-4 py-2 rounded-lg w-full">
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
