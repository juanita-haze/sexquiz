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
        <Link href="/" className="text-2xl font-bold text-white tracking-tight">
          🌶️ <span translate="no" className="notranslate">SpicyQuiz</span>
        </Link>

        <nav className="flex items-center gap-4 text-white/90 text-sm">
          <Link href="/feedback" className="hover:text-white hidden sm:block">
            {t('feedback')}
          </Link>
          <Link href="/share" className="hover:text-white hidden sm:block">
            {t('share')}
          </Link>

          {/* Language Selector */}
          <div className="flex items-center gap-1 ml-2">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  locale === loc
                    ? 'bg-white/20 text-white font-medium'
                    : 'hover:bg-white/10 text-white/70'
                }`}
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
