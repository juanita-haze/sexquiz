'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface QuizSession {
  id: string;
  partner_a_name: string | null;
  partner_b_name: string | null;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
}

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/quiz/${id}`
    : '';

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/quiz?id=${id}`);
        const data = await response.json();
        setSession(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSession();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Take our couples quiz!',
          text: `${session?.partner_a_name} wants you to take this intimate quiz together!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
      </main>
    );
  }

  // Check if partner B has already completed
  if (session?.partner_b_answers) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-3xl font-bold text-white mb-4">
            Your partner completed the quiz!
          </h1>
          <p className="text-white/70 mb-8">
            {session.partner_b_name} has finished. View your results now!
          </p>
          <Link
            href={`/results/${id}`}
            className="inline-block w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            View Results
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success message */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">✅</span>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quiz Complete!
          </h1>
          <p className="text-white/70">
            Now share this link with your partner
          </p>
        </div>

        {/* Share card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <p className="text-white/70 text-sm mb-3">Share this link:</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-white/20 border border-white/20 rounded-xl text-white hover:bg-white/30 transition-all"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>

          {copied && (
            <p className="text-green-400 text-sm mt-2">Link copied!</p>
          )}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold hover:from-pink-600 hover:to-purple-600 transition-all mb-4"
        >
          Share with Partner
        </button>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="font-semibold text-white mb-4">What happens next?</h3>
          <ol className="space-y-3 text-white/70 text-sm">
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">1.</span>
              <span>Your partner takes the quiz using your link</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">2.</span>
              <span>We compare your answers privately</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">3.</span>
              <span>Only mutual matches are revealed</span>
            </li>
            <li className="flex gap-3">
              <span className="text-pink-400 font-bold">4.</span>
              <span>Your secrets stay safe!</span>
            </li>
          </ol>
        </div>

        {/* Check results link */}
        <div className="text-center mt-6">
          <Link
            href={`/results/${id}`}
            className="text-white/60 text-sm hover:text-white/80 underline"
          >
            Check if partner completed →
          </Link>
        </div>
      </div>
    </main>
  );
}
