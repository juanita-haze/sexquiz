import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import '../globals.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin always uses English
  setRequestLocale('en');
  const messages = await getMessages({ locale: 'en' });

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider messages={messages} locale="en">
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
