import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { Webhook, ShieldCheck, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Webhooks & HMAC Signatures — Reignova Payment Service',
  description: 'Learn how to process webhook events and verify HMAC-SHA256 signatures securely.',
};

export default function WebhooksPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Webhooks', href: '/docs/webhooks' },
        { title: 'Webhooks & HMAC Signatures' },
      ]}
      title="Webhooks & Signature Verification"
      description="Process real-time payment state updates asynchronously with HMAC-SHA256 signature verification."
      toc={[
        { id: 'events', title: 'Supported Webhook Events' },
        { id: 'signature', title: 'HMAC Signature Verification' },
        { id: 'raw-body', title: 'Raw Body Parsing Requirement' },
      ]}
      prevPage={{ title: 'Payment Processing', href: '/docs/payments' }}
      nextPage={{ title: 'Mobile Money Providers', href: '/docs/providers' }}
    >
      <section id="events" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Supported Webhook Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-emerald-700 font-bold block">checkout.completed</span>
            <span className="text-slate-600 text-[11px] mt-1 block">Payment approved by customer & provider.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-rose-700 font-bold block">payment.failed</span>
            <span className="text-slate-600 text-[11px] mt-1 block">Insufficient funds, invalid PIN, or cancellation.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-amber-700 font-bold block">checkout.expired</span>
            <span className="text-slate-600 text-[11px] mt-1 block">Customer took no action before expiration limit.</span>
          </div>
        </div>
      </section>

      <section id="signature" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">HMAC-SHA256 Signature Verification</h2>
        <p className="text-slate-700">
          Reignova Payment Service attaches an HMAC-SHA256 header: <code className="text-amber-800 font-mono">X-Payment-Signature</code>.
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`import crypto from 'crypto';

const signature = req.headers['X-Payment-Signature'];
const expected = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(rawBodyString)
  .digest('hex');

const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));`}</code></pre>
        </div>
      </section>

      <section id="raw-body" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Raw Body Parsing Requirement</h2>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Do Not Parse JSON First</h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              Always read the unparsed HTTP request body string before running <code className="text-amber-800 font-mono">JSON.parse()</code>. Middleware body parsers alter JSON formatting and break signature digests.
            </p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
