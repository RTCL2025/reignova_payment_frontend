import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { ArrowLeftRight, RefreshCw, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Payment Processing & Idempotency — Reignova Payment Service',
  description: 'Initiate mobile money payments, track deposit statuses, and handle idempotency keys.',
};

export default function PaymentsPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Payments', href: '/docs/payments' },
        { title: 'Payment Processing' },
      ]}
      title="Payment Processing & Deposit Reconciliation"
      description="Initiate mobile money payments, track deposit IDs, and safely execute retries using idempotency references."
      toc={[
        { id: 'initiation', title: 'Payment Initiation Payload' },
        { id: 'idempotency', title: 'Idempotency Keys & Retries' },
      ]}
      prevPage={{ title: 'Hosted Checkouts', href: '/docs/checkouts' }}
      nextPage={{ title: 'Webhooks & HMAC', href: '/docs/webhooks' }}
    >
      <section id="initiation" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Payment Initiation Payload</h2>
        <p className="text-slate-700">
          Send payment details for a specific public token:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`POST /api/v1/checkouts/public/chk_pub_98a7b6c5/pay
Content-Type: application/json

{
  "provider": "VODACOM_TZ",
  "customerPhone": "+255712345678"
}`}</code></pre>
        </div>
      </section>

      <section id="idempotency" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Idempotency Keys & Retries</h2>
        <p className="text-slate-700">
          To prevent duplicate mobile push requests during network disruptions, provide a unique <code className="text-amber-800 font-mono">reference</code> string or <code className="text-amber-800 font-mono">Idempotency-Key</code> header.
        </p>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
          <span className="font-bold text-slate-900">Idempotency Key Rules:</span>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Identical payload + same key returns the existing deposit attempt without re-prompting the customer.</li>
            <li>Keys expire after 24 hours.</li>
          </ul>
        </div>
      </section>
    </DocsLayout>
  );
}
