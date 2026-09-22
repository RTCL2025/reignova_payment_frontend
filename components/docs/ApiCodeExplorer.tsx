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
    endpoint: "/api/v1/checkouts/public",
    title: "Create Checkout Session",
    description:
      "Generates a hosted payment session public token for customer checkout.",
    curl: `curl -X POST https://pay-api.reignovatechnologies.com/api/v1/checkouts/public \\
  -H "Authorization: Bearer sk_live_app_8f3a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 15000,
    "currency": "TZS",
    "country": "TZA",
    "reference": "ORD-2026-0921",
    "description": "ReignovaEvents Standard Ticket",
    "returnUrl": "https://events.reignovatechnologies.com/checkout/success"
  }'`,
    js: `const response = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts/public', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_app_8f3a',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 15000,
    currency: 'TZS',
    country: 'TZA',
    reference: 'ORD-2026-0921',
    description: 'ReignovaEvents Standard Ticket',
    returnUrl: 'https://events.reignovatechnologies.com/checkout/success'
  })
});
const data = await response.json();`,
    ts: `import { CheckoutSession } from '@reignova/pay-types';

const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts/public', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.PAYMENT_SERVICE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 15000,
    currency: 'TZS',
    country: 'TZA',
    reference: 'ORD-2026-0921'
  })
});
const session: { success: boolean; data: CheckoutSession } = await res.json();`,
    python: `import requests

url = "https://pay-api.reignovatechnologies.com/api/v1/checkouts/public"
headers = {
    "Authorization": "Bearer sk_live_app_8f3a",
    "Content-Type": "application/json"
}
payload = {
    "amount": 15000,
    "currency": "TZS",
    "country": "TZA",
    "reference": "ORD-2026-0921",
    "description": "ReignovaEvents Standard Ticket"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    php: `<?php
$ch = curl_init('https://pay-api.reignovatechnologies.com/api/v1/checkouts/public');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer sk_live_app_8f3a',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'amount' => 15000,
    'currency' => 'TZS',
    'country' => 'TZA',
    'reference' => 'ORD-2026-0921'
]));
$response = curl_exec($ch);
curl_close($ch);`,
    successResponse: `{
  "success": true,
  "data": {
    "publicToken": "chk_pub_98a7b6c51120",
    "reference": "ORD-2026-0921",
    "amount": 15000,
    "currency": "TZS",
    "country": "TZA",
    "status": "PENDING",
    "expiresAt": "2026-09-21T13:22:03.000Z",
    "supportedProviders": [
      { "id": "VODACOM_TZ", "name": "M-Pesa" },
      { "id": "AIRTEL_TZ", "name": "Airtel Money" }
    ]
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount must be a positive integer in smallest currency unit",
    "details": { "field": "amount", "value": -100 }
  }
}`,
  },
  {
    id: "initiate-pay",
    method: "POST",
    endpoint: "/api/v1/checkouts/public/:publicToken/pay",
    title: "Initiate Mobile Payment",
    description:
      "Triggers a mobile money push payment prompt for a specific checkout token.",
    curl: `curl -X POST https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/pay \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "VODACOM_TZ",
    "customerPhone": "+255712345678"
  }'`,
    js: `const res = await fetch('https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'VODACOM_TZ',
    customerPhone: '+255712345678'
  })
});
const result = await res.json();`,
    ts: `const result = await initiatePayment('chk_pub_98a7b6c51120', {
  provider: 'VODACOM_TZ',
  customerPhone: '+255712345678'
});`,
    python: `response = requests.post(
    "https://pay-api.reignovatechnologies.com/api/v1/checkouts/public/chk_pub_98a7b6c51120/pay",
    json={"provider": "VODACOM_TZ", "customerPhone": "+255712345678"}
)`,
    php: `// PHP Mobile Push Request Example
$payload = json_encode(['provider' => 'VODACOM_TZ', 'customerPhone' => '+255712345678']);`,
    successResponse: `{
  "success": true,
  "data": {
    "status": "PROCESSING",
    "message": "Payment prompt sent to customer phone",
    "depositId": "pawapay_dep_99210"
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "PROVIDER_TIMEOUT",
    "message": "Mobile operator network timeout. Please retry transaction.",
    "details": { "provider": "VODACOM_TZ" }
  }
}`,
  },
  {
    id: "get-status",
    method: "GET",
    endpoint: "/api/v1/checkouts/public/:publicToken/status",
    title: "Check Session Status",
    description:
      "Fetches the current status of a checkout session and underlying deposit attempt.",
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
    "failureReason": null,
    "failureCode": null
  }
}`,
    errorResponse: `{
  "success": false,
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "No checkout session found with token chk_pub_98a7b6c51120"
  }
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
            and structured error responses.
          </p>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {API_ENDPOINTS.map((ep, idx) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpointIdx(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
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

        {/* Code Explorer Container */}
        <div className="bg-[#0A121A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Request Snippet with Language Selector */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            {/* Header bar */}
            <div className="px-4 py-3 bg-[#131E2A] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-[11px] font-mono ${getMethodBadgeClass(currentEndpoint.method)}`}
                >
                  {currentEndpoint.method}
                </Badge>
                <span className="text-xs font-mono text-slate-200">
                  {currentEndpoint.endpoint}
                </span>
              </div>

              {/* Languages */}
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                {(["curl", "js", "ts", "python", "php"] as const).map(
                  (lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-2.5 py-1 rounded capitalize transition-colors ${
                        activeLang === lang
                          ? "bg-[#F3A221] text-slate-950 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {lang === "curl" ? "cURL" : lang}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs text-amber-300 overflow-x-auto bg-[#0A121A] min-h-[220px]">
              <div className="text-slate-500 mb-2">
                // {currentEndpoint.title} — {currentEndpoint.description}
              </div>
              <pre>
                <code>{getCodeForLang()}</code>
              </pre>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-[#131E2A] border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Headers: Authorization: Bearer &lt;key&gt;</span>
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          {/* Right: Response Preview (Success vs Error toggle) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#0F1A25]/60">
            {/* Header bar */}
            <div className="px-4 py-3 bg-[#131E2A] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">
                RESPONSE BODY
              </span>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setViewError(false)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    !viewError
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                      : "text-slate-400"
                  }`}
                >
                  200 OK
                </button>
                <button
                  onClick={() => setViewError(true)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    viewError
                      ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40"
                      : "text-slate-400"
                  }`}
                >
                  Error Response
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs overflow-x-auto min-h-[220px]">
              <pre className={viewError ? "text-rose-300" : "text-emerald-300"}>
                <code>
                  {viewError
                    ? currentEndpoint.errorResponse
                    : currentEndpoint.successResponse}
                </code>
              </pre>
            </div>

            {/* Footer info */}
            <div className="px-4 py-2.5 bg-[#131E2A] border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                {viewError ? (
                  <AlertTriangle className="size-3.5 text-rose-400" />
                ) : (
                  <Check className="size-3.5 text-emerald-400" />
                )}
                <span>
                  {viewError
                    ? "Structured RFC-7807 Error Payload"
                    : "Standard JSON Response"}
                </span>
              </span>
              <span className="text-slate-500">application/json</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
