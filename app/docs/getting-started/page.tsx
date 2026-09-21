import React from 'react';
import Link from 'next/link';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { Shield, Key, Terminal, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Getting Started — Reignova Payment Service',
  description: 'Learn how to set up environments, obtain API credentials, and integrate Reignova Payment Service.',
};

export default function GettingStartedPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Getting Started', href: '/docs/getting-started' },
        { title: 'Overview & Setup' },
      ]}
      title="Getting Started with Reignova Payment Service"
      description="Quickly set up your integration environment, configure base URLs, manage API credentials, and create your first hosted checkout session."
      toc={[
        { id: 'environments', title: 'Service Environments' },
        { id: 'credentials', title: 'API Credentials' },
        { id: 'first-checkout', title: 'First Checkout Request' },
      ]}
      prevPage={{ title: 'Docs Overview', href: '/docs' }}
      nextPage={{ title: 'API Authentication', href: '/docs/authentication' }}
    >
      <section id="environments" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Service Environments</h2>
        <p className="text-slate-700">
          Reignova Payment Service maintains two isolated operational environments:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Sandbox Environment</h3>
            </div>
            <code className="text-xs font-mono text-amber-800 block bg-amber-50 p-2 rounded border border-amber-200">
              https://sandbox-pay.reignovatechnologies.com/api/v1
            </code>
            <p className="text-xs text-slate-600">
              Use for development, integration testing, and simulated mobile operator responses without charging actual money.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-slate-900 text-sm">Production Environment</h3>
            </div>
            <code className="text-xs font-mono text-emerald-800 block bg-emerald-50 p-2 rounded border border-emerald-200">
              https://pay.reignovatechnologies.com/api/v1
            </code>
            <p className="text-xs text-slate-600">
              Live processing environment. Connects directly to real mobile money networks (M-Pesa, Airtel Money, Tigo Pesa).
            </p>
          </div>
        </div>
      </section>

      <section id="credentials" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Obtaining API Credentials</h2>
        <p className="text-slate-700">
          All service-to-service requests require valid merchant API keys. Access the protected Admin Portal to generate keys:
        </p>
        <div className="p-5 rounded-xl bg-white border border-amber-300 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Generate Merchant API Keys</h4>
            <p className="text-xs text-slate-600">
              Requires administrative access to Reignova Payment Service Admin Portal (<code className="text-amber-800 font-mono">/admin</code>).
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Shield className="size-3.5" />
            <span>Open Admin Portal</span>
          </Link>
        </div>
      </section>

      <section id="first-checkout" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Creating Your First Checkout</h2>
        <p className="text-slate-700">
          Execute a POST request to <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">/checkouts/public</code>:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`curl -X POST https://pay.reignovatechnologies.com/api/v1/checkouts/public \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "TZS",
    "country": "TZA",
    "reference": "EVT-2026-9921",
    "description": "ReignovaEvents Standard Pass"
  }'`}</code></pre>
        </div>
      </section>
    </DocsLayout>
  );
}
