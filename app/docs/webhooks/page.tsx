import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { AlertTriangle, Info, ShieldCheck, RefreshCw, Key, CheckCircle2 } from 'lucide-react';

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
    description: 'The deposit was accepted by pawaPay and a USSD PIN prompt was sent to the payer.',
  },
  {
    name: 'payment.completed',
    tone: 'success',
    description: 'Funds confirmed and deposited into the platform account. Settle the order.',
  },
  {
    name: 'payment.failed',
    tone: 'failure',
    description: 'Insufficient funds, wrong PIN, timeout, or rejection by the mobile carrier.',
  },
];

const CHECKOUT_EVENTS: EventRow[] = [
  {
    name: 'checkout.processing',
    tone: 'neutral',
    description: 'The payer selected an operator on the hosted page and the USSD prompt is pending approval.',
  },
  {
    name: 'checkout.completed',
    tone: 'success',
    description: 'Hosted checkout paid in full. Fulfill the order matching data.reference.',
  },
  {
    name: 'checkout.failed',
    tone: 'failure',
    description: 'The payer rejected the prompt or mobile operator failed. Release reserved inventory.',
  },
  {
    name: 'checkout.expired',
    tone: 'warning',
    description: 'The session lapsed without payment after 15 minutes of inactivity.',
  },
  {
    name: 'checkout.cancelled',
    tone: 'failure',
    description: 'The buyer actively clicked Cancel on the hosted checkout page.',
  },
];

const TRANSFER_EVENTS: EventRow[] = [
  {
    name: 'payout.processing',
    tone: 'neutral',
    description: 'A mobile money disbursement to a recipient wallet has been accepted by the carrier.',
  },
  {
    name: 'payout.completed',
    tone: 'success',
    description: 'Disbursement confirmed delivered to recipient mobile wallet.',
  },
  {
    name: 'payout.failed',
    tone: 'failure',
    description: 'The disbursement was rejected by the carrier. Funds remain unspent.',
  },
  {
    name: 'refund.processing',
    tone: 'neutral',
    description: 'A refund has been submitted to the provider against an original deposit.',
  },
  {
    name: 'refund.completed',
    tone: 'success',
    description: 'Refund confirmed and returned to customer mobile wallet.',
  },
  {
    name: 'refund.failed',
    tone: 'failure',
    description: 'The refund was rejected and the original deposit stands intact.',
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
            <span className="text-slate-600 text-[11px] mt-1 block leading-relaxed font-sans">
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
        { id: 'pawapay-ingestion', title: 'Provider Webhook Ingestion (RFC-9421)' },
      ]}
      prevPage={{ title: 'Payment Processing', href: '/docs/payments' }}
      nextPage={{ title: 'Mobile Money Providers', href: '/docs/providers' }}
    >
      <section id="events" className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Supported Webhook Events</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Every event is delivered to the webhook URL registered against your SaaS application as an HTTP POST with a JSON body and an HMAC signature header.
        </p>

        <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 flex items-start gap-3 text-xs">
          <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sky-900 text-sm">
              Hosted checkouts emit <span className="font-mono">checkout.*</span>, direct payments emit <span className="font-mono">payment.*</span>
            </h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              Both payloads contain <span className="font-mono">data.reference</span> and an uppercase <span className="font-mono">data.status</span>. If your webhook handler keys off <span className="font-mono">data.reference</span> and updates your order based on <span className="font-mono">data.status === &apos;COMPLETED&apos;</span>, you cover both hosted checkouts and direct payments seamlessly.
            </p>
          </div>
        </div>

        <EventGroup
          title="Hosted Checkout Lifecycle"
          note="Emitted when a customer interacts with or completes a hosted checkout session."
          events={CHECKOUT_EVENTS}
        />
        <EventGroup
          title="Direct Payments"
          note="Emitted when you charge a payer directly via POST /api/v1/payments."
          events={PAYMENT_EVENTS}
        />
        <EventGroup
          title="Payouts & Refunds"
          note="Emitted when disbursing funds or reversing previous deposits."
          events={TRANSFER_EVENTS}
        />
      </section>

      <section id="payload" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Payload Structure</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Every event uses the standardized Reignova notification envelope:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre>
            <code>{`{
  "event": "checkout.completed",
  "timestamp": "2026-10-07T16:16:35.881Z",
  "data": {
    "checkoutId": "e2f18374-1234-4a56-b789-0123456789ab",
    "providerCheckoutId": "pawapay_chk_991823",
    "paymentId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "reference": "EVT-ORDER-9921",
    "amount": 50000,
    "currency": "TZS",
    "country": "TZ",
    "phoneNumber": "+255754123456",
    "provider": "pawapay",
    "status": "COMPLETED",
    "depositId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "depositStatus": "COMPLETED",
    "failureReason": null,
    "customerEmail": "baraka@reignova.com",
    "customerName": "Baraka Mussa",
    "metadata": { "ticketTier": "VIP", "orderId": "ord_9921" },
    "completedAt": "2026-10-07T16:16:35.000Z",
    "failedAt": null,
    "expiredAt": null
  }
}`}</code>
          </pre>
        </div>
      </section>

      <section id="signature" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">HMAC-SHA256 Signature Verification</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Each webhook includes an <code className="text-amber-800 font-mono">X-Payment-Signature</code> header in the format{' '}
          <code className="text-amber-800 font-mono">t=&lt;unix_seconds&gt;,v1=&lt;hex_sha256&gt;</code>.
          The signed string is the timestamp, a literal period, and the raw unparsed request body (<code className="font-mono">&quot;${'{'}timestamp{'}'}.${'{'}rawBody{'}'}&quot;</code>).
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre>
            <code>{`import crypto from 'node:crypto';

export async function verifyWebhook(req: Request) {
  const header = req.headers.get('x-payment-signature');
  if (!header) throw new Error('Missing signature header');

  const parts = Object.fromEntries(
    header.split(',').map((p) => p.trim().split('='))
  );
  const { t: timestamp, v1: receivedSignature } = parts;

  // 1. Enforce 5-minute replay tolerance window
  const ageMs = Math.abs(Date.now() - Number(timestamp) * 1000);
  if (ageMs > 300_000) {
    throw new Error('Webhook signature timestamp expired');
  }

  // 2. Read the raw text body (DO NOT use JSON.parse first)
  const rawBody = await req.text();
  const secret = process.env.PAYMENT_WEBHOOK_SECRET!;

  // 3. Compute expected signature
  const expected = crypto
    .createHmac('sha256', secret)
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest('hex');

  // 4. Compare bytes in constant time
  const a = Buffer.from(receivedSignature, 'hex');
  const b = Buffer.from(expected, 'hex');

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Invalid webhook signature');
  }

  return JSON.parse(rawBody);
}`}</code>
          </pre>
        </div>
      </section>

      <section id="raw-body" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Raw Body Parsing Requirement</h2>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Do Not Parse JSON Before Verifying</h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              Standard body parser middlewares alter whitespace, newlines, and key ordering. Always capture the raw byte buffer or string stream before JSON parsing, or signature validation will fail.
            </p>
          </div>
        </div>
      </section>

      <section id="retries" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Retries & Idempotency</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Your endpoint must return HTTP <code className="text-amber-800 font-mono">2xx</code> within 5 seconds. If your server returns 4xx/5xx or times out, Payment Service automatically retries up to 5 times with exponential backoff:
        </p>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {['1 min', '5 min', '15 min', '30 min', '1 hour'].map((delay, index) => (
            <span
              key={delay}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700"
            >
              <span className="text-slate-400">Attempt #{index + 1}:</span> {delay} delay
            </span>
          ))}
        </div>
        <p className="text-slate-700 text-sm leading-relaxed pt-2">
          Make your webhook receiver idempotent: if you receive <code className="text-amber-800 font-mono">checkout.completed</code> for an order that was already fulfilled, safely acknowledge with <code className="font-mono text-emerald-700">200 OK</code>.
        </p>
      </section>

      <section id="pawapay-ingestion" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Provider Webhook Ingestion (RFC-9421)</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Between pawaPay and Reignova Payment Service, callbacks are received on <code className="text-amber-800 font-mono">/api/v1/webhooks/pawapay</code>:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
          <li><strong>RFC-9421 Signatures</strong>: pawaPay signs incoming webhooks with <code className="font-mono">Signature</code>, <code className="font-mono">Signature-Input</code>, and <code className="font-mono">Content-Digest</code>.</li>
          <li><strong>Fast-Acknowledgement</strong>: Callbacks are acknowledged within 50ms, deduplicated against <code className="font-mono">webhook_events</code> table, and transactions are settled deterministically before client notification.</li>
        </ul>
      </section>
    </DocsLayout>
  );
}
