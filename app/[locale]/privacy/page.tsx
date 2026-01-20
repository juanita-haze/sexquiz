'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

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
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('overviewTitle')}</h2>
                <p className="text-gray-600">{t('overviewText')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('dataCollectedTitle')}</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>{t('dataCollected1')}</li>
                  <li>{t('dataCollected2')}</li>
                  <li>{t('dataCollected3')}</li>
                  <li>{t('dataCollected4')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('dataUseTitle')}</h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>{t('dataUse1')}</li>
                  <li>{t('dataUse2')}</li>
                  <li>{t('dataUse3')}</li>
                  <li>{t('dataUse4')}</li>
                  <li>{t('dataUse5')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('securityTitle')}</h2>
                <p className="text-gray-600">{t('securityText')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('retentionTitle')}</h2>
                <p className="text-gray-600">{t('retentionText')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('cookiesTitle')}</h2>
                <p className="text-gray-600">{t('cookiesText')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('paymentTitle')}</h2>
                <p className="text-gray-600">{t('paymentText')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('ageTitle')}</h2>
                <p className="text-gray-600">{t('ageText')}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('rightsTitle')}</h2>
                <p className="text-gray-600 mb-2">{t('rightsIntro')}</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>{t('rights1')}</li>
                  <li>{t('rights2')}</li>
                  <li>{t('rights3')}</li>
                  <li>{t('rights4')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('thirdPartyTitle')}</h2>
                <p className="text-gray-600 mb-2">{t('thirdPartyIntro')}</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>{t('thirdParty1')}</li>
                  <li>{t('thirdParty2')}</li>
                  <li>{t('thirdParty3')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('contactTitle')}</h2>
                <p className="text-gray-600">
                  {t('contactText')}{' '}
                  <Link href="/contact" className="text-[#B85555] hover:underline">
                    {t('contactPage')}
                  </Link>{' '}
                  {t('orEmail')} contact@spicyquiz.com.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('changesTitle')}</h2>
                <p className="text-gray-600">{t('changesText')}</p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
