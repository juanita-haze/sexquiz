'use client';

import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMatches: number;
  freeMatches: number;
  quizId: string;
}

export default function PaywallModal({
  isOpen,
  onClose,
  totalMatches,
  freeMatches,
  quizId,
}: PaywallModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const lockedMatches = totalMatches - freeMatches;

  const handleUnlock = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error creating checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl max-w-md w-full p-8 border border-white/20 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Icon */}
        <div className="text-center mb-6">
          <span className="text-6xl">🔓</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Unlock All Your Matches
        </h2>

        {/* Subtitle */}
        <p className="text-white/70 text-center mb-6">
          You have <span className="text-pink-400 font-bold">{lockedMatches} more matches</span>{' '}
          waiting to be discovered!
        </p>

        {/* Stats */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70">Free matches shown</span>
            <span className="text-white font-medium">{freeMatches}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Locked matches</span>
            <span className="text-pink-400 font-bold">{lockedMatches}</span>
          </div>
        </div>

        {/* Benefits */}
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-white/80">
            <span className="text-green-400">✓</span>
            See all {totalMatches} mutual matches
          </li>
          <li className="flex items-center gap-2 text-white/80">
            <span className="text-green-400">✓</span>
            Organized by category
          </li>
          <li className="flex items-center gap-2 text-white/80">
            <span className="text-green-400">✓</span>
            One-time payment, no subscription
          </li>
          <li className="flex items-center gap-2 text-white/80">
            <span className="text-green-400">✓</span>
            Instant access after payment
          </li>
        </ul>

        {/* Price and CTA */}
        <button
          onClick={handleUnlock}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            <>Unlock All for $9.99</>
          )}
        </button>

        {/* Trust badges */}
        <div className="mt-4 flex items-center justify-center gap-4 text-white/50 text-xs">
          <span>🔒 Secure payment</span>
          <span>💳 Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
