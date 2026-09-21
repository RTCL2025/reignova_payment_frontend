'use client';

import React, { useState } from 'react';
import { AlertTriangle, ArrowDown, CheckCircle2, XCircle, Clock, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CheckoutStatus } from '@/types/checkout';

export interface LifecycleStep {
  step: number;
  title: string;
  checkoutStatus: CheckoutStatus | 'INITIAL';
  paymentAttemptStatus: string;
  webhookStatus: string;
  reignovaEventsOrderStatus: string;
  description: string;
}

export const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    step: 1,
    title: 'Create Checkout',
    checkoutStatus: 'PENDING',
    paymentAttemptStatus: 'NOT_INITIATED',
    webhookStatus: 'NONE',
    reignovaEventsOrderStatus: 'PENDING_PAYMENT',
    description: 'Merchant backend invokes POST /checkouts/public to generate a hosted session token.',
  },
  {
    step: 2,
    title: 'Customer Redirected',
    checkoutStatus: 'WAITING_PAYMENT',
    paymentAttemptStatus: 'AWAITING_INPUT',
    webhookStatus: 'NONE',
    reignovaEventsOrderStatus: 'PENDING_PAYMENT',
    description: 'Customer opens hosted checkout page /checkout/[token], selects provider (e.g. M-Pesa), and enters phone number.',
  },
  {
    step: 3,
    title: 'Payment Attempt',
    checkoutStatus: 'PROCESSING',
    paymentAttemptStatus: 'SUBMITTED_TO_PAWAPAY',
    webhookStatus: 'PENDING',
    reignovaEventsOrderStatus: 'PENDING_PAYMENT',
    description: 'Payment Service sends deposit request to pawaPay. USSD push prompt is dispatched to customer mobile device.',
  },
  {
    step: 4,
    title: 'Payment Outcome',
    checkoutStatus: 'COMPLETED',
    paymentAttemptStatus: 'DEPOSIT_SUCCESS',
    webhookStatus: 'DISPATCHED',
    reignovaEventsOrderStatus: 'FULFILLED',
    description: 'Customer approves PIN on phone. Payment Service receives instant notification from provider and transitions status.',
  },
  {
    step: 5,
    title: 'Webhook Verification',
    checkoutStatus: 'COMPLETED',
    paymentAttemptStatus: 'DEPOSIT_SUCCESS',
    webhookStatus: 'VERIFIED_BY_MERCHANT',
    reignovaEventsOrderStatus: 'FULFILLED',
    description: 'ReignovaEvents backend verifies HMAC signature on incoming webhook and unlocks VIP ticket access.',
  },
];

export function CheckoutLifecycle() {
  const [activeStepIdx, setActiveStepIdx] = useState(3);

  const activeStep = LIFECYCLE_STEPS[activeStepIdx];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DEPOSIT_SUCCESS':
      case 'VERIFIED_BY_MERCHANT':
      case 'FULFILLED':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold">{status}</Badge>;
      case 'PROCESSING':
      case 'SUBMITTED_TO_PAWAPAY':
      case 'DISPATCHED':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-semibold">{status}</Badge>;
      case 'WAITING_PAYMENT':
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return <Badge className="bg-sky-100 text-sky-800 border-sky-300 font-semibold">{status}</Badge>;
      case 'FAILED':
      case 'EXPIRED':
      case 'CANCELLED':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-semibold">{status}</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-600 border-slate-300">{status}</Badge>;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
            State Machine Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Checkout Session Lifecycle
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Understand how session status, payment attempt status, webhook events, and merchant order states synchronize across the platform.
          </p>
        </div>

        {/* Warning Alert Note */}
        <div className="max-w-4xl mx-auto mb-12 bg-amber-50 border border-amber-300/80 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="size-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">
              Critical Payment Security Rule
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Returning from the hosted checkout does not independently prove that payment succeeded. Always confirm payment through a verified backend status lookup or cryptographically signed webhook callback flow.
            </p>
          </div>
        </div>

        {/* Flow Visualization Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Visual Step Nodes */}
          <div className="lg:col-span-6 space-y-3">
            {LIFECYCLE_STEPS.map((stepItem, idx) => {
              const isActive = idx === activeStepIdx;
              return (
                <div key={stepItem.step} className="relative">
                  <button
                    onClick={() => setActiveStepIdx(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                        isActive ? 'bg-[#F3A221] text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        0{stepItem.step}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                          {stepItem.title}
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">
                          Status: {stepItem.checkoutStatus}
                        </span>
                      </div>
                    </div>
                    {isActive && <ArrowRight className="size-4 text-amber-700" />}
                  </button>

                  {/* Down arrow connector */}
                  {idx < LIFECYCLE_STEPS.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDown className="size-4 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Inspector for Active State */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-md sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">
                Step 0{activeStep.step} State Details
              </span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-mono text-xs">
                {activeStep.title}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeStep.description}
            </p>

            {/* Matrix of status mappings */}
            <div className="space-y-3 font-mono text-xs pt-2">
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Checkout Session Status:</span>
                {getStatusBadge(activeStep.checkoutStatus)}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Payment Attempt (pawaPay):</span>
                {getStatusBadge(activeStep.paymentAttemptStatus)}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Webhook Event Status:</span>
                {getStatusBadge(activeStep.webhookStatus)}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">ReignovaEvents Order Status:</span>
                {getStatusBadge(activeStep.reignovaEventsOrderStatus)}
              </div>

            </div>

            {/* Possible Session Statuses reference */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-2">
                All Valid Checkout Session Statuses
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                {['PENDING', 'WAITING_PAYMENT', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED'].map((st) => (
                  <span
                    key={st}
                    className={`px-2 py-0.5 rounded border ${
                      st === activeStep.checkoutStatus
                        ? 'bg-amber-100 text-amber-800 border-amber-400 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
