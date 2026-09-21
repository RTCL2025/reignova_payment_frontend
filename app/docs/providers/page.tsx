import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { Network, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Mobile Money Providers & pawaPay — Reignova Payment Service',
  description: 'Supported countries, currencies, and mobile operator details via pawaPay integration.',
};

export default function ProvidersPage() {
  const providers = [
    { country: 'Tanzania', iso: 'TZA', currency: 'TZS', operators: ['Vodacom M-Pesa (VODACOM_TZ)', 'Airtel Money (AIRTEL_TZ)', 'Tigo Pesa (TIGO_TZ)', 'Halopesa (HALOPESA_TZ)'] },
    { country: 'Kenya', iso: 'KEN', currency: 'KES', operators: ['Safaricom M-Pesa (SAFARICOM_KE)', 'Airtel Money (AIRTEL_KE)'] },
    { country: 'Uganda', iso: 'UGA', currency: 'UGX', operators: ['MTN Mobile Money (MTN_UG)', 'Airtel Money (AIRTEL_UG)'] },
    { country: 'Ghana', iso: 'GHA', currency: 'GHS', operators: ['MTN Mobile Money (MTN_GH)', 'Vodafone Cash (VODAFONE_GH)', 'AirtelTigo (AIRTELTIGO_GH)'] },
    { country: 'Zambia', iso: 'ZMB', currency: 'ZMW', operators: ['MTN Mobile Money (MTN_ZM)', 'Airtel Money (AIRTEL_ZM)', 'Zamtel (ZAMTEL_ZM)'] },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Providers', href: '/docs/providers' },
        { title: 'Mobile Money Providers' },
      ]}
      title="Supported Mobile Money Providers & pawaPay"
      description="Reignova Payment Service connects to mobile money operators across East & West Africa using pawaPay orchestration."
      toc={[
        { id: 'countries', title: 'Supported Countries & Currencies' },
        { id: 'pawapay', title: 'pawaPay Orchestration Layer' },
      ]}
      prevPage={{ title: 'Webhooks & HMAC', href: '/docs/webhooks' }}
      nextPage={{ title: 'Errors & Troubleshooting', href: '/docs/errors' }}
    >
      <section id="countries" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Supported Countries & Mobile Operators</h2>
        <div className="space-y-4">
          {providers.map((p) => (
            <div key={p.country} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{p.country} ({p.iso})</h3>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-mono text-xs">
                  {p.currency}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {p.operators.map((op) => (
                  <span key={op} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700">
                    {op}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pawapay" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">pawaPay Integration Architecture</h2>
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
          pawaPay serves as the underlying telecommunications aggregator for Reignova Payment Service. All provider credentials, USSD prompt dispatches, and deposit status notifications are managed centrally by Reignova Payment Service, freeing merchant backend applications from handling individual Telco APIs directly.
        </p>
      </section>
    </DocsLayout>
  );
}
