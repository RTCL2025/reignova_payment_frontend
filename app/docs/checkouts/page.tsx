import React from "react";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { CreditCard, ExternalLink, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Hosted Checkouts — Reignova Payment Service",
  description:
    "Learn how to create hosted checkouts, manage public tokens, and handle redirect return URLs.",
};

export default function CheckoutsPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { title: "Checkouts", href: "/docs/checkouts" },
        { title: "Hosted Checkouts Guide" },
      ]}
      title="Hosted Checkouts Integration Guide"
      description="Create secure hosted payment experiences that allow customers to complete mobile money payments via pawaPay."
      toc={[
        { id: "create", title: "Creating a Checkout Session" },
        { id: "redirect", title: "Customer Redirection" },
        { id: "statuses", title: "Checkout Session Statuses" },
      ]}
      prevPage={{ title: "API Authentication", href: "/docs/authentication" }}
      nextPage={{ title: "Payment Processing", href: "/docs/payments" }}
    >
      <section id="create" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Creating a Checkout Session
        </h2>
        <p className="text-slate-700">
          Send a POST request to{" "}
          <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-200">
            /checkouts/public
          </code>{" "}
          from your backend:
        </p>
        <div className="bg-[#0F1A25] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
          <pre>
            <code>{`POST /api/v1/checkouts/public
Headers:
  Authorization: Bearer sk_live_app_8f3a
  Content-Type: application/json

Body:
{
  "amount": 50000,
  "currency": "TZS",
  "country": "TZA",
  "reference": "REIG-EVENT-PASS-88",
  "description": "ReignovaEvents VIP Pass",
  "returnUrl": "https://events.reignovatechnologies.com/checkout/success"
}`}</code>
          </pre>
        </div>
      </section>

      <section
        id="redirect"
        className="space-y-4 pt-6 border-t border-slate-200"
      >
        <h2 className="text-xl font-bold text-slate-900">
          Customer Redirection & Public Token
        </h2>
        <p className="text-slate-700">
          The response returns a{" "}
          <code className="text-amber-800 font-mono">publicToken</code> (e.g.{" "}
          <code className="text-amber-800 font-bold">chk_pub_98a7b6c5</code>).
          Direct the customer to:
        </p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-900 shadow-sm font-semibold">
          https://pay.reignovatechnologies.com/checkout/chk_pub_98a7b6c5
        </div>
      </section>

      <section
        id="statuses"
        className="space-y-4 pt-6 border-t border-slate-200"
      >
        <h2 className="text-xl font-bold text-slate-900">
          All Valid Checkout Session Statuses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-800">PENDING</span>
            <Badge className="bg-sky-100 text-sky-800 border-sky-300">
              Created
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-800">WAITING_PAYMENT</span>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              Customer Input
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-800">PROCESSING</span>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              USSD Push Sent
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-800">COMPLETED</span>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold">
              Successful
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-800">FAILED</span>
            <Badge className="bg-rose-100 text-rose-800 border-rose-300">
              Failed
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-800">EXPIRED</span>
            <Badge className="bg-slate-100 text-slate-600 border-slate-200">
              Timed Out
            </Badge>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
