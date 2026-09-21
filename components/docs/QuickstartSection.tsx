'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Key, Settings, CreditCard, ExternalLink, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickstartSection() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyCode = (code: string, stepIndex: number) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const envCode = `PAYMENT_SERVICE_BASE_URL=https://pay.reignovatechnologies.com
PAYMENT_SERVICE_API_KEY=sk_live_app_8f3a9921e4b201`;

  const checkoutCode = `// 1. Create a hosted checkout session from backend
const response = await fetch(\`\${process.env.PAYMENT_SERVICE_BASE_URL}/api/v1/checkouts/public\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": \`Bearer \${process.env.PAYMENT_SERVICE_API_KEY}\`,
  },
  body: JSON.stringify({
    amount: 25000,
    currency: "TZS",
    country: "TZA",
    reference: "REIG-EVENT-VIP-001",
    description: "ReignovaEvents VIP Ticket",
    customer: {
      name: "Juma Ally",
      email: "juma@example.com",
      phone: "+255712345678"
    },
    returnUrl: "https://events.reignova.com/checkout/callback"
  }),
});

const { data } = await response.json();
console.log("Hosted Checkout Token:", data.publicToken);`;

  return (
    <section className="py-16 sm:py-24 bg-white relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
            Integration Walkthrough
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            5-Minute Quickstart Guide
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Follow these simple steps to integrate Reignova Payment Service into your application backend.
          </p>
        </div>

        {/* 5 Steps Stack */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Step 1 */}
          <div className="relative pl-10 border-l-2 border-slate-200 pb-8 last:pb-0">
            <div className="absolute -left-4 top-0 size-8 rounded-full bg-[#F3A221] text-slate-950 font-bold font-mono text-xs flex items-center justify-center shadow-md">
              1
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Key className="size-4 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Create API Credentials</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Backend applications require valid Reignova Payment Service API credentials. Log in to the protected Admin Portal to generate your merchant API keys and webhook signing secret.
              </p>
              <div className="pt-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                >
                  <span>Open Admin Portal to generate keys</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-10 border-l-2 border-slate-200 pb-8 last:pb-0">
            <div className="absolute -left-4 top-0 size-8 rounded-full bg-[#F3A221] text-slate-950 font-bold font-mono text-xs flex items-center justify-center shadow-md">
              2
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="size-4 text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900">Configure Environment Variables</h3>
                </div>
                <button
                  onClick={() => copyCode(envCode, 2)}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-mono flex items-center gap-1"
                >
                  {copiedStep === 2 ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  <span>{copiedStep === 2 ? 'Copied' : 'Copy .env'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Store your base URL and secret API key securely in server-side environment variables. Never expose real secrets in client-side code.
              </p>
              <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
                <pre><code>{envCode}</code></pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-10 border-l-2 border-slate-200 pb-8 last:pb-0">
            <div className="absolute -left-4 top-0 size-8 rounded-full bg-[#F3A221] text-slate-950 font-bold font-mono text-xs flex items-center justify-center shadow-md">
              3
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900">Create a Checkout Session</h3>
                </div>
                <button
                  onClick={() => copyCode(checkoutCode, 3)}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-mono flex items-center gap-1"
                >
                  {copiedStep === 3 ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  <span>{copiedStep === 3 ? 'Copied' : 'Copy TS Code'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Issue a POST request to <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">/api/v1/checkouts/public</code> with transaction details.
              </p>
              <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
                <pre><code>{checkoutCode}</code></pre>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative pl-10 border-l-2 border-slate-200 pb-8 last:pb-0">
            <div className="absolute -left-4 top-0 size-8 rounded-full bg-[#F3A221] text-slate-950 font-bold font-mono text-xs flex items-center justify-center shadow-md">
              4
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="size-4 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Redirect the Customer</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Redirect your customer&apos;s browser to the hosted checkout page at <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">/checkout/[publicToken]</code> where they select their mobile money operator (M-Pesa, Airtel Money, Tigo Pesa, Halopesa) and enter their phone number.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative pl-10 border-l-2 border-slate-200">
            <div className="absolute -left-4 top-0 size-8 rounded-full bg-[#F3A221] text-slate-950 font-bold font-mono text-xs flex items-center justify-center shadow-md">
              5
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Confirm Payment via Verified Webhook</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Confirming payment must come from a verified backend callback or trusted status lookup—never rely solely on a frontend browser redirect. Receive the signed <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">checkout.completed</code> webhook to execute order fulfillment safely.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-slate-50 text-slate-800 border-slate-300 hover:border-amber-500 text-xs font-semibold"
                >
                  <Link href="/docs/webhooks">Read Webhooks & Signature Verification Docs</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
