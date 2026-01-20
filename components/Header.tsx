'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, localeFlags, Locale } from '@/i18n/config';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="bg-[#a83232] py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          🌶️ <span translate="no" className="notranslate">SpicyQuiz</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 text-white/90 text-sm">
          <Link href="/feedback" className="hover:text-white hidden sm:block">
            {t('feedback')}
          </Link>
          <Link href="/share" className="hover:text-white hidden sm:block">
            {t('share')}
          </Link>

          {/* Language Selector - Always Visible */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2 border-l border-white/20 pl-2 sm:pl-3">
            <span className="text-xs text-white/70 hidden md:inline">Idioma:</span>
            {locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className={`px-2 sm:px-3 py-1.5 rounded-md text-base sm:text-lg transition-all hover:scale-110 ${
                  locale === loc
                    ? 'bg-white/30 text-white font-semibold shadow-sm ring-2 ring-white/30'
                    : 'hover:bg-white/20 text-white/80'
                }`}
                title={loc === 'en' ? 'English' : 'Español'}
                aria-label={loc === 'en' ? 'Switch to English' : 'Cambiar a Español'}
              >
                {localeFlags[loc as Locale]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
