'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const t = useTranslations('contact');
  const common = useTranslations('common');

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h1>
            <p className="text-gray-600">Your message has been sent. We'll get back to you soon.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('intro')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#C76B6B]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('subjectLabel')}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#C76B6B]"
                >
                  <option value="">{t('subjectPlaceholder')}</option>
                  <option value="feedback">{t('subjectFeedback')}</option>
                  <option value="question">{t('subjectQuestion')}</option>
                  <option value="bug">{t('subjectBug')}</option>
                  <option value="suggestion">{t('subjectSuggestion')}</option>
                  <option value="privacy">{t('subjectPrivacy')}</option>
                  <option value="other">{t('subjectOther')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('messageLabel')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder={t('messagePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-[#C76B6B] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#C76B6B] to-[#A85555] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#A85555] hover:to-[#C76B6B] transition-all disabled:opacity-50"
              >
                {isSubmitting ? common('loading') : t('sendButton')}
              </button>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('otherWays')}</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-medium text-gray-800">{t('email')}</p>
                  <p className="text-gray-600 text-sm">contact@spicyquiz.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">⏱️</span>
                <div>
                  <p className="font-medium text-gray-800">{t('responseTime')}</p>
                  <p className="text-gray-600 text-sm">{t('responseTimeValue')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
