import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { TestTube, Play, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck, Terminal, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Sandbox Testing — Reignova Payment Service',
  description: 'Test mobile money scenarios, valid sandbox MSISDNs, and end-to-end webhook verification.',
};

export default function TestingPage() {
  const sandboxNumbers = [
    { phone: '+255754000000', provider: 'Vodacom M-Pesa', outcome: 'COMPLETED', desc: 'Simulates instant USSD approval on Vodacom M-Pesa.' },
    { phone: '+255754123456', provider: 'Vodacom M-Pesa', outcome: 'COMPLETED', desc: 'Standard test MSISDN for successful deposit authorization.' },
    { phone: '+255683456789', provider: 'Airtel Money', outcome: 'COMPLETED', desc: 'Simulates instant approval on Airtel Money network.' },
    { phone: '+255713456789', provider: 'Mixx by Yas / Tigo', outcome: 'COMPLETED', desc: 'Simulates approval on Yas / Tigo Pesa mobile wallet.' },
    { phone: '+255623456789', provider: 'Halotel HaloPesa', outcome: 'COMPLETED', desc: 'Simulates approval on Halotel HaloPesa wallet.' },
    { phone: '+255760000001', provider: 'Vodacom M-Pesa', outcome: 'FAILED', desc: 'Simulates customer cancellation or insufficient wallet balance.' },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Testing & Sandbox', href: '/docs/testing' },
        { title: 'Sandbox Environment' },
      ]}
      title="Sandbox Environment & End-to-End Testing"
      description="Safely validate checkout flows, STK push triggers, and webhook handlers using sandbox test numbers."
      toc={[
        { id: 'phone-numbers', title: 'Sandbox Test Phone Numbers' },
        { id: 'provider-driven', title: 'Provider-Driven Settlements' },
        { id: 'local-webhooks', title: 'Testing Webhooks Locally' },
        { id: 'checklist', title: 'Integration Readiness Checklist' },
      ]}
      prevPage={{ title: 'Errors & Troubleshooting', href: '/docs/errors' }}
      nextPage={{ title: 'API Reference', href: '/docs/api-reference' }}
    >
      <section id="phone-numbers" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sandbox Test Phone Numbers (Tanzania)</h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          When initiating payments against the Sandbox environment (<code className="font-mono text-amber-800">pk_test_*</code> keys), use the following MSISDNs to trigger deterministic outcomes:
        </p>
        <div className="space-y-2.5 font-mono text-xs">
          {sandboxNumbers.map((t) => (
            <div key={t.phone} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-800">{t.phone}</span>
                <span className="text-slate-500 font-sans text-xs">({t.provider})</span>
                <Badge className={t.outcome === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                  {t.outcome}
                </Badge>
              </div>
              <span className="text-slate-600 font-sans text-xs">{t.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="provider-driven" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Provider-Driven Settlements (No Bypass Endpoints)</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Outcomes are executed through the pawaPay sandbox telecommunications gateway, ensuring your application receives the exact same payload structure, latency, and headers as live production:
        </p>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-sm">Security Notice: Unauthenticated Bypass Routes Removed</h4>
            <p className="text-slate-700 leading-relaxed">
              Unauthenticated simulation endpoints (such as <code className="font-mono">simulate-approval</code>) were removed permanently from the public API. Because hosted checkout URLs are handed directly to payers, an unauthenticated approval route represented an exploitable payment bypass.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Always test by submitting payments with the published sandbox test numbers above.
            </p>
          </div>
        </div>
      </section>

      <section id="local-webhooks" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Testing Webhooks Locally (ngrok / Tunneling)</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          To receive webhook notifications on your local machine during development:
        </p>

        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre><code>{`# 1. Start a tunnel to your local backend application (e.g. port 3000)
ngrok http 3000

# 2. Configure your webhook URL in Admin Portal:
# https://xxxx-xx-xx.ngrok-free.app/api/webhooks/payments

# 3. Verify incoming X-Payment-Signature using your tenant webhookSecret`}</code></pre>
        </div>
      </section>

      <section id="checklist" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Production Go-Live Checklist</h2>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="text-slate-800">Switch API keys from <code className="font-mono text-amber-800">pk_test_*</code> to <code className="font-mono text-emerald-800">pk_live_*</code>.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="text-slate-800">Ensure webhook receiver verifies raw unparsed body HMAC signatures before running <code className="font-mono">JSON.parse()</code>.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="text-slate-800">Ensure order settlement is idempotent on <code className="font-mono">data.reference</code> to handle potential retries.</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="text-slate-800">Test a real transaction using a live mobile wallet with minimal amount (e.g. 500 TZS).</span>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
