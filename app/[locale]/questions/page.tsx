'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categoryData, TOTAL_QUESTIONS } from '@/lib/questions';

export default function QuestionsPage() {
  const t = useTranslations('questions');
  const cat = useTranslations('categories');
  const q = useTranslations('questionTexts');
  const home = useTranslations('home');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
            <p className="text-gray-600">
              {t('subtitle', { total: TOTAL_QUESTIONS, categories: categoryData.length })}
            </p>
          </div>

          <div className="space-y-4">
            {categoryData.map((category) => (
              <details
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <span className="font-semibold text-gray-800">{cat(category.id)}</span>
                    <span className="text-gray-400 text-sm">
                      ({category.questions.length} {t('questionsCount')})
                    </span>
                  </div>
                  <span className="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-gray-500 text-sm mb-3 pt-3">{cat(`${category.id}Desc`)}</p>
                  <ul className="space-y-2">
                    {category.questions.map((question, i) => (
                      <li key={question.id} className="text-gray-700 text-sm">
                        {i + 1}. {q(question.id)}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">💕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('readyTitle')}</h2>
            <p className="text-gray-600 mb-4">{t('readyDesc')}</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#B85555] to-[#9A4545] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#9A4545] hover:to-[#B85555] transition-all"
            >
              {t('startQuiz')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
