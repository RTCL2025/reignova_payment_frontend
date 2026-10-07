import React from "react";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { Code2, Terminal, ShieldCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "API Reference — Reignova Payment Service",
  description:
    "Complete interactive REST API endpoint specifications and schema definitions.",
};

interface EndpointDoc {
  method: "GET" | "POST" | "PATCH";
  path: string;
  category: string;
  title: string;
  desc: string;
  headers: string[];
  body?: string;
  response: string;
}

export default function ApiReferencePage() {
  const endpoints: EndpointDoc[] = [
    // 1. Checkouts (Server-to-Server)
    {
      method: "POST",
      path: "/api/v1/checkouts",
      category: "Checkouts",
      title: "Create Checkout Session",
      desc: "Creates a new hosted checkout session and generates a secure publicToken.",
      headers: [
        "Authorization: Bearer <API_KEY>",
        "Idempotency-Key: <unique-uuid>",
        "Content-Type: application/json",
      ],
      body: `{
  "reference": "EVT-ORDER-9921",
  "amount": 50000,
  "currency": "TZS",
  "country": "TZ",
  "returnUrl": "https://events.reignovatechnologies.com/checkout/success",
  "cancelUrl": "https://events.reignovatechnologies.com/checkout/cancelled",
  "returnMethod": "INSTANT",
  "description": "ReignovaEvents VIP Pass",
  "customer": {
    "name": "Baraka Mussa",
    "email": "baraka@reignova.com",
    "phone": "+255754123456"
  }
}`,
      response: `{
  "success": true,
  "data": {
    "id": "e2f18374-1234-4a56-b789-0123456789ab",
    "checkoutCode": "CK-9921-X8",
    "publicToken": "chk_pub_98a7b6c51120",
    "reference": "EVT-ORDER-9921",
    "amount": 50000,
    "currency": "TZS",
    "status": "PENDING",
    "redirectUrl": "/checkout/chk_pub_98a7b6c51120",
    "expiresAt": "2026-10-07T16:30:00.000Z"
  }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/checkouts",
      category: "Checkouts",
      title: "List Checkout Sessions",
      desc: "Retrieves paginated checkout sessions for the authenticated application.",
      headers: ["Authorization: Bearer <API_KEY>"],
      response: `{
  "success": true,
  "data": [
    {
      "id": "e2f18374-1234-4a56-b789-0123456789ab",
      "reference": "EVT-ORDER-9921",
      "checkoutCode": "CK-9921-X8",
      "status": "COMPLETED",
      "amount": 50000,
      "currency": "TZS"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1 }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/checkouts/code/:code",
      category: "Checkouts",
      title: "Get Checkout by Short Code",
      desc: "Retrieves session details using alphanumeric code (e.g. CK-9921-X8).",
      headers: ["Authorization: Bearer <API_KEY>"],
      response: `{
  "success": true,
  "data": {
    "id": "e2f18374-1234-4a56-b789-0123456789ab",
    "checkoutCode": "CK-9921-X8",
    "status": "COMPLETED",
    "amount": 50000,
    "currency": "TZS"
  }
}`,
    },

    // 2. Public Hosted Checkouts (Browser)
    {
      method: "GET",
      path: "/api/v1/checkouts/public/:publicToken",
      category: "Public Checkout",
      title: "Fetch Public Checkout Session",
      desc: "Fetches sanitized session information for the customer UI without exposing secrets.",
      headers: ["Accept: application/json"],
      response: `{
  "success": true,
  "data": {
    "publicToken": "chk_pub_98a7b6c51120",
    "reference": "EVT-ORDER-9921",
    "amount": 50000,
    "currency": "TZS",
    "status": "WAITING_PAYMENT",
    "merchant": { "name": "ReignovaEvents", "slug": "reignova-events" },
    "supportedProviders": [
      { "id": "VODACOM_TZA", "name": "Vodacom M-Pesa" },
      { "id": "AIRTEL_TZA", "name": "Airtel Money" },
      { "id": "YAS_TZA", "name": "Mixx by Yas / Tigo Pesa" },
      { "id": "HALOTEL_TZA", "name": "Halotel HaloPesa" }
    ]
  }
}`,
    },
    {
      method: "POST",
      path: "/api/v1/checkouts/public/:publicToken/pay",
      category: "Public Checkout",
      title: "Initiate Customer Mobile Payment",
      desc: "Triggers USSD push PIN prompt via pawaPay to the customer mobile handset.",
      headers: ["Content-Type: application/json"],
      body: `{
  "provider": "VODACOM_TZA",
  "customerPhone": "+255754123456",
  "customerName": "Baraka Mussa"
}`,
      response: `{
  "success": true,
  "data": {
    "status": "PROCESSING",
    "message": "Payment prompt sent to customer phone",
    "depositId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee"
  }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/checkouts/public/:publicToken/status",
      category: "Public Checkout",
      title: "Poll Checkout Real-Time Status",
      desc: "Lightweight endpoint polled every 2.5 seconds to track deposit outcome.",
      headers: [],
      response: `{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "depositStatus": "COMPLETED",
    "depositId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "failureReason": null
  }
}`,
    },
    {
      method: "POST",
      path: "/api/v1/checkouts/public/:publicToken/cancel",
      category: "Public Checkout",
      title: "Cancel Checkout Session",
      desc: "Cancels an active session when buyer clicks cancel.",
      headers: [],
      response: `{
  "success": true,
  "data": { "status": "CANCELLED" }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/checkouts/public/:publicToken/receipt",
      category: "Public Checkout",
      title: "Get Payment Receipt",
      desc: "Fetches structured invoice and printable receipt data for completed sessions.",
      headers: [],
      response: `{
  "success": true,
  "data": {
    "receiptNumber": "REC-CK-9921-X8",
    "reference": "EVT-ORDER-9921",
    "amount": 50000,
    "currency": "TZS",
    "status": "COMPLETED",
    "paidAt": "2026-10-07T16:16:35.000Z"
  }
}`,
    },

    // 3. Direct Payments API
    {
      method: "POST",
      path: "/api/v1/payments",
      category: "Direct Payments",
      title: "Initiate Direct STK Push Deposit",
      desc: "Initiates mobile money deposit directly without redirecting through hosted checkout.",
      headers: [
        "Authorization: Bearer <API_KEY>",
        "Idempotency-Key: <unique-uuid>",
        "Content-Type: application/json",
      ],
      body: `{
  "reference": "EVT-DIR-88102",
  "amount": 45000,
  "currency": "TZS",
  "phoneNumber": "+255754123456",
  "country": "TZ",
  "provider": "VODACOM_TZA",
  "description": "Standard Ticket 42"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "reference": "EVT-DIR-88102",
    "amount": 45000,
    "currency": "TZS",
    "status": "PROCESSING",
    "providerPaymentId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee"
  }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/payments/:id",
      category: "Direct Payments",
      title: "Get Payment by ID",
      desc: "Fetches payment details by unique UUID.",
      headers: ["Authorization: Bearer <API_KEY>"],
      response: `{
  "success": true,
  "data": {
    "id": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "reference": "EVT-DIR-88102",
    "amount": 45000,
    "currency": "TZS",
    "status": "COMPLETED",
    "completedAt": "2026-10-07T16:16:35.000Z"
  }
}`,
    },
    {
      method: "GET",
      path: "/api/v1/payments/reference/:reference",
      category: "Direct Payments",
      title: "Get Payment by Reference",
      desc: "Fetches payment record using your client order reference.",
      headers: ["Authorization: Bearer <API_KEY>"],
      response: `{
  "success": true,
  "data": {
    "id": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "reference": "EVT-DIR-88102",
    "status": "COMPLETED"
  }
}`,
    },

    // 4. Payouts API
    {
      method: "POST",
      path: "/api/v1/payouts",
      category: "Payouts",
      title: "Disburse Mobile Money Payout",
      desc: "Disburses funds directly to recipient mobile money wallet in Tanzania.",
      headers: [
        "Authorization: Bearer <API_KEY>",
        "Idempotency-Key: <unique-uuid>",
        "Content-Type: application/json",
      ],
      body: `{
  "reference": "PO-VEND-1120",
  "amount": 250000,
  "currency": "TZS",
  "phoneNumber": "+255754123456",
  "country": "TZ",
  "customerMessage": "Ticket Earnings",
  "description": "Monthly organizer payout"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "8a7c92d3-1122-3344-5566-778899aabbcc",
    "reference": "PO-VEND-1120",
    "amount": 250000,
    "currency": "TZS",
    "status": "PROCESSING"
  }
}`,
    },

    // 5. Refunds API
    {
      method: "POST",
      path: "/api/v1/refunds",
      category: "Refunds",
      title: "Initiate Deposit Refund",
      desc: "Refunds an existing completed mobile money deposit.",
      headers: [
        "Authorization: Bearer <API_KEY>",
        "Idempotency-Key: <unique-uuid>",
        "Content-Type: application/json",
      ],
      body: `{
  "depositPaymentId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
  "reference": "REFUND-EVT-991",
  "amount": 45000,
  "currency": "TZS",
  "description": "Cancellation within 24 hours"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "3f4a1234-5678-90ab-cdef-1234567890ab",
    "reference": "REFUND-EVT-991",
    "amount": 45000,
    "currency": "TZS",
    "status": "PROCESSING"
  }
}`,
    },

    // 6. Health
    {
      method: "GET",
      path: "/health",
      category: "System",
      title: "Liveness Health Check",
      desc: "Returns server operational liveness and process uptime.",
      headers: [],
      response: `{
  "status": "ok",
  "uptime": 12845.2,
  "timestamp": "2026-10-07T16:20:00.000Z"
}`,
    },
    {
      method: "GET",
      path: "/health/ready",
      category: "System",
      title: "Readiness Health Check",
      desc: "Verifies active PostgreSQL database connectivity.",
      headers: [],
      response: `{
  "status": "ready",
  "database": "connected",
  "timestamp": "2026-10-07T16:20:00.000Z"
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
      description="Exhaustive endpoint specifications for checkouts, direct payments, payouts, refunds, and health checks."
      toc={endpoints.map((e) => ({ id: e.path, title: e.title }))}
      prevPage={{ title: "Sandbox Testing", href: "/docs/testing" }}
    >
      <div className="space-y-8">
        {endpoints.map((ep) => (
          <div
            key={`${ep.method}-${ep.path}`}
            id={ep.path}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    ep.method === "POST"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold font-mono"
                      : "bg-sky-100 text-sky-800 border-sky-300 font-bold font-mono"
                  }
                >
                  {ep.method}
                </Badge>
                <h3 className="font-bold text-slate-900 text-base">
                  {ep.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-sans">
                  {ep.category}
                </Badge>
                <code className="text-xs font-mono text-amber-700 font-bold">
                  {ep.path}
                </code>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{ep.desc}</p>

            {ep.headers.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                  Required Headers
                </span>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-0.5">
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
                Example Response
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
