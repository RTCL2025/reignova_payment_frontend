"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Terminal,
  Code,
  Layers,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ApiEndpointExample {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  title: string;
  description: string;
  curl: string;
  js: string;
  ts: string;
  python: string;
  php: string;
  successResponse: string;
  errorResponse: string;
}

export const API_ENDPOINTS: ApiEndpointExample[] = [
  {
    id: "create-checkout",
    method: "POST",
    endpoint: "/api/v1/checkouts",
    title: "Create Checkout Session",
    description:
      "Server-to-server request generating a hosted session public token for customer checkout.",
    curl: `curl -X POST https://pay-api.reignovatechnologies.com/api/v1/checkouts \\
  -H "Authorization: Bearer pk_live_8f3a9921e4b201" \\
  -H "Idempotency-Key: evt-order-9921" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reference": "ORD-2026-0921",
    "amount": 25000,
    "currency": "TZS",
    "country": "TZ",
    "description": "ReignovaEvents Standard Ticket",
    "returnUrl": "https://events.reignovatechnologies.com/checkout/success"
  }'`,
    js: `const response = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_8f3a9921e4b201',
    'Idempotency-Key': 'evt-order-9921',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference: 'ORD-2026-0921',
    amount: 25000,
    currency: 'TZS',
    country: 'TZ',
    description: 'ReignovaEvents Standard Ticket',
    returnUrl: 'https://events.reignovatechnologies.com/checkout/success'
  })
});
const data = await response.json();`,
    ts: `import type { CheckoutSession } from '@/types/checkout';

const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.PAYMENT_SERVICE_API_KEY}\`,
    'Idempotency-Key': 'evt-order-9921',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference: 'ORD-2026-0921',
    amount: 25000,
    currency: 'TZS',
    country: 'TZ',
    returnUrl: 'https://events.reignovatechnologies.com/checkout/success'
  })
});
const { data }: { data: CheckoutSession } = await res.json();`,
    python: `import requests

url = "https://pay-api.reignovatechnologies.com/api/v1/checkouts"
headers = {
    "Authorization": "Bearer pk_live_8f3a9921e4b201",
    "Idempotency-Key": "evt-order-9921",
    "Content-Type": "application/json"
}
payload = {
    "reference": "ORD-2026-0921",
    "amount": 25000,
    "currency": "TZS",
    "country": "TZ",
    "description": "ReignovaEvents Standard Ticket",
    "returnUrl": "https://events.reignovatechnologies.com/checkout/success"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    php: `<?php
$ch = curl_init('https://pay-api.reignovatechnologies.com/api/v1/checkouts');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer pk_live_8f3a9921e4b201',
    'Idempotency-Key: evt-order-9921',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'reference' => 'ORD-2026-0921',
    'amount' => 25000,
    'currency' => 'TZS',
    'country' => 'TZ',
    'returnUrl' => 'https://events.reignovatechnologies.com/checkout/success'
]));
$response = curl_exec($ch);
curl_close($ch);`,
    successResponse: `{
  "success": true,
  "data": {
    "id": "e2f18374-1234-4a56-b789-0123456789ab",
    "checkoutCode": "CK-9921-X8",
    "publicToken": "chk_pub_98a7b6c51120",
    "reference": "ORD-2026-0921",
    "amount": 25000,
    "currency": "TZS",
    "country": "TZ",
    "status": "PENDING",
    "redirectUrl": "/checkout/chk_pub_98a7b6c51120",
    "expiresAt": "2026-10-07T16:30:00.000Z"
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "returnUrl",
        "message": "returnUrl is required"
      }
    ]
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}`,
  },
  {
    id: "initiate-pay",
    method: "POST",
    endpoint: "/api/v1/checkouts/public/:publicToken/pay",
    title: "Customer Mobile Payment",
    description:
      "Public endpoint called by hosted checkout to trigger USSD push PIN prompt via pawaPay.",
    curl: `curl -X POST https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/pay \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "VODACOM_TZA",
    "customerPhone": "+255754123456",
    "customerName": "Baraka Mussa"
  }'`,
    js: `const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'VODACOM_TZA',
    customerPhone: '+255754123456',
    customerName: 'Baraka Mussa'
  })
});
const result = await res.json();`,
    ts: `const result = await initiatePayment('chk_pub_98a7b6c51120', {
  provider: 'VODACOM_TZA',
  customerPhone: '+255754123456',
  customerName: 'Baraka Mussa'
});`,
    python: `response = requests.post(
    "https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/pay",
    json={
        "provider": "VODACOM_TZA",
        "customerPhone": "+255754123456",
        "customerName": "Baraka Mussa"
    }
)`,
    php: `// PHP Mobile Push Request Example
$payload = json_encode([
    'provider' => 'VODACOM_TZA',
    'customerPhone' => '+255754123456'
]);`,
    successResponse: `{
  "success": true,
  "data": {
    "status": "PROCESSING",
    "message": "Payment prompt sent to customer phone",
    "depositId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee"
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "PROVIDER_ERROR",
    "message": "Mobile operator network timeout. Please retry transaction.",
    "details": { "provider": "VODACOM_TZA" }
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440001"
}`,
  },
  {
    id: "get-status",
    method: "GET",
    endpoint: "/api/v1/checkouts/public/:publicToken/status",
    title: "Poll Session Status",
    description:
      "Lightweight endpoint polled by browser every 2.5s to track terminal status.",
    curl: `curl -X GET https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/status`,
    js: `const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/status');
const status = await res.json();`,
    ts: `const statusData = await getCheckoutStatus("chk_pub_98a7b6c51120");`,
    python: `res = requests.get("https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/status")`,
    php: `$res = file_get_contents("https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/status");`,
    successResponse: `{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "depositId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "depositStatus": "COMPLETED",
    "failureReason": null,
    "completedAt": "2026-10-07T16:16:35.000Z"
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Checkout session 'chk_pub_98a7b6c51120' not found"
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440002"
}`,
  },
  {
    id: "direct-payment",
    method: "POST",
    endpoint: "/api/v1/payments",
    title: "Direct STK Push Payment",
    description:
      "Server-to-server endpoint to trigger mobile money STK push deposit directly without hosted page.",
    curl: `curl -X POST https://pay-api.reignovatechnologies.com/api/v1/payments \\
  -H "Authorization: Bearer pk_live_8f3a9921e4b201" \\
  -H "Idempotency-Key: pay-evt-99120" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reference": "EVT-TICKET-99120",
    "amount": 50000,
    "currency": "TZS",
    "phoneNumber": "+255754123456",
    "country": "TZ",
    "provider": "VODACOM_TZA",
    "description": "VIP Pass 2026"
  }'`,
    js: `const response = await fetch('https://pay-api.reignovatechnologies.com/api/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_8f3a9921e4b201',
    'Idempotency-Key': 'pay-evt-99120',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference: 'EVT-TICKET-99120',
    amount: 50000,
    currency: 'TZS',
    phoneNumber: '+255754123456',
    country: 'TZ',
    provider: 'VODACOM_TZA'
  })
});
const data = await response.json();`,
    ts: `const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.PAYMENT_SERVICE_API_KEY}\`,
    'Idempotency-Key': 'pay-evt-99120',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference: 'EVT-TICKET-99120',
    amount: 50000,
    currency: 'TZS',
    phoneNumber: '+255754123456',
    country: 'TZ'
  })
});
const payment = await res.json();`,
    python: `payload = {
    "reference": "EVT-TICKET-99120",
    "amount": 50000,
    "currency": "TZS",
    "phoneNumber": "+255754123456",
    "country": "TZ",
    "provider": "VODACOM_TZA"
}
res = requests.post(
    "https://pay-api.reignovatechnologies.com/api/v1/payments",
    json=payload,
    headers={
        "Authorization": "Bearer pk_live_8f3a9921e4b201",
        "Idempotency-Key": "pay-evt-99120"
    }
)`,
    php: `// PHP Direct Payment Request
$ch = curl_init('https://pay-api.reignovatechnologies.com/api/v1/payments');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer pk_live_8f3a9921e4b201',
    'Idempotency-Key: pay-evt-99120',
    'Content-Type: application/json'
]);`,
    successResponse: `{
  "success": true,
  "data": {
    "id": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee",
    "reference": "EVT-TICKET-99120",
    "amount": 50000,
    "currency": "TZS",
    "phoneNumber": "+255754123456",
    "country": "TZ",
    "provider": "VODACOM_TZA",
    "status": "PROCESSING",
    "providerPaymentId": "7b8cb404-51e4-44b2-a4f6-86cb8114f4ee"
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "IDEMPOTENCY_CONFLICT",
    "message": "An identical request is currently processing or already completed with different parameters"
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440003"
}`,
  },
  {
    id: "disburse-payout",
    method: "POST",
    endpoint: "/api/v1/payouts",
    title: "Disburse Mobile Payout",
    description:
      "Disburses mobile money directly to recipient mobile wallet in Tanzania.",
    curl: `curl -X POST https://pay-api.reignovatechnologies.com/api/v1/payouts \\
  -H "Authorization: Bearer pk_live_8f3a9921e4b201" \\
  -H "Idempotency-Key: po-disburse-vendor-1120" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reference": "PO-VENDOR-1120",
    "amount": 250000,
    "currency": "TZS",
    "phoneNumber": "+255754123456",
    "country": "TZ",
    "customerMessage": "Ticket Earnings"
  }'`,
    js: `const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/payouts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_8f3a9921e4b201',
    'Idempotency-Key': 'po-disburse-vendor-1120',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference: 'PO-VENDOR-1120',
    amount: 250000,
    currency: 'TZS',
    phoneNumber: '+255754123456',
    country: 'TZ',
    customerMessage: 'Ticket Earnings'
  })
});
const payout = await res.json();`,
    ts: `const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/payouts', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.PAYMENT_SERVICE_API_KEY}\`,
    'Idempotency-Key': 'po-disburse-vendor-1120',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reference: 'PO-VENDOR-1120',
    amount: 250000,
    currency: 'TZS',
    phoneNumber: '+255754123456',
    country: 'TZ'
  })
});`,
    python: `res = requests.post(
    "https://pay-api.reignovatechnologies.com/api/v1/payouts",
    json={
        "reference": "PO-VENDOR-1120",
        "amount": 250000,
        "currency": "TZS",
        "phoneNumber": "+255754123456",
        "country": "TZ"
    },
    headers={
        "Authorization": "Bearer pk_live_8f3a9921e4b201",
        "Idempotency-Key": "po-disburse-vendor-1120"
    }
)`,
    php: `// PHP Payout Request
$ch = curl_init('https://pay-api.reignovatechnologies.com/api/v1/payouts');`,
    successResponse: `{
  "success": true,
  "data": {
    "id": "8a7c92d3-1122-3344-5566-778899aabbcc",
    "reference": "PO-VENDOR-1120",
    "amount": 250000,
    "currency": "TZS",
    "status": "PROCESSING"
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number must be a valid mobile number in E.164 format"
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440004"
}`,
  },
];

export function ApiCodeExplorer() {
  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState(0);
  const [activeLang, setActiveLang] = useState<
    "curl" | "js" | "ts" | "python" | "php"
  >("curl");
  const [viewError, setViewError] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentEndpoint = API_ENDPOINTS[selectedEndpointIdx];

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "PATCH":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "DELETE":
        return "bg-rose-100 text-rose-700 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getCodeForLang = () => {
    switch (activeLang) {
      case "curl":
        return currentEndpoint.curl;
      case "js":
        return currentEndpoint.js;
      case "ts":
        return currentEndpoint.ts;
      case "python":
        return currentEndpoint.python;
      case "php":
        return currentEndpoint.php;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeForLang());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
            Developer Sandbox
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Interactive API Code Explorer
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Inspect request payloads, HTTP headers, multi-language SDK snippets,
            and structured error responses for live payment workflows.
          </p>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {API_ENDPOINTS.map((ep, idx) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpointIdx(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedEndpointIdx === idx
                  ? "bg-white text-amber-800 border border-amber-300 shadow-sm"
                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900"
              }`}
            >
              <Badge
                className={`text-[10px] ${getMethodBadgeClass(ep.method)}`}
              >
                {ep.method}
              </Badge>
              <span>{ep.endpoint}</span>
            </button>
          ))}
        </div>

        {/* Explorer Card */}
        <div className="bg-[#0F1A25] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Top Header */}
          <div className="px-6 py-4 bg-[#14202E] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge
                className={`text-xs font-mono font-bold ${getMethodBadgeClass(
                  currentEndpoint.method,
                )}`}
              >
                {currentEndpoint.method}
              </Badge>
              <span className="font-mono text-sm font-semibold text-slate-200">
                {currentEndpoint.endpoint}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#0A121A] p-1 rounded-lg border border-slate-800">
              {(["curl", "js", "ts", "python", "php"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    activeLang === lang
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Description bar */}
          <div className="px-6 py-3 bg-[#0D1620] border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>{currentEndpoint.description}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="p-6 font-mono text-xs text-amber-300 overflow-x-auto max-h-96">
            <pre>
              <code>{getCodeForLang()}</code>
            </pre>
          </div>

          {/* Response Viewer Toggle */}
          <div className="px-6 py-3 bg-[#14202E] border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Response:</span>
              <button
                onClick={() => setViewError(false)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  !viewError
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                200 OK
              </button>
              <button
                onClick={() => setViewError(true)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  viewError
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Error (4xx)
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Format: application/json
            </span>
          </div>

          {/* Response Body Display */}
          <div className="p-6 bg-[#0B131D] font-mono text-xs border-t border-slate-800 overflow-x-auto max-h-72">
            <pre
              className={viewError ? "text-rose-300" : "text-emerald-300"}
            >
              <code>
                {viewError
                  ? currentEndpoint.errorResponse
                  : currentEndpoint.successResponse}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
