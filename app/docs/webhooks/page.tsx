import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { AlertTriangle, Info } from 'lucide-react';

export const metadata = {
  title: 'Webhooks & HMAC Signatures — Reignova Payment Service',
  description: 'Learn how to process webhook events and verify HMAC-SHA256 signatures securely.',
};

type EventRow = {
  name: string;
  tone: 'success' | 'failure' | 'warning' | 'neutral';
  description: string;
};

const PAYMENT_EVENTS: EventRow[] = [
  {
    name: 'payment.processing',
    tone: 'neutral',
    description: 'The deposit was accepted by the provider and a prompt was sent to the payer.',
  },
  {
    name: 'payment.completed',
    tone: 'success',
    description: 'Funds confirmed. This is the only event that means you have been paid.',
  },
  {
    name: 'payment.failed',
    tone: 'failure',
    description: 'Insufficient funds, wrong PIN, timeout, or rejection by the provider.',
  },
];

const CHECKOUT_EVENTS: EventRow[] = [
  {
    name: 'checkout.processing',
    tone: 'neutral',
    description: 'The payer chose a provider on the hosted page and approval is pending.',
  },
  {
    name: 'checkout.completed',
    tone: 'success',
    description: 'Hosted checkout paid in full. Fulfil the order against data.reference.',
  },
  {
    name: 'checkout.failed',
    tone: 'failure',
    description: 'The payer could not complete payment. Release anything you reserved.',
  },
  {
    name: 'checkout.expired',
    tone: 'warning',
    description: 'The session lapsed with no payment. Release reserved stock or seats.',
  },
];

const TRANSFER_EVENTS: EventRow[] = [
  {
    name: 'payout.processing',
    tone: 'neutral',
    description: 'A disbursement to a recipient has been accepted by the provider.',
  },
  {
    name: 'payout.failed',
    tone: 'failure',
    description: 'The disbursement was rejected. Funds were not sent.',
  },
  {
    name: 'refund.processing',
    tone: 'neutral',
    description: 'A refund has been submitted to the provider.',
  },
  {
    name: 'refund.failed',
    tone: 'failure',
    description: 'The refund was rejected and the original payment stands.',
  },
];

const TONE_CLASSES: Record<EventRow['tone'], string> = {
  success: 'text-emerald-700',
  failure: 'text-rose-700',
  warning: 'text-amber-700',
  neutral: 'text-sky-700',
};

function EventGroup({ title, note, events }: { title: string; note: string; events: EventRow[] }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{note}</p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        {events.map((event) => (
          <li
            key={event.name}
            className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm"
          >
            <span className={`${TONE_CLASSES[event.tone]} font-bold block`}>{event.name}</span>
            <span className="text-slate-600 text-[11px] mt-1 block leading-relaxed">
              {event.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
        { id: 'payload', title: 'Payload Structure' },
        { id: 'signature', title: 'HMAC Signature Verification' },
        { id: 'raw-body', title: 'Raw Body Parsing Requirement' },
        { id: 'retries', title: 'Retries & Idempotency' },
      ]}
      prevPage={{ title: 'Payment Processing', href: '/docs/payments' }}
      nextPage={{ title: 'Mobile Money Providers', href: '/docs/providers' }}
    >
      <section id="events" className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Supported Webhook Events</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Every event is delivered to the webhook URL registered against your application, as a
          POST with a JSON body. Which family you receive depends on how you took the money.
        </p>

        <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 flex items-start gap-3 text-xs">
          <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sky-900 text-sm">
              Hosted checkouts emit <span className="font-mono">checkout.*</span>, not{' '}
              <span className="font-mono">payment.*</span>
            </h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              A hosted checkout has no payment record of its own — the provider owns the deposit —
              so the <span className="font-mono">checkout.*</span> family is the only notification
              it produces. If you integrated against{' '}
              <span className="font-mono">payment.completed</span> alone, handle{' '}
              <span className="font-mono">checkout.completed</span> as well. Both carry the same{' '}
              <span className="font-mono">data.reference</span> and an uppercase{' '}
              <span className="font-mono">data.status</span>, so a handler that switches on status
              rather than event name already covers both.
            </p>
          </div>
        </div>

        <EventGroup
          title="Hosted checkout"
          note="Emitted when a checkout session you created reaches a new state."
          events={CHECKOUT_EVENTS}
        />
        <EventGroup
          title="Direct payments"
          note="Emitted when you charge a payer directly through the API rather than the hosted page."
          events={PAYMENT_EVENTS}
        />
        <EventGroup
          title="Payouts & refunds"
          note="Emitted for money moving out of your balance."
          events={TRANSFER_EVENTS}
        />
      </section>

      <section id="payload" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Payload Structure</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Every event uses the same envelope. Resolve the order on your side from{' '}
          <code className="text-amber-800 font-mono">data.reference</code> — the reference you
          supplied when you created the checkout or payment.
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre>
            <code>{`{
  "event": "checkout.completed",
  "timestamp": "2026-09-23T09:14:02.881Z",
  "data": {
    "checkoutId": "1f0c…",
    "providerCheckoutId": "cs_sec_bc1fcea…",
    "paymentId": "dep_9f2…",
    "reference": "EVT-TICKET-REV-2026-000012",
    "amount": 85000,
    "currency": "TZS",
    "country": "TZA",
    "phoneNumber": "+255754123456",
    "provider": "pawapay",
    "status": "COMPLETED",
    "depositId": "dep_9f2…",
    "depositStatus": "COMPLETED",
    "failureReason": null,
    "customerEmail": "buyer@example.com",
    "customerName": "Buyer",
    "metadata": { "orderId": "ord-1" },
    "completedAt": "2026-09-23T09:14:01.402Z",
    "failedAt": null,
    "expiredAt": null
  }
}`}</code>
          </pre>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">
          <code className="text-amber-800 font-mono">payment.*</code> events carry the same
          envelope with <code className="text-amber-800 font-mono">paymentId</code>,{' '}
          <code className="text-amber-800 font-mono">providerPaymentId</code> and{' '}
          <code className="text-amber-800 font-mono">description</code> in place of the
          checkout-specific fields.
        </p>
      </section>

      <section id="signature" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">HMAC-SHA256 Signature Verification</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Each request carries an{' '}
          <code className="text-amber-800 font-mono">X-Payment-Signature</code> header in the form{' '}
          <code className="text-amber-800 font-mono">t=&lt;unix_seconds&gt;,v1=&lt;hex_sha256&gt;</code>
          . The signed string is the timestamp, a literal dot, then the raw body — signing the body
          on its own will never match.
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre>
            <code>{`import crypto from 'crypto';

const header = req.headers['x-payment-signature'];
const parts = Object.fromEntries(
  header.split(',').map((p) => p.trim().split('='))
);
const { t: timestamp, v1: received } = parts;

// Reject replays older than five minutes.
if (Math.abs(Date.now() - Number(timestamp) * 1000) > 300_000) {
  throw new Error('Signature expired');
}

const expected = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(\`\${timestamp}.\${rawBodyString}\`)
  .digest('hex');

// timingSafeEqual throws when the buffers differ in length.
const a = Buffer.from(received, 'hex');
const b = Buffer.from(expected, 'hex');
const isValid = a.length === b.length && crypto.timingSafeEqual(a, b);`}</code>
          </pre>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Two things that silently break this</h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              Comparing the whole header against a bare digest never matches — parse{' '}
              <span className="font-mono">v1</span> out first. And calling{' '}
              <span className="font-mono">timingSafeEqual</span> on buffers of different lengths
              throws rather than returning false, which turns a rejected webhook into a 500 and an
              endless retry loop.
            </p>
          </div>
        </div>
      </section>

      <section id="raw-body" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Raw Body Parsing Requirement</h2>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Do Not Parse JSON First</h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              Always read the unparsed HTTP request body string before running{' '}
              <code className="text-amber-800 font-mono">JSON.parse()</code>. Middleware body
              parsers alter JSON formatting and break signature digests.
            </p>
          </div>
        </div>
      </section>

      <section id="retries" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Retries & Idempotency</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Reply <code className="text-amber-800 font-mono">2xx</code> as soon as you have stored
          the event. Any other status — or a timeout — is treated as a failed delivery and retried
          five times with a widening gap:
        </p>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {['1 min', '5 min', '15 min', '30 min', '1 hour'].map((delay, index) => (
            <span
              key={delay}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700"
            >
              <span className="text-slate-400">#{index + 1}</span> {delay}
            </span>
          ))}
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">
          Because a delivery can succeed on your side and still be retried — a timeout after you
          committed, for instance — your handler must be idempotent. Key off{' '}
          <code className="text-amber-800 font-mono">data.reference</code> and treat an order that
          is already settled as a success rather than an error.
        </p>
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 flex items-start gap-3 text-xs">
          <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sky-900 text-sm">Do not treat the return URL as proof</h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              A payer landing back on your return URL does not mean the money arrived, and a payer
              who closes the tab has still paid. Settle orders from the webhook, or from an explicit
              status lookup — never from the browser redirect alone.
            </p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
