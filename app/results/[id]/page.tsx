'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ResultsCard from '@/components/ResultsCard';
import PaywallModal from '@/components/PaywallModal';
import { calculateMatches, getTeaserMatches, getCategoryInfo, MatchResult } from '@/lib/matching';
import { categories } from '@/lib/questions';

interface QuizSession {
  id: string;
  partner_a_name: string | null;
  partner_b_name: string | null;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
  paid: boolean;
}

const FREE_MATCHES_COUNT = 5;

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState('');

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

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading results...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-white/70">{error || 'Results not found'}</p>
        </div>
      </main>
    );
  }

  // Check if both partners have completed
  if (!session.partner_a_answers || !session.partner_b_answers) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <span className="text-6xl mb-4 block">⏳</span>
          <h1 className="text-3xl font-bold text-white mb-4">
            Waiting for your partner
          </h1>
          <p className="text-white/70 mb-8">
            {session.partner_a_name} has completed the quiz. Waiting for{' '}
            {session.partner_b_name || 'partner'} to finish.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-white/70 text-sm mb-3">Share this link with your partner:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={typeof window !== 'undefined' ? `${window.location.origin}/quiz/${id}` : ''}
                readOnly
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`);
                }}
                className="px-4 py-3 bg-white/20 border border-white/20 rounded-xl text-white hover:bg-white/30 transition-all"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Calculate matches
  const matchSummary = calculateMatches(session.partner_a_answers, session.partner_b_answers);
  const isPaid = session.paid;
  const teaserMatches = getTeaserMatches(matchSummary.allMatches, FREE_MATCHES_COUNT);

  // Group matches by category for paid view
  const matchesByCategory: Record<string, MatchResult[]> = {};
  if (isPaid) {
    matchSummary.allMatches.forEach((match) => {
      if (!matchesByCategory[match.question.category]) {
        matchesByCategory[match.question.category] = [];
      }
      matchesByCategory[match.question.category].push(match);
    });
  }

  return (
    <main className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 text-center">
            <span className="text-green-400">✓</span> Payment successful! All matches unlocked.
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">💕</span>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Results
          </h1>
          <p className="text-white/70">
            {session.partner_a_name} & {session.partner_b_name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold text-white">{matchSummary.totalMatches}</p>
            <p className="text-white/60 text-sm">Total Matches</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold text-yellow-400">{matchSummary.perfectMatches}</p>
            <p className="text-white/60 text-sm">Perfect Matches</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <p className="text-3xl font-bold text-pink-400">{matchSummary.compatibilityScore}%</p>
            <p className="text-white/60 text-sm">Compatibility</p>
          </div>
        </div>

        {/* Trust message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <p className="text-white/80 text-sm">
              Only showing things you <strong>both</strong> said yes to. Your secrets are safe!
            </p>
          </div>
        </div>

        {/* Matches */}
        {isPaid ? (
          // Paid view - show all matches by category
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryMatches = matchesByCategory[category.id] || [];
              if (categoryMatches.length === 0) return null;

              const info = getCategoryInfo(category.id);

              return (
                <div key={category.id}>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>{info?.emoji}</span>
                    <span>{info?.name}</span>
                    <span className="text-white/50 text-sm font-normal">
                      ({categoryMatches.length})
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {categoryMatches.map((match) => (
                      <ResultsCard key={match.question.id} match={match} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Free view - show teaser matches + locked
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Free Preview ({teaserMatches.length} of {matchSummary.totalMatches} matches)
            </h2>

            {teaserMatches.map((match) => (
              <ResultsCard key={match.question.id} match={match} />
            ))}

            {matchSummary.totalMatches > FREE_MATCHES_COUNT && (
              <>
                {/* Locked cards preview */}
                <ResultsCard
                  match={matchSummary.allMatches[FREE_MATCHES_COUNT] || matchSummary.allMatches[0]}
                  isLocked={true}
                />
                <ResultsCard
                  match={
                    matchSummary.allMatches[FREE_MATCHES_COUNT + 1] || matchSummary.allMatches[0]
                  }
                  isLocked={true}
                />

                {/* Unlock button */}
                <button
                  onClick={() => setShowPaywall(true)}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold hover:from-pink-600 hover:to-purple-600 transition-all mt-6"
                >
                  Unlock All {matchSummary.totalMatches} Matches - $9.99
                </button>
              </>
            )}
          </div>
        )}

        {/* No matches message */}
        {matchSummary.totalMatches === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🤔</span>
            <h2 className="text-xl font-bold text-white mb-2">No Mutual Matches Found</h2>
            <p className="text-white/70">
              You and your partner didn&apos;t both say yes to the same things. Try talking about
              what you&apos;re each interested in!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-white/60 hover:text-white/80 underline text-sm">
            Take another quiz
          </Link>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        totalMatches={matchSummary.totalMatches}
        freeMatches={Math.min(FREE_MATCHES_COUNT, matchSummary.totalMatches)}
        quizId={id}
      />
    </main>
  );
}
