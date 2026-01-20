'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, localeFlags, Locale } from '@/i18n/config';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="bg-[#C76B6B] py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          🌶️ <span translate="no" className="notranslate">SpicyQuiz</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 sm:gap-4 text-white/90 text-sm">
            <Link href="/feedback" className="hover:text-white hidden sm:block">
              {t('feedback')}
            </Link>
            <Link href="/share" className="hover:text-white hidden sm:block">
              {t('share')}
            </Link>
          </nav>

          {/* Language Selector - ALWAYS VISIBLE AND PROMINENT */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-l-2 border-white/30 pl-3 ml-2">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className={`
                  px-2.5 sm:px-3 py-1.5 rounded-md 
                  text-xl sm:text-2xl 
                  transition-all duration-200 
                  hover:scale-125 hover:rotate-3
                  min-w-[44px] min-h-[44px]
                  flex items-center justify-center
                  ${locale === loc
                    ? 'bg-white/40 text-white font-bold shadow-lg ring-2 ring-white/50 scale-110'
                    : 'hover:bg-white/25 text-white/90 opacity-80 hover:opacity-100'
                  }
                `}
                title={loc === 'en' ? 'Switch to English' : 'Cambiar a Español'}
                aria-label={loc === 'en' ? 'Switch to English' : 'Cambiar a Español'}
              >
                <span className="block">{localeFlags[loc as Locale]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
