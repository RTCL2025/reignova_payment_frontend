import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { ShieldCheck, Key, Lock, AlertTriangle, CheckCircle2, RotateCw } from 'lucide-react';

export const metadata = {
  title: 'API Authentication — Reignova Payment Service',
  description: 'How to authenticate requests using Bearer tokens, Admin-Api-Key headers, and peppered SHA-256 security.',
};

export default function AuthenticationPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: 'Getting Started', href: '/docs/getting-started' },
        { title: 'API Authentication' },
      ]}
      title="API Authentication & Security Protocols"
      description="Reignova Payment Service enforces multi-tier authentication with cryptographic key hashing and tenant isolation."
      toc={[
        { id: 'auth-tiers', title: 'Authentication Tiers' },
        { id: 'client-keys', title: 'Merchant API Keys (pk_live_ / pk_test_)' },
        { id: 'admin-keys', title: 'Platform Admin Authentication' },
        { id: 'key-security', title: 'Peppered Hashing & Storage' },
        { id: 'key-rotation', title: 'Key Rotation Procedure' },
        { id: 'security-rules', title: 'Security Best Practices' },
      ]}
      prevPage={{ title: 'Getting Started', href: '/docs/getting-started' }}
      nextPage={{ title: 'Hosted Checkouts', href: '/docs/checkouts' }}
    >
      <section id="auth-tiers" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Authentication Architecture</h2>
        <p className="text-slate-700 leading-relaxed">
          The service separates requests into three distinct authorization tiers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="font-bold text-amber-700 font-mono block">1. Merchant Client API</span>
            <p className="text-slate-600">
              Used by SaaS servers (e.g. ReignovaEvents) to create checkouts, initiate direct deposits, disburse payouts, and query status.
            </p>
            <code className="block bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-900 font-mono text-[11px]">
              Authorization: Bearer pk_live_...
            </code>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="font-bold text-indigo-700 font-mono block">2. Public Hosted Checkout</span>
            <p className="text-slate-600">
              Customer browser endpoints. Requires no secret key; scoped by single-use <code className="font-mono text-indigo-800">publicToken</code> with IP rate limiting.
            </p>
            <code className="block bg-indigo-50 p-1.5 rounded border border-indigo-200 text-indigo-900 font-mono text-[11px]">
              /checkouts/public/:publicToken/*
            </code>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="font-bold text-emerald-700 font-mono block">3. Platform Administration</span>
            <p className="text-slate-600">
              Admin operations console for tenant provisioning, refund review, key rotation, and metrics.
            </p>
            <code className="block bg-emerald-50 p-1.5 rounded border border-emerald-200 text-emerald-900 font-mono text-[11px]">
              Admin-Api-Key: &lt;key&gt;
            </code>
          </div>
        </div>
      </section>

      <section id="client-keys" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Merchant API Keys (pk_live_ / pk_test_)</h2>
        <p className="text-slate-700 leading-relaxed">
          Merchant requests must include a standard HTTP Bearer header:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300">
          <pre><code>{`GET /api/v1/payments HTTP/1.1
Host: pay-api.reignovatechnologies.com
Authorization: Bearer pk_live_8f3a9921e4b201a0bc98...`}</code></pre>
        </div>

        <table className="w-full text-left text-xs font-mono border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-4">
          <thead className="bg-slate-100 text-slate-700 font-sans font-bold">
            <tr>
              <th className="p-3">Key Prefix</th>
              <th className="p-3">Environment</th>
              <th className="p-3">Scope & Operational Rules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
            <tr>
              <td className="p-3 text-amber-700 font-bold font-mono">pk_live_*</td>
              <td className="p-3 font-sans">Production</td>
              <td className="p-3 font-sans text-slate-600">
                Full production deposit initiation, payouts, and checkout creation with live mobile wallets.
              </td>
            </tr>
            <tr>
              <td className="p-3 text-sky-700 font-bold font-mono">pk_test_*</td>
              <td className="p-3 font-sans">Sandbox</td>
              <td className="p-3 font-sans text-slate-600">
                Integration testing against pawaPay sandbox simulator without debited funds.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="admin-keys" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Platform Admin Authentication</h2>
        <p className="text-slate-700 leading-relaxed">
          Endpoints under <code className="text-amber-800 font-mono">/api/v1/admin/*</code> require platform admin authorization. Authenticate with either:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 text-slate-200">
          <div>
            <span className="text-amber-400 font-bold">// Custom Admin Header:</span>
            <div className="mt-0.5">Admin-Api-Key: your_platform_master_admin_key</div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-amber-400 font-bold">// Bearer Header with Admin JWT / API Key:</span>
            <div className="mt-0.5">Authorization: Bearer your_platform_master_admin_key</div>
          </div>
        </div>
      </section>

      <section id="key-security" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Peppered Hashing & Storage Architecture</h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-mono">
            <Lock className="size-4 text-emerald-600" />
            <span>Zero Plaintext Key Storage</span>
          </div>
          <p>
            When an application is created or its key rotated, a 256-bit entropy token is generated using <code className="font-mono text-slate-900">crypto.randomBytes(32)</code>. The plaintext token is revealed <strong>exactly once</strong> in the HTTP response.
          </p>
          <p>
            The backend hashes the key with SHA-256 combined with a confidential server-side environment pepper:
          </p>
          <code className="block bg-slate-200/70 p-2 rounded text-slate-900 font-mono">
            Hash = SHA-256(RawKey || API_KEY_PEPPER)
          </code>
          <p>
            Key verification executes <code className="font-mono text-slate-900">crypto.timingSafeEqual()</code> to prevent timing attacks.
          </p>
        </div>
      </section>

      <section id="key-rotation" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Key Rotation Procedure</h2>
        <p className="text-slate-700 leading-relaxed">
          If an API key is compromised, rotate it immediately through the Admin API:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300">
          <pre><code>{`POST /api/v1/admin/applications/c9a4192b-8a88-4fb3-a982-12711684c1f9/rotate-key
Admin-Api-Key: YOUR_ADMIN_KEY

Response (200 OK):
{
  "success": true,
  "data": {
    "applicationId": "c9a4192b-8a88-4fb3-a982-12711684c1f9",
    "apiKey": "pk_live_d87b0a1f4...",
    "rotatedAt": "2026-10-07T16:35:00.000Z"
  }
}`}</code></pre>
        </div>
        <p className="text-xs text-slate-600">
          The prior API key hash is overwritten immediately. Any ongoing request using the old key receives <code className="font-mono text-rose-700">401 AUTHENTICATION_FAILED</code>.
        </p>
      </section>

      <section id="security-rules" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Security Best Practices</h2>
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900 text-sm">Strictly Keep API Keys Server-Side</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Never expose <code className="font-mono text-rose-900 font-bold">pk_live_*</code> keys in browser code, mobile client bundles, or frontend GitHub repositories. Hosted checkouts only need the customer-facing <code className="font-mono text-slate-900">publicToken</code>, which has zero merchant administrative privileges.
            </p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
