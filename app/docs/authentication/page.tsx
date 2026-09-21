import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { ShieldCheck, Key, Lock, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'API Authentication — Reignova Payment Service',
  description: 'How to authenticate requests using Bearer tokens and Admin-Api-Key headers.',
};

export default function AuthenticationPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Getting Started', href: '/docs/getting-started' },
        { title: 'API Authentication' },
      ]}
      title="API Authentication & Security"
      description="Reignova Payment Service requires authenticated headers for service-to-service communication."
      toc={[
        { id: 'auth-headers', title: 'Supported HTTP Headers' },
        { id: 'key-types', title: 'Key Prefix Format' },
        { id: 'security-rules', title: 'Security Best Practices' },
      ]}
      prevPage={{ title: 'Getting Started', href: '/docs/getting-started' }}
      nextPage={{ title: 'Hosted Checkouts', href: '/docs/checkouts' }}
    >
      <section id="auth-headers" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Supported HTTP Headers</h2>
        <p className="text-slate-700">
          Pass your application secret key in one of the following HTTP headers:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3 text-slate-200">
          <div>
            <span className="text-amber-400 font-bold">// Recommended: Bearer Authorization Header</span>
            <div className="mt-1">Authorization: Bearer sk_live_app_8f3a9921e4b201</div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-amber-400 font-bold">// Alternative: Custom Admin Header</span>
            <div className="mt-1">Admin-Api-Key: sk_live_app_8f3a9921e4b201</div>
          </div>
        </div>
      </section>

      <section id="key-types" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">API Key Prefix Formats</h2>
        <table className="w-full text-left text-xs font-mono border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3">Prefix</th>
              <th className="p-3">Environment</th>
              <th className="p-3">Scope & Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
            <tr>
              <td className="p-3 text-amber-700 font-bold">sk_live_*</td>
              <td className="p-3">Production</td>
              <td className="p-3">Full live transaction and checkout initiation permissions.</td>
            </tr>
            <tr>
              <td className="p-3 text-sky-700 font-bold">sk_test_*</td>
              <td className="p-3">Sandbox</td>
              <td className="p-3">Mock deposits and sandbox checkout testing.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="security-rules" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Security Best Practices</h2>
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900 text-sm">Never Expose API Keys in Client-Side Code</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              API secret keys must strictly remain in backend application environments. Never store secret keys in frontend React components or public web repositories.
            </p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
