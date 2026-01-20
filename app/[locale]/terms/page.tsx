'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
            <p className="text-gray-500 text-sm mb-8">{t('lastUpdated')}</p>

            <div className="prose prose-gray max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section1Title')}</h2>
                <p className="text-gray-600">{t('section1Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section2Title')}</h2>
                <p className="text-gray-600">{t('section2Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section3Title')}</h2>
                <p className="text-gray-600">{t('section3Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section4Title')}</h2>
                <p className="text-gray-600">{t('section4Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section5Title')}</h2>
                <p className="text-gray-600 mb-2">{t('section5Text')}</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>{t('section5List1')}</li>
                  <li>{t('section5List2')}</li>
                  <li>{t('section5List3')}</li>
                  <li>{t('section5List4')}</li>
                  <li>{t('section5List5')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section6Title')}</h2>
                <p className="text-gray-600">{t('section6Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section7Title')}</h2>
                <p className="text-gray-600">{t('section7Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section8Title')}</h2>
                <p className="text-gray-600">{t('section8Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section9Title')}</h2>
                <p className="text-gray-600">{t('section9Text')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('section10Title')}</h2>
                <p className="text-gray-600">
                  {t('section10Text')}{' '}
                  <Link href="/contact" className="text-[#a83232] hover:underline">
                    {t('contactPage')}
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
