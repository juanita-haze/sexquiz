'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="bg-[#a83232] py-8 px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-white/90 mb-2">
          🌶️ {t('tagline')}
        </p>
        <p className="text-white font-medium mb-4">
          🔒 {t('privacyGuaranteed')}
        </p>
        <p className="text-white/80 text-sm mb-6">
          {t('privacyDesc')}
        </p>
        <div className="flex justify-center gap-2 text-2xl mb-4">
          💕💦😘😍🍑👅😏🍆🔥😈🥵👌
        </div>
        <p className="text-3xl font-bold text-white mb-4">🌶️ <span translate="no" className="notranslate">SpicyQuiz</span></p>
        <div className="flex flex-wrap justify-center gap-4 text-white/70 text-xs mb-4">
          <Link href="/" className="hover:text-white">{nav('home')}</Link>
          <Link href="/contact" className="hover:text-white">{nav('contact')}</Link>
          <Link href="/faq" className="hover:text-white">{nav('faq')}</Link>
          <Link href="/questions" className="hover:text-white">{nav('questions')}</Link>
          <Link href="/terms" className="hover:text-white">{nav('terms')}</Link>
          <Link href="/privacy" className="hover:text-white">{nav('privacy')}</Link>
        </div>
        <p className="text-white/60 text-xs">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
