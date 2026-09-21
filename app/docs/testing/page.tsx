import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { TestTube, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
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
        <h2 className="text-xl font-bold text-slate-900">Simulated Testing Endpoints</h2>
        <p className="text-slate-700">
          You can manually trigger state changes in Sandbox mode using simulation endpoints:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3 text-slate-200">
          <div>
            <span className="text-emerald-400 font-bold">// Force Instant Approval</span>
            <div className="mt-1">POST /api/v1/checkouts/public/:publicToken/simulate-approval</div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-amber-400 font-bold">// Force Session Timeout</span>
            <div className="mt-1">POST /api/v1/checkouts/public/:publicToken/simulate-timeout</div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
