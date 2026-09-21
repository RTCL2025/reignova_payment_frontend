'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeftRight, Webhook, Network, ShieldCheck, ReceiptText, RefreshCw, Code2, ArrowRight } from 'lucide-react';

export interface CapabilityItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'hosted-checkout',
    icon: CreditCard,
    title: 'Hosted Checkout',
    description: 'Create secure hosted payment experiences that allow customers to complete payments through supported mobile money providers.',
    href: '/docs/checkouts',
    badge: 'Core Feature',
  },
  {
    id: 'payment-processing',
    icon: ArrowLeftRight,
    title: 'Payment Processing',
    description: 'Manage payment initiation, status tracking, deposit reconciliation, and full transaction lifecycle events seamlessly.',
    href: '/docs/payments',
  },
  {
    id: 'webhooks',
    icon: Webhook,
    title: 'Webhooks',
    description: 'Receive and process payment status notifications securely and reliably with cryptographically signed HMAC signatures.',
    href: '/docs/webhooks',
  },
  {
    id: 'provider-integration',
    icon: Network,
    title: 'Provider Integration',
    description: 'Connect directly to mobile money operators across Tanzania, Kenya, Uganda, Ghana, and Zambia via pawaPay orchestration.',
    href: '/docs/providers',
    badge: 'pawaPay Integration',
  },
  {
    id: 'api-authentication',
    icon: ShieldCheck,
    title: 'API Authentication',
    description: 'Use secure Bearer API credentials and scoped headers for authenticated service-to-service communication.',
    href: '/docs/authentication',
  },
  {
    id: 'transaction-management',
    icon: ReceiptText,
    title: 'Transaction Management',
    description: 'Inspect payment attempts, statuses, deposit IDs, audit logs, and reconciliation details in real-time.',
    href: '/docs/api-reference',
  },
  {
    id: 'idempotency',
    icon: RefreshCw,
    title: 'Idempotency',
    description: 'Prevent duplicate payment operations and safely execute network retries using reference keys and transaction locks.',
    href: '/docs/payments',
  },
  {
    id: 'developer-tools',
    icon: Code2,
    title: 'Developer Tools',
    description: 'Access complete REST API specs, SDK snippets, interactive code explorer, and sandbox testing utilities.',
    href: '/docs/testing',
  },
];

export function CapabilityGrid() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
            Platform Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Integrate Payments
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineered for high-volume Reignova services, providing complete control over payment sessions, webhook dispatch, and mobile money orchestration.
          </p>
        </div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Glow accent effect */}
                <div className="absolute top-0 right-0 size-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                <div className="space-y-4">
                  {/* Card Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 group-hover:bg-amber-100/80 transition-colors">
                      <Icon className="size-6" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Docs Link */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    <span>Read documentation</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
