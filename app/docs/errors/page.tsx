import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { AlertCircle, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Errors & Failure Codes — Reignova Payment Service',
  description: 'RFC-7807 structured error codes, provider failure mappings, and retry strategies.',
};

export default function ErrorsPage() {
  const httpErrors = [
    { code: 400, name: 'Bad Request', desc: 'Invalid JSON payload structure or missing parameters.' },
    { code: 401, name: 'Unauthorized', desc: 'Missing or invalid API key or Bearer token header.' },
    { code: 404, name: 'Not Found', desc: 'Checkout session or public token does not exist or expired.' },
    { code: 409, name: 'Conflict', desc: 'Duplicate idempotency key reference with conflicting payload.' },
    { code: 422, name: 'Unprocessable Entity', desc: 'Validation failed for fields (e.g. invalid phone number format).' },
    { code: 500, name: 'Internal Server Error', desc: 'Unexpected system failure within Payment Service.' },
    { code: 503, name: 'Service Unavailable', desc: 'Downstream Mobile Operator network outage.' },
  ];

  const providerCodes = [
    { code: 'INSUFFICIENT_FUNDS', type: 'Terminal', desc: 'Customer account balance is less than transaction amount.' },
    { code: 'INVALID_PIN', type: 'Terminal', desc: 'Customer entered an incorrect mobile wallet PIN.' },
    { code: 'TRANSACTION_CANCELLED', type: 'Terminal', desc: 'Customer rejected the USSD push prompt on handset.' },
    { code: 'NETWORK_TIMEOUT', type: 'Retryable', desc: 'Mobile operator telecommunication timeout. Safe to retry.' },
    { code: 'PROVIDER_MAINTENANCE', type: 'Retryable', desc: 'Mobile operator undergoing scheduled maintenance.' },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Errors & Troubleshooting', href: '/docs/errors' },
        { title: 'Errors & Failure Codes' },
      ]}
      title="Errors & Provider Failure Code Reference"
      description="Understand HTTP status codes, structured error payloads, and provider failure mappings."
      toc={[
        { id: 'http-status', title: 'HTTP Status Codes' },
        { id: 'failure-codes', title: 'Provider Failure Codes' },
      ]}
      prevPage={{ title: 'Mobile Money Providers', href: '/docs/providers' }}
      nextPage={{ title: 'Sandbox Testing', href: '/docs/testing' }}
    >
      <section id="http-status" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">HTTP Status Codes</h2>
        <div className="space-y-2 font-mono text-xs">
          {httpErrors.map((err) => (
            <div key={err.code} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold">{err.code}</Badge>
                <span className="font-bold text-slate-900">{err.name}</span>
              </div>
              <span className="text-slate-600 font-sans text-xs">{err.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="failure-codes" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Provider Failure Code Mappings</h2>
        <div className="space-y-2 font-mono text-xs">
          {providerCodes.map((p) => (
            <div key={p.code} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-700">{p.code}</span>
                <Badge className={p.type === 'Retryable' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                  {p.type}
                </Badge>
              </div>
              <span className="text-slate-600 font-sans text-xs">{p.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </DocsLayout>
  );
}
