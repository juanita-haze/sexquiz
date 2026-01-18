import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8"
        >
          ← Back to Quiz
        </Link>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>

          <div className="space-y-6 text-white/80">
            <p className="text-sm text-white/60">Last updated: January 2025</p>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
              <p>
                We take your privacy seriously. This couples quiz is designed with privacy as a core
                principle. Only mutual matches (where both partners indicated interest) are ever
                revealed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data We Collect</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Names or nicknames you provide (optional identifiers)</li>
                <li>Quiz answers from both partners</li>
                <li>Payment information (processed securely by Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Data</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To compare answers and find mutual matches</li>
                <li>To process payments for unlocking results</li>
                <li>We do NOT sell or share your data with third parties</li>
                <li>We do NOT use your data for marketing or advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
              <p>
                Your quiz answers are stored securely and encrypted. Individual answers are never
                shown to your partner - only mutual matches are revealed. Non-matches remain
                completely private.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Retention</h2>
              <p>
                Quiz data is automatically deleted after <strong>90 days</strong>. You can also
                request immediate deletion of your data by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
              <p>
                We use minimal cookies required for the quiz to function properly. We do not use
                tracking cookies or third-party analytics that identify individual users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Payment Processing</h2>
              <p>
                Payments are processed securely by Stripe. We never see or store your full credit
                card number. Stripe&apos;s privacy policy applies to payment data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Age Requirement</h2>
              <p>
                This quiz is intended for adults 18 years and older. By using this service, you
                confirm that you are at least 18 years of age.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Your Rights</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Request access to your data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of any future communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>
                For privacy-related questions or data deletion requests, please contact us at{' '}
                <span className="text-pink-400">privacy@couplequiz.com</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on
                this page with an updated revision date.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
          >
            Take the Quiz
          </Link>
        </div>
      </div>
    </main>
  );
}
