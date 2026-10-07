import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { CreditCard, ExternalLink, Clock, RefreshCw, Smartphone, CheckCircle2, XCircle, Ban, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Hosted Checkouts — Reignova Payment Service',
  description: 'Learn how to create hosted checkouts, manage public tokens, handle status polling, and process return URLs.',
};

export default function CheckoutsPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Checkouts', href: '/docs/checkouts' },
        { title: 'Hosted Checkouts Guide' },
      ]}
      title="Hosted Checkouts Integration Guide"
      description="Create secure, high-conversion mobile money checkout flows powered by pawaPay and Reignova Payment Service."
      toc={[
        { id: 'create', title: 'Creating a Checkout Session' },
        { id: 'public-flow', title: 'Customer Experience & Public APIs' },
        { id: 'polling', title: 'Real-Time Status Polling' },
        { id: 'receipts', title: 'Digital Payment Receipts' },
        { id: 'management', title: 'Merchant Session Management' },
        { id: 'lifecycle', title: 'Session Lifecycle & State Machine' },
      ]}
      prevPage={{ title: 'API Authentication', href: '/docs/authentication' }}
      nextPage={{ title: 'Payment Processing', href: '/docs/payments' }}
    >
      <section id="create" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Creating a Checkout Session</h2>
        <p className="text-slate-700 leading-relaxed">
          SaaS applications create checkout sessions via an authenticated server-to-server request to <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">POST /api/v1/checkouts</code>.
        </p>

        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`POST /api/v1/checkouts HTTP/1.1
Host: pay-api.reignovatechnologies.com
Authorization: Bearer pk_live_YOUR_API_KEY
Idempotency-Key: evt-chk-ord-9921
Content-Type: application/json

{
  "reference": "EVT-ORDER-9921",
  "amount": 50000,
  "currency": "TZS",
  "country": "TZ",
  "description": "VIP Pass 2026",
  "returnUrl": "https://events.reignovatechnologies.com/checkout/success",
  "cancelUrl": "https://events.reignovatechnologies.com/checkout/cancelled",
  "returnMethod": "INSTANT",
  "expiresAfter": 15,
  "customer": {
    "name": "Baraka Mussa",
    "email": "baraka@reignova.com",
    "phone": "+255754123456"
  },
  "metadata": {
    "ticketTier": "VIP",
    "orderId": "ord_9921"
  }
}`}</code></pre>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-bold text-slate-900">Key Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-mono font-bold text-amber-800">amount & currency</span>
              <p className="text-slate-600 mt-0.5">Amount must be positive integer in TZS (zero decimal places). Multiple country amounts can be supplied via <code className="font-mono">amounts: [...]</code>.</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-mono font-bold text-amber-800">returnUrl (Required)</span>
              <p className="text-slate-600 mt-0.5">Redirect URL after customer approval. Note: Do not rely solely on redirects for order fulfillment; always await signed webhooks.</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-mono font-bold text-amber-800">expiresAfter</span>
              <p className="text-slate-600 mt-0.5">Integer between 3 and 60 minutes (defaults to 15 minutes). Unpaid sessions transition to <code className="font-mono">EXPIRED</code>.</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-mono font-bold text-amber-800">payer (Optional)</span>
              <p className="text-slate-600 mt-0.5">Pre-fill provider or phone number. Set <code className="font-mono">allowCustomerToOverride: false</code> to lock the payer number.</p>
            </div>
          </div>
        </div>

        <p className="text-slate-700 text-sm pt-2">Response (<code className="font-mono text-emerald-700 font-bold">201 Created</code>):</p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
          <pre><code>{`{
  "success": true,
  "data": {
    "id": "e2f18374-1234-4a56-b789-0123456789ab",
    "applicationId": "9d3108cf-6cad-4e9c-ac3c-c7cd4ad456d7",
    "reference": "EVT-ORDER-9921",
    "checkoutCode": "CK-9921-X8",
    "publicToken": "chk_pub_98a7b6c51120",
    "amount": 50000,
    "currency": "TZS",
    "country": "TZ",
    "status": "PENDING",
    "redirectUrl": "/checkout/chk_pub_98a7b6c51120",
    "expiresAt": "2026-10-07T16:30:00.000Z",
    "createdAt": "2026-10-07T16:15:00.000Z"
  }
}`}</code></pre>
        </div>
      </section>

      <section id="public-flow" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Customer Experience & Public APIs</h2>
        <p className="text-slate-700 leading-relaxed">
          Redirect the customer&apos;s browser to the hosted checkout page:
        </p>
        <div className="p-3 bg-white border border-amber-300 rounded-xl font-mono text-xs text-slate-900 font-bold shadow-sm">
          https://pay.reignovatechnologies.com/checkout/chk_pub_98a7b6c51120
        </div>

        <p className="text-slate-700 text-sm leading-relaxed">
          The hosted checkout UI communicates exclusively with public endpoints. No sensitive secrets or database IDs are revealed to the client:
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-100 text-sky-800 border-sky-300">GET</Badge>
              <span className="font-bold text-slate-900">/api/v1/checkouts/public/:publicToken</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Returns sanitized checkout details: amount, currency, merchant name and logo, prefilled customer phone/email, and supported Tanzanian networks.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">POST</Badge>
              <span className="font-bold text-slate-900">/api/v1/checkouts/public/:publicToken/pay</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Submits customer&apos;s phone number (<code className="font-mono">+255...</code>) and provider. Initiates USSD deposit push via pawaPay and transitions status to <code className="font-mono text-amber-700 font-bold">PROCESSING</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-100 text-rose-800 border-rose-300">POST</Badge>
              <span className="font-bold text-slate-900">/api/v1/checkouts/public/:publicToken/cancel</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Allows the buyer to cancel an active session, marking it <code className="font-mono text-rose-700">CANCELLED</code> and redirecting to <code className="font-mono">cancelUrl</code>.
            </p>
          </div>
        </div>
      </section>

      <section id="polling" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Real-Time Status Polling</h2>
        <p className="text-slate-700 leading-relaxed">
          While the customer enters their PIN on their handset, the hosted checkout frontend polls:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`GET /api/v1/checkouts/public/chk_pub_98a7b6c51120/status

Response (200 OK):
{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "depositId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "depositStatus": "COMPLETED",
    "failureReason": null,
    "completedAt": "2026-10-07T16:16:35.000Z"
  }
}`}</code></pre>
        </div>
        <p className="text-xs text-slate-600">
          The polling interval is 2.5 seconds with automated timeout fallback. When status transitions to <code className="font-mono text-emerald-700 font-bold">COMPLETED</code>, the UI fires celebration confetti and redirects to merchant <code className="font-mono">returnUrl</code>.
        </p>
      </section>

      <section id="receipts" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Digital Payment Receipts</h2>
        <p className="text-slate-700 leading-relaxed">
          Once a checkout session reaches <code className="font-mono text-emerald-700">COMPLETED</code>, customers and merchants can fetch a printable, formatted receipt payload:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          <pre><code>{`GET /api/v1/checkouts/public/chk_pub_98a7b6c51120/receipt

Response (200 OK):
{
  "success": true,
  "data": {
    "receiptNumber": "REC-CK-9921-X8",
    "reference": "EVT-ORDER-9921",
    "merchantName": "ReignovaEvents",
    "amount": 50000,
    "currency": "TZS",
    "status": "COMPLETED",
    "paidAt": "2026-10-07T16:16:35.000Z",
    "customer": {
      "name": "Baraka Mussa",
      "phone": "+255 754 ••• 456"
    }
  }
}`}</code></pre>
        </div>
      </section>

      <section id="management" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Merchant Session Management</h2>
        <p className="text-slate-700 leading-relaxed">
          Manage your checkout sessions from your backend using your Bearer API key:
        </p>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700">GET /api/v1/checkouts</span>
              <span className="text-slate-500 font-sans block text-[11px]">Paginated list with status, reference, checkoutCode, and date filters</span>
            </div>
            <code className="text-slate-400">?page=1&limit=20&status=COMPLETED</code>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700">GET /api/v1/checkouts/:id</span>
              <span className="text-slate-500 font-sans block text-[11px]">Retrieve internal checkout session by UUID</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700">GET /api/v1/checkouts/code/:code</span>
              <span className="text-slate-500 font-sans block text-[11px]">Retrieve checkout session by short alphanumeric code (e.g. CK-9921-X8)</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-700">POST /api/v1/checkouts/:id/expire</span>
              <span className="text-slate-500 font-sans block text-[11px]">Manually expire an active session before timeout</span>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Session Lifecycle & State Machine</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">PENDING</span>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200">Created</Badge>
            </div>
            <p className="text-slate-500 font-sans text-[11px]">Session created by merchant backend; awaiting customer browser visit.</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-800">WAITING_PAYMENT</span>
              <Badge className="bg-sky-100 text-sky-800 border-sky-300">Customer Input</Badge>
            </div>
            <p className="text-slate-500 font-sans text-[11px]">Customer opened checkout link; selecting mobile network and phone number.</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800">PROCESSING</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-300">USSD Push Sent</Badge>
            </div>
            <p className="text-slate-500 font-sans text-[11px]">Deposit dispatched to pawaPay; USSD push prompt shown on mobile handset.</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800">COMPLETED</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold">Settled</Badge>
            </div>
            <p className="text-slate-500 font-sans text-[11px]">Customer entered correct PIN; payment verified and funds secured.</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-800">FAILED</span>
              <Badge className="bg-rose-100 text-rose-800 border-rose-300">Rejected</Badge>
            </div>
            <p className="text-slate-500 font-sans text-[11px]">Insufficient funds, invalid PIN, or telecom provider rejection.</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">EXPIRED</span>
              <Badge className="bg-slate-100 text-slate-500 border-slate-200">Lapsed</Badge>
            </div>
            <p className="text-slate-500 font-sans text-[11px]">Inactivity timeout lapsed without completion. Unlocks reserved items.</p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
