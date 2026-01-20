'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SharePage() {
  const t = useTranslations('share');
  const common = useTranslations('common');

  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://spicyquiz.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(t('shareText'));
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${t('shareText')} ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📢</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('shareTitle')}</h1>
            <p className="text-gray-600">{t('shareSubtitle')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Copy link */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('copyLinkTitle')}</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-[#B85555] text-white rounded-lg font-medium hover:bg-[#9A4545] transition-colors"
                >
                  {copied ? common('copied') : common('copy')}
                </button>
              </div>
            </div>

            {/* Social share buttons */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('socialTitle')}</h2>
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <span>📱</span> WhatsApp
                </button>
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-sky-600 transition-colors"
                >
                  <span>🐦</span> Twitter
                </button>
                <button
                  onClick={handleFacebookShare}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <span>📘</span> Facebook
                </button>
              </div>
            </div>

            {/* Why share */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{t('whyShareTitle')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#B85555]">💕</span>
                  <span>{t('whyShare1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B85555]">💬</span>
                  <span>{t('whyShare2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B85555]">🔒</span>
                  <span>{t('whyShare3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B85555]">⏱️</span>
                  <span>{t('whyShare4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
