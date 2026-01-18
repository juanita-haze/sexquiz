'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#e57373] py-8 px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-white/90 mb-2">
          ThatSexQuiz.com - Uncover your shared desires.
        </p>
        <p className="text-white font-medium mb-4">
          🔒 Privacy Guaranteed
        </p>
        <p className="text-white/80 text-sm mb-6">
          We take privacy seriously. Your information is never shared with anyone, ever.
          All communication between your computer and our server is encrypted.
          All sensitive information is permanently deleted after 90 days.
        </p>
        <div className="flex justify-center gap-2 text-2xl mb-4">
          💕💦😘😍🍑👅😏🍆🔥😈🥵👌
        </div>
        <p className="text-3xl font-bold text-white mb-4">ThatSexQuiz</p>
        <div className="flex flex-wrap justify-center gap-4 text-white/70 text-xs mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/questions" className="hover:text-white">Questions</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
        </div>
        <p className="text-white/60 text-xs">
          © 2026 ThatSexQuiz.com
        </p>
      </div>
    </footer>
  );
}
