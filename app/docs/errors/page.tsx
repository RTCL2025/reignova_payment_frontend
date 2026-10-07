import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { AlertCircle, AlertTriangle, RefreshCw, XCircle, ShieldAlert, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Errors & Troubleshooting — Reignova Payment Service',
  description: 'Structured JSON error envelope, standard error codes, provider failure mappings, and troubleshooting.',
};

export default function ErrorsPage() {
  const httpErrors = [
    { code: 400, errorCode: 'VALIDATION_ERROR', name: 'Bad Request', desc: 'Input validation failed. See error.details for specific Zod field violations.' },
    { code: 400, errorCode: 'MALFORMED_JSON', name: 'Malformed JSON', desc: 'Request body contains invalid JSON syntax.' },
    { code: 401, errorCode: 'AUTHENTICATION_FAILED', name: 'Unauthorized', desc: 'Missing or invalid Bearer API key or Admin-Api-Key.' },
    { code: 403, errorCode: 'FORBIDDEN', name: 'Forbidden', desc: 'Application is currently suspended or access has been revoked.' },
    { code: 404, errorCode: 'NOT_FOUND', name: 'Not Found', desc: 'Checkout session, public token, or payment resource does not exist.' },
    { code: 409, errorCode: 'CONFLICT', name: 'Conflict', desc: 'Duplicate client order reference within the tenant application.' },
    { code: 409, errorCode: 'IDEMPOTENCY_CONFLICT', name: 'Idempotency Conflict', desc: 'Idempotency key is currently processing in-flight, or was reused with conflicting parameters.' },
    { code: 422, errorCode: 'INVALID_STATE_TRANSITION', name: 'Unprocessable Entity', desc: 'Attempted illegal payment status transition (e.g. from COMPLETED to FAILED).' },
    { code: 429, errorCode: 'RATE_LIMIT_EXCEEDED', name: 'Too Many Requests', desc: 'Exceeded endpoint rate limit (60/min public, 600/min authenticated).' },
    { code: 500, errorCode: 'INTERNAL_SERVER_ERROR', name: 'Server Error', desc: 'Unexpected system exception. Check logs using the returned requestId.' },
    { code: 502, errorCode: 'PROVIDER_ERROR', name: 'Bad Gateway', desc: 'Downstream pawaPay network timeout or communication error.' },
    { code: 503, errorCode: 'SERVICE_UNAVAILABLE', name: 'Service Unavailable', desc: 'Database connection offline during readiness health check.' },
  ];

  const providerCodes = [
    { code: 'INSUFFICIENT_FUNDS', type: 'Terminal', desc: 'Customer mobile wallet balance is insufficient to complete the deposit.' },
    { code: 'INVALID_PIN', type: 'Terminal', desc: 'Customer entered an incorrect mobile money PIN on their handset.' },
    { code: 'TRANSACTION_CANCELLED', type: 'Terminal', desc: 'Customer pressed Cancel or dismissed the USSD push popup prompt.' },
    { code: 'NETWORK_TIMEOUT', type: 'Retryable', desc: 'Mobile carrier telecommunication timeout. Prompt may be retried.' },
    { code: 'EXPIRED', type: 'Terminal', desc: 'Payer did not respond to the USSD push popup within carrier timeout window.' },
    { code: 'UNSUPPORTED_NETWORK', type: 'Terminal', desc: 'Phone number does not belong to a supported Tanzanian mobile operator.' },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Errors & Troubleshooting', href: '/docs/errors' },
        { title: 'Errors & Failure Codes' },
      ]}
      title="Errors & Provider Failure Code Reference"
      description="Understand standard error response envelopes, status codes, and provider failure mappings."
      toc={[
        { id: 'envelope', title: 'Standard Error Envelope' },
        { id: 'http-status', title: 'HTTP Status & Error Codes' },
        { id: 'failure-codes', title: 'Carrier Failure Code Mappings' },
        { id: 'rate-limits', title: 'Rate Limiting Tiers' },
      ]}
      prevPage={{ title: 'Mobile Money Providers', href: '/docs/providers' }}
      nextPage={{ title: 'Sandbox Testing', href: '/docs/testing' }}
    >
      <section id="envelope" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Standard Error Envelope</h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          All client and server errors return a consistent JSON envelope containing a machine-readable <code className="font-mono text-amber-800">error.code</code> and a traceable <code className="font-mono text-amber-800">requestId</code>:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-rose-300 overflow-x-auto">
          <pre><code>{`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "phoneNumber",
        "message": "Phone number must be a valid Tanzanian mobile number in E.164 format (+255...)"
      }
    ]
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}`}</code></pre>
        </div>
      </section>

      <section id="http-status" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">HTTP Status & Error Codes</h2>
        <div className="space-y-2.5 font-mono text-xs">
          {httpErrors.map((err) => (
            <div key={`${err.code}-${err.errorCode}`} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Badge className={err.code >= 500 ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold' : err.code >= 400 ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' : 'bg-slate-100 text-slate-800'}>
                  {err.code}
                </Badge>
                <span className="font-bold text-slate-900">{err.errorCode}</span>
              </div>
              <span className="text-slate-600 font-sans text-xs">{err.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="failure-codes" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Carrier Failure Code Mappings</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          When a mobile money deposit fails, the reason is exposed in <code className="font-mono text-amber-800">failureReason</code> inside webhooks and status responses:
        </p>
        <div className="space-y-2 font-mono text-xs">
          {providerCodes.map((p) => (
            <div key={p.code} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-800">{p.code}</span>
                <Badge className={p.type === 'Retryable' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                  {p.type}
                </Badge>
              </div>
              <span className="text-slate-600 font-sans text-xs">{p.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="rate-limits" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Rate Limiting Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="font-mono font-bold text-amber-700">Public Endpoints</span>
            <div className="text-slate-900 font-bold text-sm">60 req / min</div>
            <p className="text-slate-500 text-[11px]">Enforced per client IP on public checkout session endpoints.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="font-mono font-bold text-emerald-700">Authenticated API</span>
            <div className="text-slate-900 font-bold text-sm">600 req / min</div>
            <p className="text-slate-500 text-[11px]">Enforced per tenant application ID on Bearer API key endpoints.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="font-mono font-bold text-sky-700">Webhook Receiver</span>
            <div className="text-slate-900 font-bold text-sm">300 req / min</div>
            <p className="text-slate-500 text-[11px]">Enforced on /api/v1/webhooks for provider callback ingestion.</p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
