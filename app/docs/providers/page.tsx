import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { Network, Globe, Smartphone, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Mobile Money Providers & pawaPay — Reignova Payment Service',
  description: 'Tanzania mobile money operators, TZS formatting, automatic provider detection, and pawaPay V2 integration.',
};

export default function ProvidersPage() {
  const tzProviders = [
    {
      operator: 'Vodacom Tanzania (M-Pesa)',
      code: 'VODACOM_TZA',
      aliases: ['VODACOM', 'MPESA'],
      prefixes: ['+25574', '+25575', '+25576'],
      color: 'text-red-700 bg-red-50 border-red-200',
      desc: 'Market leader in Tanzania with widest coverage for USSD push prompts.',
    },
    {
      operator: 'Airtel Tanzania (Airtel Money)',
      code: 'AIRTEL_TZA',
      aliases: ['AIRTEL'],
      prefixes: ['+25568', '+25569', '+25578', '+25579'],
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      desc: 'Fast USSD push prompts with nationwide agent and merchant coverage.',
    },
    {
      operator: 'Mixx by Yas Tanzania (formerly Tigo Pesa)',
      code: 'YAS_TZA / TIGO_TZA',
      aliases: ['YAS', 'TIGO', 'TIGO_TZA'],
      prefixes: ['+25565', '+25567', '+25571'],
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      desc: 'Seamless mobile money deposits and payouts via Tigo/Yas infrastructure.',
    },
    {
      operator: 'Halotel Tanzania (HaloPesa)',
      code: 'HALOTEL_TZA',
      aliases: ['HALOTEL'],
      prefixes: ['+25562'],
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      desc: 'High penetration in rural and regional hubs across Tanzania.',
    },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Providers', href: '/docs/providers' },
        { title: 'Mobile Money Providers' },
      ]}
      title="Mobile Money Providers & pawaPay Orchestration"
      description="Purpose-built for Tanzania mobile money payments, integrating directly with pawaPay V2."
      toc={[
        { id: 'tanzania', title: 'Supported Tanzanian Networks' },
        { id: 'auto-detection', title: 'Automatic Provider Prediction' },
        { id: 'formatting', title: 'Currency & Phone Number Rules' },
        { id: 'pawapay', title: 'pawaPay V2 Integration Architecture' },
      ]}
      prevPage={{ title: 'Webhooks & HMAC', href: '/docs/webhooks' }}
      nextPage={{ title: 'Errors & Troubleshooting', href: '/docs/errors' }}
    >
      <section id="tanzania" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Supported Tanzanian Networks</h2>
        <p className="text-slate-700 leading-relaxed">
          Reignova Payment Service orchestrates deposits and disbursements for all four major mobile telecom operators in Tanzania:
        </p>

        <div className="space-y-3">
          {tzProviders.map((p) => (
            <div key={p.code} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${p.color}`}>
                    {p.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{p.operator}</h3>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-mono">Aliases:</span>
                  {p.aliases.map((al) => (
                    <Badge key={al} variant="outline" className="text-[10px] font-mono bg-slate-50">
                      {al}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 font-sans">{p.desc}</p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-500">
                <span className="font-bold text-slate-700 font-sans">Number Prefixes:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {p.prefixes.map((pref) => (
                    <code key={pref} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                      {pref}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="auto-detection" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Automatic Provider Prediction</h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          You do not need to require users to manually pick their mobile operator. If you omit the <code className="text-amber-800 font-mono">provider</code> field when creating a payment, Reignova Payment Service automatically determines the operator:
        </p>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
            <li><strong>Prefix Heuristic Matching</strong>: Checks whether the phone matches well-known local prefixes (<code className="font-mono">+25574/75/76</code> for Vodacom, <code className="font-mono">+25568/69/78/79</code> for Airtel, etc.).</li>
            <li><strong>pawaPay Predict-Provider Fallback</strong>: Dispatches a query to pawaPay&apos;s <code className="font-mono">POST /v2/predict-provider</code> to verify carrier portability across Tanzanian networks.</li>
          </ol>
        </div>
      </section>

      <section id="formatting" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Currency & Phone Number Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900 font-mono text-sm text-amber-700">Currency: TZS (Zero Decimals)</h4>
            <p className="text-slate-600 leading-relaxed">
              Tanzanian Shilling requires whole integers. Pass <code className="font-mono text-slate-900">50000</code>, not <code className="font-mono text-rose-700">50000.00</code>. Decimals will trigger a <code className="font-mono text-rose-700">400 VALIDATION_ERROR</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900 font-mono text-sm text-emerald-700">Phone: E.164 Format (+255)</h4>
            <p className="text-slate-600 leading-relaxed">
              Pass international E.164: <code className="font-mono text-slate-900">+255754123456</code>. When dispatching to carriers, Payment Service automatically normalizes to MSISDN (<code className="font-mono text-slate-900">255754123456</code>).
            </p>
          </div>
        </div>
      </section>

      <section id="pawapay" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">pawaPay V2 Integration Architecture</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          pawaPay serves as the core telecommunications aggregator, routing payments directly to Tanzanian mobile network operators:
        </p>
        <table className="w-full text-left text-xs font-mono border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-slate-100 text-slate-700 font-sans font-bold">
            <tr>
              <th className="p-3">Environment</th>
              <th className="p-3">API Base URL</th>
              <th className="p-3">pawaPay Dashboard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
            <tr>
              <td className="p-3 font-bold text-emerald-700">Live (Production)</td>
              <td className="p-3">https://api.pawapay.io</td>
              <td className="p-3">https://dashboard.pawapay.io</td>
            </tr>
            <tr>
              <td className="p-3 font-bold text-amber-700">Sandbox (Testing)</td>
              <td className="p-3">https://api.sandbox.pawapay.io</td>
              <td className="p-3">https://dashboard.sandbox.pawapay.io</td>
            </tr>
          </tbody>
        </table>
      </section>
    </DocsLayout>
  );
}
