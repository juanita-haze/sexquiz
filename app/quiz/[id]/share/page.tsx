'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuizSession } from '@/lib/supabase';

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
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

  // Check if partner B has completed
  useEffect(() => {
    if (session?.partner_b_answers) {
      router.push(`/results/${id}`);
    }
  }, [session, id, router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStartPartnerB = () => {
    router.push(`/quiz/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#e57373]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  const partnerBName = session?.partner_b_name || 'your partner';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#e57373] to-[#ef5350] text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-6xl mb-4 block">⏳</span>
          <h1 className="text-3xl font-bold mb-4">
            Now it&apos;s {partnerBName}&apos;s turn!
          </h1>
          <p className="text-white/90">
            Great work! Your answers are saved. To unlock your shared results, {partnerBName} just needs to finish their part.
          </p>
        </div>
      </section>

      {/* Share Options */}
      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Share Link */}
          <div className="mb-8">
            <p className="text-gray-600 mb-3">
              💌 Send this link so they can play on another device:
            </p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
                <span className="text-gray-400">✈️</span>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 text-gray-700 bg-transparent outline-none text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-2">Link copied!</p>
            )}
          </div>

          {/* Or Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Hand Over Device */}
          <button
            onClick={handleStartPartnerB}
            className="w-full bg-gradient-to-r from-[#e57373] to-[#ef5350] text-white font-semibold rounded-lg hover:from-[#ef5350] hover:to-[#e53935] transition-all py-4 text-lg"
          >
            ➡️ Hand over this device and start {partnerBName}&apos;s quiz now▶
          </button>

          {/* See Results */}
          <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              See your results
            </h2>
            <p className="text-gray-600">
              👀 When you&apos;ve both finished,{' '}
              <button
                onClick={() => window.location.reload()}
                className="text-[#e57373] hover:underline"
              >
                refresh this page
              </button>{' '}
              to see your results.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
