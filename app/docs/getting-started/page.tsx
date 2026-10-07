import React from 'react';
import Link from 'next/link';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { Shield, Key, Terminal, ArrowRight, CheckCircle2, Server, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Getting Started — Reignova Payment Service',
  description: 'Learn how to set up environments, obtain API credentials, and create checkout sessions.',
};

export default function GettingStartedPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Getting Started', href: '/docs/getting-started' },
        { title: 'Overview & Setup' },
      ]}
      title="Getting Started with Reignova Payment Service"
      description="Quickly set up your integration environment, configure base URLs, manage API credentials, and initiate your first checkout session."
      toc={[
        { id: 'environments', title: 'Service Environments' },
        { id: 'credentials', title: 'API Credentials & Webhook Secrets' },
        { id: 'first-checkout', title: 'First Checkout Request' },
        { id: 'next-steps', title: 'Next Steps' },
      ]}
      prevPage={{ title: 'Docs Overview', href: '/docs' }}
      nextPage={{ title: 'API Authentication', href: '/docs/authentication' }}
    >
      <section id="environments" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Service Environments</h2>
        <p className="text-slate-700 leading-relaxed">
          Reignova Payment Service exposes standard RESTful endpoints over HTTPS. Choose the appropriate base URL for your development lifecycle:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Local Development Server</h3>
            </div>
            <code className="text-xs font-mono text-amber-800 block bg-amber-50 p-2 rounded border border-amber-200">
              http://localhost:5000/api/v1
            </code>
            <p className="text-xs text-slate-600">
              Run locally alongside the Express backend service with local Supabase PostgreSQL connection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-slate-900 text-sm">Production API Gateway</h3>
            </div>
            <code className="text-xs font-mono text-emerald-800 block bg-emerald-50 p-2 rounded border border-emerald-200">
              https://pay-api.reignovatechnologies.com/api/v1
            </code>
            <p className="text-xs text-slate-600">
              High-availability live processing environment connected directly to pawaPay production infrastructure.
            </p>
          </div>
        </div>
      </section>

      <section id="credentials" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Obtaining API Credentials</h2>
        <p className="text-slate-700 leading-relaxed">
          Each SaaS client application is isolated with a dedicated tenant record, client API key, and webhook signing secret.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 font-sans">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-700">
              <Key className="size-4" />
              <span>Client API Key (pk_live_ / pk_test_)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Passed via <code className="font-mono text-amber-800">Authorization: Bearer &lt;key&gt;</code> for private server-to-server endpoints (Checkouts, Direct Payments, Payouts, Refunds).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 font-sans">
            <div className="flex items-center gap-2 font-mono font-bold text-emerald-700">
              <Shield className="size-4" />
              <span>Webhook Secret (whsec_...)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Shared secret used to verify incoming HMAC-SHA256 signatures dispatched by Payment Service on <code className="font-mono text-emerald-800">X-Payment-Signature</code>.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Provision Client Credentials</h4>
            <p className="text-xs text-slate-600">
              Generate keys securely inside the Reignova Payment Service Admin Portal (<code className="text-amber-800 font-mono">/admin</code>).
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <Shield className="size-3.5" />
            <span>Open Admin Portal</span>
          </Link>
        </div>
      </section>

      <section id="first-checkout" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Creating Your First Checkout Session</h2>
        <p className="text-slate-700 leading-relaxed">
          From your backend server, make an authenticated POST request to <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">/api/v1/checkouts</code>:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`curl -X POST https://pay-api.reignovatechnologies.com/api/v1/checkouts \\
  -H "Authorization: Bearer pk_live_YOUR_API_KEY" \\
  -H "Idempotency-Key: evt-order-9921" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reference": "EVT-2026-9921",
    "amount": 25000,
    "currency": "TZS",
    "country": "TZ",
    "description": "ReignovaEvents Standard Pass",
    "returnUrl": "https://events.reignovatechnologies.com/checkout/success",
    "customer": {
      "name": "Amina Said",
      "email": "amina@example.com",
      "phone": "+255754123456"
    }
  }'`}</code></pre>
        </div>

        <p className="text-slate-700 text-sm leading-relaxed">
          The response returns a unique session record and <code className="text-amber-800 font-mono">publicToken</code>:
        </p>

        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
          <pre><code>{`{
  "success": true,
  "data": {
    "id": "c9a4192b-8a88-4fb3-a982-12711684c1f9",
    "checkoutCode": "CK-9921-X8",
    "publicToken": "chk_pub_98a7b6c51120",
    "reference": "EVT-2026-9921",
    "amount": 25000,
    "currency": "TZS",
    "status": "PENDING",
    "redirectUrl": "/checkout/chk_pub_98a7b6c51120",
    "expiresAt": "2026-10-07T16:30:00.000Z"
  }
}`}</code></pre>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-slate-900">Redirect Customer:</span>
          <p>
            Direct the customer to the hosted checkout page: <code className="text-amber-800 font-mono">https://pay.reignovatechnologies.com/checkout/chk_pub_98a7b6c51120</code>.
          </p>
        </div>
      </section>

      <section id="next-steps" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Next Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Link
            href="/docs/authentication"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-slate-900 block group-hover:text-amber-700">API Authentication</span>
              <span className="text-slate-500">Learn key formats, rotation, and security</span>
            </div>
            <ArrowRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/webhooks"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-slate-900 block group-hover:text-amber-700">Webhooks & Signatures</span>
              <span className="text-slate-500">Process real-time payment updates securely</span>
            </div>
            <ArrowRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </DocsLayout>
  );
}
