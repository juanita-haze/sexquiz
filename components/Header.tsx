'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#e57373] py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white tracking-tight">
          ThatSexQuiz
        </Link>
        <nav className="flex items-center gap-4 text-white/90 text-sm">
          <Link href="/feedback" className="hover:text-white">Feedback</Link>
          <Link href="/" className="hover:text-white">Share</Link>
        </nav>
      </div>
    </header>
  );
}
