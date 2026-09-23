'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';
import type { CheckoutSession } from '@/types/checkout';
import { Button } from '@/components/ui/button';

interface CheckoutFailedProps {
  session: CheckoutSession;
  failureReason?: string | null;
  failureCode?: string | null;
  onRetry: () => void;
}

export function CheckoutFailed({
  session,
  failureReason,
  failureCode,
  onRetry,
}: CheckoutFailedProps) {
  const code = failureCode || null;
  const reason =
    failureReason ||
    'The transaction could not be processed. Please verify your payment details or try again.';

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-14 text-center px-4 sm:px-8 gap-5 animate-fade-in">
      {/* Error Badge */}
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
        <AlertTriangle className="w-9 h-9 stroke-[2.2]" />
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Payment Declined
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
          {code ? (
            <>
              The carrier returned error{' '}
              <span className="font-mono text-red-600 font-semibold">{code}</span>. No funds were debited.
            </>
          ) : (
            'The payment request could not be completed. No funds were debited.'
          )}
        </p>
      </div>

      {/* Failure Reason Message */}
      <div className="w-full max-w-sm bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
        {reason}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-2.5 pt-1 w-full max-w-sm">
        <button
          type="button"
          onClick={onRetry}
          className="w-full h-11 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy-900 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Another Number</span>
        </button>

        <div className="flex items-center gap-2 w-full">
          {session.merchant.cancelUrl || session.merchant.returnUrl ? (
            <a
              href={session.merchant.cancelUrl || session.merchant.returnUrl || '#'}
              className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Return to {session.merchant.name}
            </a>
          ) : null}

          <a
            href="mailto:support@reignovatechnologies.com"
            className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
