import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { TestTube, Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Sandbox Testing — Reignova Payment Service',
  description: 'Test payment scenarios, mock deposit approvals, and simulated timeouts in Sandbox mode.',
};

export default function TestingPage() {
  const testScenarios = [
    { phone: '+255700000001', outcome: 'COMPLETED', desc: 'Simulates successful customer PIN approval.' },
    { phone: '+255700000002', outcome: 'INSUFFICIENT_FUNDS', desc: 'Simulates wallet insufficient balance failure.' },
    { phone: '+255700000003', outcome: 'INVALID_PIN', desc: 'Simulates wrong PIN entry by customer.' },
    { phone: '+255700000004', outcome: 'EXPIRED', desc: 'Simulates customer USSD prompt timeout.' },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Testing & Sandbox', href: '/docs/testing' },
        { title: 'Sandbox Environment' },
      ]}
      title="Sandbox Environment & Testing Scenarios"
      description="Safely validate checkout flows and webhook delivery using test phone numbers and simulated endpoints."
      toc={[
        { id: 'phone-numbers', title: 'Test Phone Numbers' },
        { id: 'simulation', title: 'Simulated Testing Endpoints' },
      ]}
      prevPage={{ title: 'Errors & Troubleshooting', href: '/docs/errors' }}
      nextPage={{ title: 'API Reference', href: '/docs/api-reference' }}
    >
      <section id="phone-numbers" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Test Phone Numbers (Sandbox)</h2>
        <p className="text-slate-700">
          Use these test numbers when initiating payments in the Sandbox environment to trigger specific test scenarios:
        </p>
        <div className="space-y-2 font-mono text-xs">
          {testScenarios.map((t) => (
            <div key={t.phone} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-700">{t.phone}</span>
                <Badge className={t.outcome === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}>
                  {t.outcome}
                </Badge>
              </div>
              <span className="text-slate-600 font-sans text-xs">{t.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="simulation" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Driving Payment Outcomes</h2>
        <p className="text-slate-700">
          Outcomes are driven through the provider, not through the API. Initiate a
          normal deposit against a sandbox test number and pawaPay settles it for you,
          delivering the same callback your production integration will receive.
        </p>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">
              The simulate-approval and simulate-timeout endpoints were removed
            </h4>
            <p className="text-slate-700 mt-1 leading-relaxed">
              They were reachable without authentication, and a checkout link is given
              to every payer — so anyone could have driven their own checkout to
              COMPLETED without paying. Use the sandbox test numbers above instead.
            </p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
