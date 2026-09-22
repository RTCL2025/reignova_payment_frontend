import React from "react";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { Code2, Terminal, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "API Reference — Reignova Payment Service",
  description:
    "Complete interactive REST API endpoint specifications and schema definitions.",
};

export default function ApiReferencePage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/checkouts/public",
      title: "Create Checkout Session",
      desc: "Creates a new hosted checkout session and returns a public token.",
      headers: [
        "Authorization: Bearer <apiKey>",
        "Content-Type: application/json",
      ],
      body: `{
  "amount": 25000,
  "currency": "TZS",
  "country": "TZA",
  "reference": "EVT-2026-9921",
  "description": "ReignovaEvents VIP Pass",
  "returnUrl": "https://events.reignovatechnologies.com/checkout/success"
}`,
      response: `{
  "success": true,
  "data": {
    "publicToken": "chk_pub_98a7b6c5",
    "reference": "EVT-2026-9921",
    "amount": 25000,
    "currency": "TZS",
    "status": "PENDING"
  }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/checkouts/public/:publicToken",
      title: "Get Checkout Session Details",
      desc: "Retrieves metadata, merchant info, and supported mobile providers for a session.",
      headers: ["Content-Type: application/json"],
      response: `{
  "success": true,
  "data": {
    "publicToken": "chk_pub_98a7b6c5",
    "reference": "EVT-2026-9921",
    "amount": 25000,
    "currency": "TZS",
    "status": "WAITING_PAYMENT",
    "merchant": { "name": "ReignovaEvents", "slug": "reignova-events" }
  }
}`,
    },
    {
      method: "POST",
      path: "/api/v1/checkouts/public/:publicToken/pay",
      title: "Initiate Mobile Payment",
      desc: "Triggers a USSD push deposit prompt on customer mobile device.",
      headers: ["Content-Type: application/json"],
      body: `{
  "provider": "VODACOM_TZ",
  "customerPhone": "+255712345678"
}`,
      response: `{
  "success": true,
  "data": {
    "status": "PROCESSING",
    "message": "Payment prompt sent to customer phone",
    "depositId": "pawapay_dep_99210"
  }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/checkouts/public/:publicToken/status",
      title: "Get Checkout Status",
      desc: "Fetches real-time status of checkout session and deposit attempt.",
      headers: [],
      response: `{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "depositId": "pawapay_dep_99210",
    "failureReason": null
  }
}`,
    },
    {
      method: "POST",
      path: "/api/v1/checkouts/public/:publicToken/cancel",
      title: "Cancel Checkout Session",
      desc: "Cancels an active pending checkout session.",
      headers: [],
      response: `{
  "success": true,
  "data": { "status": "CANCELLED" }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/health",
      title: "Service Health Check",
      desc: "System operational status and provider connectivity health check.",
      headers: [],
      response: `{
  "status": "UP",
  "version": "1.0.0",
  "timestamp": "2026-09-21T12:22:03Z"
}`,
    },
  ];

  return (
    <DocsLayout
      breadcrumbs={[
        { title: "API Reference", href: "/docs/api-reference" },
        { title: "Endpoints" },
      ]}
      title="REST API Endpoints Specification"
      description="Complete endpoint index for Reignova Payment Service."
      toc={endpoints.map((e) => ({ id: e.path, title: e.title }))}
      prevPage={{ title: "Sandbox Testing", href: "/docs/testing" }}
    >
      <div className="space-y-8">
        {endpoints.map((ep) => (
          <div
            key={ep.path}
            id={ep.path}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    ep.method === "POST"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-sky-100 text-sky-800 border-sky-300"
                  }
                >
                  {ep.method}
                </Badge>
                <h3 className="font-bold text-slate-900 text-base">
                  {ep.title}
                </h3>
              </div>
              <code className="text-xs font-mono text-amber-700 font-semibold">
                {ep.path}
              </code>
            </div>

            <p className="text-xs text-slate-600">{ep.desc}</p>

            {ep.headers.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                  Required Headers
                </span>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                  {ep.headers.map((h) => (
                    <div key={h}>{h}</div>
                  ))}
                </div>
              </div>
            )}

            {ep.body && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                  Request Body
                </span>
                <pre className="bg-[#0F1A25] p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
                  <code>{ep.body}</code>
                </pre>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                Response (200 OK)
              </span>
              <pre className="bg-[#0F1A25] p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>{ep.response}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </DocsLayout>
  );
}
