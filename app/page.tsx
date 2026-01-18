'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TOTAL_QUESTIONS, categories } from '@/lib/questions';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!isAgeVerified) {
      setError('You must be 18 or older to take this quiz');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.id) {
        router.push(`/quiz/${data.id}`);
      } else {
        setError('Error creating quiz. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error creating quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Couple Quiz
          </h1>
          <p className="text-xl text-white/80">
            Discover what you both want
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white">Private & Secure</h3>
                <p className="text-white/70 text-sm">
                  Only mutual matches are revealed. Your secrets stay safe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💕</span>
              <div>
                <h3 className="font-semibold text-white">{TOTAL_QUESTIONS} Questions</h3>
                <p className="text-white/70 text-sm">
                  Across {categories.length} categories including intimacy, role play, and more.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold text-white">No Judgment</h3>
                <p className="text-white/70 text-sm">
                  If you both said yes, it&apos;s a match. If not, no one ever knows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Form */}
        <form onSubmit={handleStartQuiz} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-white/80 mb-2 text-sm">
              Your name (or nickname)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/50 focus:border-transparent"
              maxLength={50}
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="age"
              checked={isAgeVerified}
              onChange={(e) => setIsAgeVerified(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500"
            />
            <label htmlFor="age" className="text-white/80 text-sm">
              I confirm that I am 18 years or older and consent to viewing adult content.
            </label>
          </div>

          {error && (
            <p className="text-red-300 text-sm bg-red-500/20 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting...
              </span>
            ) : (
              'Start Quiz'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-white/50 text-sm">
          <p className="mb-2">Data deleted after 90 days</p>
          <Link href="/privacy" className="underline hover:text-white/70">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
