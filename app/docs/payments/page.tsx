import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { ArrowLeftRight, RefreshCw, ShieldCheck, Send, RotateCcw, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Payment Processing, Payouts & Idempotency — Reignova Payment Service',
  description: 'Initiate direct STK push deposits, disburse payouts, issue refunds, and understand database-backed idempotency.',
};

export default function PaymentsPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Payments', href: '/docs/payments' },
        { title: 'Payment Processing & Idempotency' },
      ]}
      title="Direct Payment Processing, Payouts & Idempotency"
      description="Orchestrate server-to-server mobile money deposits, disbursements, refunds, and zero-race-condition idempotency."
      toc={[
        { id: 'direct-deposits', title: 'Direct Deposit Initiation (STK Push)' },
        { id: 'querying', title: 'Querying Payment Status' },
        { id: 'payouts', title: 'Disbursements & Payouts' },
        { id: 'refunds', title: 'Deposit Refunds' },
        { id: 'idempotency', title: 'Strict Idempotency Architecture' },
      ]}
      prevPage={{ title: 'Hosted Checkouts', href: '/docs/checkouts' }}
      nextPage={{ title: 'Webhooks & HMAC', href: '/docs/webhooks' }}
    >
      <section id="direct-deposits" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Direct Deposit Initiation (STK Push)</h2>
        <p className="text-slate-700 leading-relaxed">
          For custom checkout UIs where your application directly collects the payer&apos;s phone number, call <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">POST /api/v1/payments</code> to trigger an instant USSD popup prompt:
        </p>

        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`POST /api/v1/payments HTTP/1.1
Host: pay-api.reignovatechnologies.com
Authorization: Bearer pk_live_YOUR_API_KEY
Idempotency-Key: pay-ref-order-88102
Content-Type: application/json

{
  "reference": "EVT-2026-88102",
  "amount": 45000,
  "currency": "TZS",
  "phoneNumber": "+255754123456",
  "country": "TZ",
  "provider": "VODACOM_TZA",
  "description": "Conference Pass 42",
  "metadata": {
    "orderId": "ord-88102",
    "customerEmail": "attendee@reignova.com"
  }
}`}</code></pre>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-bold text-slate-900">Validation Rules</h4>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            <li><strong>Amount in TZS</strong>: Must be a positive integer with zero decimals (e.g. <code className="font-mono">45000</code>, not <code className="font-mono">45000.00</code>). Maximum single transaction limit is 100,000,000 TZS.</li>
            <li><strong>Phone Number</strong>: Tanzanian E.164 format matching <code className="font-mono">^\+255\d{9}$</code> (+255 followed by exactly 9 digits).</li>
            <li><strong>Provider</strong>: Optional. Can be <code className="font-mono">VODACOM_TZA</code>, <code className="font-mono">AIRTEL_TZA</code>, <code className="font-mono">YAS_TZA</code> (or <code className="font-mono">TIGO_TZA</code>), or <code className="font-mono">HALOTEL_TZA</code>. If omitted, the service auto-predicts operator via pawaPay.</li>
          </ul>
        </div>

        <p className="text-slate-700 text-sm pt-2">Response (<code className="font-mono text-emerald-700 font-bold">202 Accepted</code>):</p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
          <pre><code>{`{
  "success": true,
  "data": {
    "id": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "applicationId": "9d3108cf-6cad-4e9c-ac3c-c7cd4ad456d7",
    "reference": "EVT-2026-88102",
    "amount": 45000,
    "currency": "TZS",
    "phoneNumber": "+255754123456",
    "country": "TZ",
    "provider": "VODACOM_TZA",
    "providerPaymentId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "status": "PROCESSING",
    "description": "Conference Pass 42",
    "metadata": {
      "orderId": "ord-88102",
      "customerEmail": "attendee@reignova.com"
    },
    "completedAt": null,
    "failedAt": null,
    "createdAt": "2026-10-07T16:15:00.000Z"
  }
}`}</code></pre>
        </div>
      </section>

      <section id="querying" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Querying Payment Status</h2>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700">GET /api/v1/payments/:id</span>
              <span className="text-slate-500 font-sans block text-[11px]">Retrieve payment details by Payment UUID</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700">GET /api/v1/payments/reference/:reference</span>
              <span className="text-slate-500 font-sans block text-[11px]">Retrieve payment by your original client order reference</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-700">GET /api/v1/payments</span>
              <span className="text-slate-500 font-sans block text-[11px]">Paginated filterable query with status, reference, phone, and date range</span>
            </div>
            <code className="text-slate-400">?page=1&limit=20&status=COMPLETED</code>
          </div>
        </div>
      </section>

      <section id="payouts" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Disbursements & Payouts (Mobile Money)</h2>
        <p className="text-slate-700 leading-relaxed">
          Send mobile money directly to a recipient&apos;s mobile wallet (e.g. merchant payouts, refunds, affiliate rewards):
        </p>

        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`POST /api/v1/payouts HTTP/1.1
Host: pay-api.reignovatechnologies.com
Authorization: Bearer pk_live_YOUR_API_KEY
Idempotency-Key: po-disburse-vendor-1120
Content-Type: application/json

{
  "reference": "PO-VENDOR-1120",
  "amount": 250000,
  "currency": "TZS",
  "phoneNumber": "+255754123456",
  "country": "TZ",
  "customerMessage": "Ticket Earnings Payout",
  "description": "Monthly organizer settlement"
}`}</code></pre>
        </div>
        <p className="text-xs text-slate-600">
          <code className="font-mono">customerMessage</code> is displayed on the recipient&apos;s SMS notification (4-22 characters).
        </p>
      </section>

      <section id="refunds" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Deposit Refunds</h2>
        <p className="text-slate-700 leading-relaxed">
          Initiate a partial or full refund for a completed deposit payment:
        </p>

        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`POST /api/v1/refunds HTTP/1.1
Host: pay-api.reignovatechnologies.com
Authorization: Bearer pk_live_YOUR_API_KEY
Idempotency-Key: ref-ticket-cancel-991
Content-Type: application/json

{
  "depositPaymentId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
  "reference": "REFUND-EVT-991",
  "amount": 45000,
  "currency": "TZS",
  "description": "Customer requested cancellation within 24h"
}`}</code></pre>
        </div>
      </section>

      <section id="idempotency" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Strict Idempotency Architecture</h2>
        <p className="text-slate-700 leading-relaxed">
          All mutating POST endpoints (<code className="font-mono">/payments</code>, <code className="font-mono">/checkouts</code>, <code className="font-mono">/payouts</code>, <code className="font-mono">/refunds</code>) enforce mandatory <code className="font-mono text-amber-800">Idempotency-Key</code> headers.
        </p>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs leading-relaxed text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Lock className="size-4 text-emerald-600" />
            <span>How Reignova Prevents Double Charges:</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li><strong>Database Unique Index</strong>: A unique index on <code className="font-mono">(application_id, key)</code> in <code className="font-mono">idempotency_keys</code> guarantees that race conditions at the database level are safely blocked.</li>
            <li><strong>Payload Hash Verification</strong>: The canonical request body is hashed via SHA-256. If a subsequent request re-uses an idempotency key with different parameters, the server rejects it immediately with <code className="font-mono text-rose-700 font-bold">409 IDEMPOTENCY_CONFLICT</code>.</li>
            <li><strong>In-Flight Locking</strong>: If a duplicate request arrives while the original transaction is still processing with pawaPay, the second request receives <code className="font-mono text-rose-700 font-bold">409 IDEMPOTENCY_CONFLICT</code> to protect downstream telecommunications carriers.</li>
            <li><strong>Cached Response Replay</strong>: Once the operation completes, identical retries receive the exact cached HTTP response and status code without executing another payment.</li>
          </ol>
        </div>
      </section>
    </DocsLayout>
  );
}
