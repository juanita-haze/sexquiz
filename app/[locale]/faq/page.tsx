'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const t = useTranslations('faq');

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
    { q: t('q7'), a: t('a7') },
    { q: t('q8'), a: t('a8') },
    { q: t('q9'), a: t('a9') },
    { q: t('q10'), a: t('a10') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">❓</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0">▶</span>
                </summary>
                <div className="px-4 pb-4 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('stillHaveQuestions')}</h2>
            <p className="text-gray-600 mb-4">{t('hereToHelp')}</p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#8B3A3A] to-[#6B2D2D] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#6B2D2D] hover:to-[#8B3A3A] transition-all"
            >
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
