'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface QuizData {
  id: string;
  partner_a_name: string;
  partner_b_name: string;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
}

export default function SharePage() {
  const t = useTranslations('share');
  const common = useTranslations('common');
  const params = useParams();
  const quizId = params.id as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('Error fetching quiz:', data.error || 'Quiz not found');
        return;
      }

      setQuizData(data);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const quizUrl = typeof window !== 'undefined' ? `${window.location.origin}/quiz/${quizId}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`${t('whatsAppMessage')} ${quizUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🌶️</div>
            <p className="text-gray-600">{common('loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const partnerBName = quizData?.partner_b_name || 'Your partner';

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="flex-1 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {t('completed')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('partnerTurn', { partner: partnerBName })}
            </p>

            {/* Quiz link */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">
                {t('linkFor', { partner: partnerBName })}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={quizUrl}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-[#B85555] text-white rounded-lg text-sm font-medium hover:bg-[#9A4545] transition-colors"
                >
                  {copied ? common('copied') : common('copy')}
                </button>
              </div>
            </div>

            {/* Share buttons */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <span>📱</span> {t('shareWhatsApp')}
              </button>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <span>📋</span> {t('copyLink')}
              </button>
            </div>

            {/* Tip */}
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <span className="font-medium">{t('tip')}</span> {t('tipText', { partner: partnerBName })}
              </p>
            </div>

            {/* View results link */}
            <Link
              href={`/results/${quizId}`}
              className="inline-block mt-6 text-[#B85555] hover:underline text-sm"
            >
              {t('viewResults')} →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
