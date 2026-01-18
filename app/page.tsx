'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categories, TOTAL_QUESTIONS } from '@/lib/questions';

type Anatomy = 'male' | 'female';

export default function Home() {
  const router = useRouter();
  const [yourName, setYourName] = useState('');
  const [yourAnatomy, setYourAnatomy] = useState<Anatomy>('female');
  const [theirName, setTheirName] = useState('');
  const [theirAnatomy, setTheirAnatomy] = useState<Anatomy>('male');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!yourName.trim() || !theirName.trim()) {
      setError('Please enter both names');
      return;
    }

    if (!isAgeVerified) {
      setError('You must both be 18 or older to take this quiz');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerAName: yourName.trim(),
          partnerAAnatomy: yourAnatomy,
          partnerBName: theirName.trim(),
          partnerBAnatomy: theirAnatomy,
        }),
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
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#e57373] to-[#ef5350] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Something New to Try Tonight!
          </h1>
          <p className="text-lg text-white/90 mb-2">
            Discover what you and your partner secretly want, only mutual YESes will ever show up 😊
          </p>
          <p className="text-white/80">
            Join the <span className="underline font-medium">THOUSANDS</span> of happy couples who&apos;ve taken the quiz!
          </p>
        </div>
      </section>

      {/* Quiz Form */}
      <section className="py-8 px-4 -mt-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleStartQuiz}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Your Info */}
              <div>
                <h3 className="text-center text-gray-500 text-sm font-medium mb-4">Your Info:</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      👤 Name (or nickname)
                    </label>
                    <input
                      type="text"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#e57373]"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Anatomy 🔒
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        onClick={() => setYourAnatomy('male')}
                        className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors text-xl ${
                          yourAnatomy === 'male'
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🍆
                      </button>
                      <button
                        type="button"
                        onClick={() => setYourAnatomy('female')}
                        className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors text-xl ${
                          yourAnatomy === 'female'
                            ? 'bg-orange-100 text-orange-700 font-medium'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🍑
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Their Info */}
              <div>
                <h3 className="text-center text-gray-500 text-sm font-medium mb-4">Their Info:</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      👤 Name (or nickname)
                    </label>
                    <input
                      type="text"
                      value={theirName}
                      onChange={(e) => setTheirName(e.target.value)}
                      placeholder="Partner's name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#e57373]"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Anatomy 🔒
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        onClick={() => setTheirAnatomy('male')}
                        className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors text-xl ${
                          theirAnatomy === 'male'
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🍆
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheirAnatomy('female')}
                        className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors text-xl ${
                          theirAnatomy === 'female'
                            ? 'bg-orange-100 text-orange-700 font-medium'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        🍑
                      </button>
                    </div>
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
                  className="w-4 h-4 rounded border-gray-300 accent-[#e57373]"
                />
                <span>
                  By starting the quiz you and your partner agree to the{' '}
                  <Link href="/terms" className="text-[#e57373] hover:underline">
                    terms and conditions
                  </Link>{' '}
                  and are both 18 years old or older.
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
              className="w-full mt-6 bg-gradient-to-r from-[#e57373] to-[#ef5350] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-[#ef5350] hover:to-[#e53935] transition-all disabled:opacity-50 shadow-md"
            >
              {isLoading ? 'Starting...' : '💕 Start the Quiz'}
            </button>

            <p className="text-center text-gray-400 text-sm mt-3">
              📋 {TOTAL_QUESTIONS} Questions ⏱ 10 minutes
            </p>
          </form>
        </div>
      </section>

      {/* Spice It Up Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#e57373] text-sm font-medium mb-2 uppercase tracking-wide">Spice it up</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Sex quiz for couples. Find shared sexual desires.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                👍 Trusted by Thousands
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                &quot;ThatSexQuiz has been taken by 12,409 couples in the last month, 3,025 in the last week, and 611 in the last 24 hours.&quot; Info is only used to customize your quiz and create cool statistics.
              </p>
              <Link href="/statistics" className="text-[#e57373] text-sm hover:underline">
                View Statistics »
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                ⏱ Takes Only 10min
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Questions were written by licensed therapists who specialize in relationships and sex. Results for the basic category are free.
              </p>
              <Link href="/questions" className="text-[#e57373] text-sm hover:underline">
                View Questions »
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🔒 Privacy Guaranteed
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                We take your privacy seriously. No sign-up required. All information is anonymous. Your answers are encrypted in transit.
              </p>
              <Link href="/privacy" className="text-[#e57373] text-sm hover:underline">
                Learn More »
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#e57373] text-sm font-medium mb-2 uppercase tracking-wide">How it works</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Take the quiz separately. Explore results together.
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-bold text-[#e57373] text-lg">1.</div>
              <div>
                <h3 className="font-semibold text-gray-800">Start the quiz</h3>
                <p className="text-gray-600 text-sm">
                  Enter some basic information about you and your partner to get started.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-[#e57373] text-lg">2.</div>
              <div>
                <h3 className="font-semibold text-gray-800">Take the quiz separately</h3>
                <p className="text-gray-600 text-sm">
                  You and your partner will take the quiz separately. You&apos;ll each get a quiz link so you can take the quiz on separate devices if you want.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-[#e57373] text-lg">3.</div>
              <div>
                <h3 className="font-semibold text-gray-800">See your matches together</h3>
                <p className="text-gray-600 text-sm">
                  You&apos;ll both see the same results. The results will show your shared sexual desires. The one&apos;s you don&apos;t match on will remain hidden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#e57373] text-sm font-medium mb-2 uppercase tracking-wide">All questions</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Everything You&apos;ll see</h2>
          <p className="text-gray-600 mb-8">
            The list below contains all questions asked in our couples&apos; comparison quiz. There are {categories.length} categories and {TOTAL_QUESTIONS} questions.
          </p>

          <div className="space-y-3">
            {categories.map((category) => (
              <details
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.emoji}</span>
                    <span className="font-semibold text-gray-800">{category.name}</span>
                    <span className="text-gray-400 text-sm">({category.questions.length})</span>
                  </div>
                  <span className="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50">
                  <p className="text-gray-600 text-sm italic">{getCategoryDescription(category.id)}</p>
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

function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    basics: "Let's Warm Things Up - These are everyday desires.",
    roleplay: "Adult pretend playtime - I'll play the bass, you'll play the angler.",
    anal: "Questions about butt stuff! We've got your back.",
    positions: "Kama Sutra Anyone? - Doggy style, Reverse Cowgirl, and much more!",
    bdsm: "Bondage, Discipline, Submission and Masochism - What's so sexy about BDSM? Beats me.",
    frequency: "When, Where, and How Often - Where should we meet up? See you at the library ;)",
    toys: "What toys sound interesting? Shopping online together is fun!",
    body: "All the finest details... If you think Chewbacca is hairy just wait till you see my wookie.",
    group: "Sharing is caring! The more the merrier!",
    bonus: "For the daring couples only... 🔥 Are you brave enough?",
  };
  return descriptions[categoryId] || '';
}
