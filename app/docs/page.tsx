import React from 'react';
import Link from 'next/link';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { BookOpen, ShieldCheck, CreditCard, ArrowLeftRight, Webhook, Network, AlertCircle, TestTube, Code2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Documentation Overview — Reignova Payment Service',
  description: 'Complete guide to integrating Reignova Payment Service into your applications.',
};

export default function DocsOverviewPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      href: '/docs/getting-started',
      desc: 'Base URLs, environments, credential configuration, and architectural introduction.',
    },
    {
      title: 'API Authentication',
      icon: ShieldCheck,
      href: '/docs/authentication',
      desc: 'Bearer tokens (pk_live_ / pk_test_), SHA-256 peppered security, Admin-Api-Key headers, and scopes.',
    },
    {
      title: 'Hosted Checkouts',
      icon: CreditCard,
      href: '/docs/checkouts',
      desc: 'Server-to-server creation, public tokens, customer UI flow, status polling, and receipts.',
    },
    {
      title: 'Payment Processing',
      icon: ArrowLeftRight,
      href: '/docs/payments',
      desc: 'Direct STK push deposits, disbursements/payouts, refunds, and strict idempotency handling.',
    },
    {
      title: 'Webhooks & HMAC',
      icon: Webhook,
      href: '/docs/webhooks',
      desc: 'Cryptographic HMAC-SHA256 signature verification, raw body handling, and retry schedules.',
    },
    {
      title: 'Mobile Money Providers',
      icon: Network,
      href: '/docs/providers',
      desc: 'Tanzania mobile networks (Vodacom, Airtel, Yas/Tigo, Halotel), TZS formatting, and pawaPay V2.',
    },
    {
      title: 'Errors & Troubleshooting',
      icon: AlertCircle,
      href: '/docs/errors',
      desc: 'Structured JSON error envelope, error codes, provider failure mappings, and state transition rules.',
    },
    {
      title: 'Sandbox Testing',
      icon: TestTube,
      href: '/docs/testing',
      desc: 'Sandbox environment, test phone numbers, end-to-end webhook verification, and local tunneling.',
    },
    {
      title: 'API Reference',
      icon: Code2,
      href: '/docs/api-reference',
      desc: 'Full REST API endpoint contracts for checkouts, direct payments, payouts, refunds, and health.',
    },
  ];

  return (
    <DocsLayout
      breadcrumbs={[{ title: 'Documentation Overview' }]}
      title="Reignova Payment Service Documentation"
      description="Welcome to the developer portal for Reignova Payment Service. Learn how to initiate hosted checkouts, process direct mobile money payments, disburse payouts, issue refunds, and verify cryptographic webhooks."
      toc={[
        { id: 'intro', title: 'System Introduction' },
        { id: 'architecture', title: 'Core Architecture' },
        { id: 'guides', title: 'Documentation Index' },
      ]}
      nextPage={{ title: 'Getting Started', href: '/docs/getting-started' }}
    >
      <section id="intro" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">System Introduction</h2>
        <p className="text-slate-700 leading-relaxed">
          <strong>Reignova Payment Service</strong> is a production-grade, multi-tenant mobile money payment orchestration platform purpose-built for SaaS applications (including <strong>ReignovaEvents</strong>). It integrates directly with <strong>pawaPay V2</strong> to provide robust, zero-lock-in deposit, payout, refund, and hosted checkout orchestration across Tanzanian mobile operators:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono text-xs">
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <span className="font-bold text-red-600 block">Vodacom M-Pesa</span>
            <span className="text-slate-500 text-[11px]">VODACOM_TZA</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <span className="font-bold text-rose-600 block">Airtel Money</span>
            <span className="text-slate-500 text-[11px]">AIRTEL_TZA</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <span className="font-bold text-sky-600 block">Mixx by Yas / Tigo</span>
            <span className="text-slate-500 text-[11px]">YAS_TZA / TIGO_TZA</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm text-center">
            <span className="font-bold text-orange-600 block">Halotel HaloPesa</span>
            <span className="text-slate-500 text-[11px]">HALOTEL_TZA</span>
          </div>
        </div>
      </section>

      <section id="architecture" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Core Architecture & Flow</h2>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs text-slate-200 shadow-sm">
          <div className="text-amber-400 font-bold">// Hosted Checkout Flow</div>
          <div>1. Merchant Application Backend → POST /api/v1/checkouts (Bearer pk_live_... + Idempotency-Key)</div>
          <div>2. Payment Service Response → Returns publicToken, checkoutCode, and redirectUrl</div>
          <div>3. Customer Browser → Navigates to https://pay.reignovatechnologies.com/checkout/[publicToken]</div>
          <div>4. Customer Selects Network & Phone → POST /api/v1/checkouts/public/[publicToken]/pay</div>
          <div>5. Payment Service → Initiates USSD deposit push via pawaPay V2 (Transitions to PROCESSING)</div>
          <div>6. Customer Handset → Approves PIN prompt on mobile money handset</div>
          <div>7. pawaPay → Delivers signed RFC-9421 callback to /api/v1/webhooks/pawapay</div>
          <div>8. Payment Service → Dispatches HMAC-SHA256 webhook (X-Payment-Signature) to Merchant Backend</div>
        </div>
      </section>

      <section id="guides" className="space-y-6 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Documentation Index</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.href}
                href={sec.href}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 w-fit group-hover:bg-amber-100 transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                  <span>Explore guide</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </DocsLayout>
  );
}
