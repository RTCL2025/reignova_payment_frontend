'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatPhoneNumber, PROVIDER_MAP } from '@/lib/formatters';
import type { CheckoutSession } from '@/types/checkout';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface CheckoutProcessingProps {
  session: CheckoutSession;
  phone?: string;
  providerId?: string;
  /** True while the page is actively re-checking the payment status. */
  isPolling?: boolean;
  /** True while a manual re-check is in flight. */
  isCheckingNow?: boolean;
  /** Set when polling gave up without a verdict; shown to the payer. */
  stalledMessage?: string | null;
  onCheckNow?: () => void;
  onSimulateSuccess?: () => void;
  onSimulateFailed?: () => void;
}

export function CheckoutProcessing({
  session,
  phone,
  providerId,
  isPolling = true,
  isCheckingNow = false,
  stalledMessage = null,
  onCheckNow,
  onSimulateSuccess,
  onSimulateFailed,
}: CheckoutProcessingProps) {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const targetPhone = phone || session.customer.phone || '';
  const meta = PROVIDER_MAP[providerId || 'VODACOM_TZA'] || {
    shortName: 'Vodacom M-Pesa',
  };

  // Counts up for as long as we are genuinely still waiting. The old version
  // counted a fixed 45 seconds down and then sat on 00:00 regardless of what
  // was happening, which read as "finished" when nothing had finished.
  useEffect(() => {
    if (!isPolling) return;
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isPolling]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-14 text-center px-4 sm:px-8 gap-5 animate-fade-in">
      {/* Animated Phone Icon with Circular Radar Spinner */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="animate-spin w-20 h-20 text-slate-200" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-85 text-brand-gold" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" />
        </svg>
        <Smartphone className="w-8 h-8 text-brand-navy-900 absolute animate-pulse" />
      </div>

      {/* Main Title and Instruction */}
      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          USSD Push Dispatched
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Check your handset screen{' '}
          <strong className="text-slate-900 font-mono font-bold">
            {formatPhoneNumber(targetPhone)}
          </strong>
          . A prompt from{' '}
          <span className="inline-flex items-center gap-1 font-bold text-slate-900 align-baseline">
            {meta.logoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={meta.logoUrl}
                alt={meta.shortName}
                className="w-4 h-4 object-contain inline-block rounded-xs shadow-2xs"
              />
            )}
            <span>{meta.shortName}</span>
          </span>{' '}
          is waiting for your PIN approval.
        </p>
      </div>

      {/* Awaiting Confirmation Box */}
      {isPolling && (
        <div className="w-full max-w-xs bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-200 shadow-2xs">
          <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"
              aria-hidden="true"
            />
            Awaiting confirmation
          </span>
          <span className="font-mono text-brand-gold font-bold text-sm" aria-live="off">
            {mins}:{secs}
          </span>
        </div>
      )}

      {/* Polling gave up without a verdict — never leave the payer on a frozen
          spinner with no way to find out what happened. */}
      {!isPolling && stalledMessage && (
        <div
          role="status"
          className="w-full max-w-md bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col gap-3 text-left"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">{stalledMessage}</p>
          </div>
          {onCheckNow && (
            <Button
              type="button"
              onClick={onCheckNow}
              disabled={isCheckingNow}
              className="h-9 text-xs font-bold rounded-lg bg-brand-gold hover:bg-brand-gold-hover text-brand-navy-900 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${isCheckingNow ? 'animate-spin' : ''}`}
              />
              <span>{isCheckingNow ? 'Checking…' : 'Check payment status'}</span>
            </Button>
          )}
        </div>
      )}

      {/* Troubleshooting Dropdown */}
      <Collapsible
        open={showTroubleshooting}
        onOpenChange={setShowTroubleshooting}
        className="w-full max-w-md text-left pt-2 border-t border-slate-100"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-between w-full text-xs text-slate-500 hover:text-slate-800 py-1"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-brand-gold" />
              Didn&apos;t receive the prompt on your phone?
            </span>
            {showTroubleshooting ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col gap-2">
          <p>
            1. Ensure your phone has active mobile network reception and is unlocked.
          </p>
          <p>
            2. For M-Pesa, dial <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">*150*00#</code> to check pending approvals.
          </p>
          <p>
            3. Make sure your SIM balance has sufficient funds to cover{' '}
            <strong className="text-slate-900">{formatCurrency(session.amount, session.currency)}</strong>.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
