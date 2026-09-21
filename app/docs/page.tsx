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
      desc: 'Bearer tokens, Admin-Api-Key headers, key rotation, and scope management.',
    },
    {
      title: 'Hosted Checkouts',
      icon: CreditCard,
      href: '/docs/checkouts',
      desc: 'Session creation, public Tokens, redirect URLs, customer payment UI, and expiration.',
    },
    {
      title: 'Payment Processing',
      icon: ArrowLeftRight,
      href: '/docs/payments',
      desc: 'Push payment initiation, deposit IDs, status polling, and idempotency.',
    },
    {
      title: 'Webhooks & HMAC',
      icon: Webhook,
      href: '/docs/webhooks',
      desc: 'Cryptographic signature verification, raw body handling, and duplicate event suppression.',
    },
    {
      title: 'Mobile Money Providers',
      icon: Network,
      href: '/docs/providers',
      desc: 'Supported countries (TZ, KE, UG, GH, ZM), currencies, and pawaPay integration.',
    },
    {
      title: 'Errors & Troubleshooting',
      icon: AlertCircle,
      href: '/docs/errors',
      desc: 'RFC-7807 error responses, provider failure codes, retryable vs terminal errors.',
    },
    {
      title: 'Sandbox Testing',
      icon: TestTube,
      href: '/docs/testing',
      desc: 'Sandbox environment, test phone numbers, simulated approvals, and timeouts.',
    },
    {
      title: 'API Reference',
      icon: Code2,
      href: '/docs/api-reference',
      desc: 'Full REST API endpoint contracts for checkouts, payments, webhooks, and status.',
    },
  ];

  return (
    <DocsLayout
      breadcrumbs={[{ title: 'Documentation Overview' }]}
      title="Reignova Payment Service Documentation"
      description="Welcome to the developer portal for Reignova Payment Service. Learn how to initiate hosted checkouts, process mobile money payments, configure webhooks, and manage API credentials."
      toc={[
        { id: 'intro', title: 'System Introduction' },
        { id: 'architecture', title: 'Core Architecture' },
        { id: 'guides', title: 'Documentation Index' },
      ]}
      nextPage={{ title: 'Getting Started', href: '/docs/getting-started' }}
    >
      <section id="intro" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">System Introduction</h2>
        <p className="text-slate-700">
          <strong>Reignova Payment Service</strong> provides centralized payment orchestration for Reignova applications, including ReignovaEvents. It abstracts direct mobile operator connections by integrating through <strong>pawaPay</strong>, supporting mobile money operators across East and West Africa (M-Pesa, Airtel Money, Tigo Pesa, Halopesa, MTN Mobile Money).
        </p>
      </section>

      <section id="architecture" className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Core Architecture</h2>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs text-slate-200 shadow-sm">
          <div className="text-amber-400 font-bold">// Central Integration Flow</div>
          <div>1. Merchant Application Backend → POST /api/v1/checkouts/public (Generates publicToken)</div>
          <div>2. Customer Browser → Redirected to /checkout/[publicToken]</div>
          <div>3. Customer Selects Provider & Phone → POST /api/v1/checkouts/public/[token]/pay</div>
          <div>4. Payment Service → Dispatches USSD Deposit Push via pawaPay</div>
          <div>5. Payment Service → Dispatches HMAC-Signed Webhook to Merchant Backend</div>
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
