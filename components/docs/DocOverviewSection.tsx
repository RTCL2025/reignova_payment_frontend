"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  ArrowRight,
  Code2,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

export interface DocCategory {
  title: string;
  items: {
    id: string;
    label: string;
    href: string;
    breadcrumbs: string[];
    title: string;
    intro: string;
    codeSample: {
      lang: string;
      request: string;
      response: string;
    };
    parameters: {
      name: string;
      type: string;
      required: boolean;
      desc: string;
    }[];
  }[];
}

export const DOC_NAVIGATION: DocCategory[] = [
  {
    title: "Getting Started",
    items: [
      {
        id: "intro",
        label: "Introduction & Architecture",
        href: "/docs/getting-started",
        breadcrumbs: ["Docs", "Getting Started", "Introduction"],
        title: "Centralized Reignova Payment Infrastructure",
        intro:
          "Reignova Payment Service acts as the central financial gateway for Reignova products. It encapsulates provider credentials, manages checkout states, and processes incoming webhooks securely.",
        codeSample: {
          lang: "bash",
          request: `# Health Check Endpoint
curl -X GET https://pay.reignovatechnologies.com/api/v1/health`,
          response: `{
  "status": "UP",
  "version": "1.0.0",
  "timestamp": "2026-09-21T12:22:03Z",
  "provider": "pawaPay"
}`,
        },
        parameters: [
          {
            name: "PAYMENT_SERVICE_BASE_URL",
            type: "string",
            required: true,
            desc: "Base endpoint URL for Reignova Payment Service",
          },
          {
            name: "PAYMENT_SERVICE_API_KEY",
            type: "string",
            required: true,
            desc: "Application API key generated in Admin Portal",
          },
        ],
      },
      {
        id: "auth",
        label: "Authentication & API Keys",
        href: "/docs/authentication",
        breadcrumbs: ["Docs", "Getting Started", "Authentication"],
        title: "Authenticating API Requests",
        intro:
          "Backend applications authenticate by passing a Bearer API token or Admin-Api-Key header. Real secret keys must never be exposed to public clients.",
        codeSample: {
          lang: "bash",
          request: `# Service Request Headers
Authorization: Bearer sk_live_app_889104
Content-Type: application/json`,
          response: `{
  "authenticated": true,
  "merchantId": "app_reignova_events",
  "permissions": ["checkouts:create", "checkouts:read"]
}`,
        },
        parameters: [
          {
            name: "Authorization",
            type: "header",
            required: true,
            desc: "Bearer <apiKey> for backend API calls",
          },
          {
            name: "Admin-Api-Key",
            type: "header",
            required: false,
            desc: "Alternative header for administrative tasks",
          },
        ],
      },
    ],
  },
  {
    title: "Checkouts",
    items: [
      {
        id: "creating-checkout",
        label: "Creating a Checkout",
        href: "/docs/checkouts",
        breadcrumbs: ["Docs", "Checkouts", "Creating a Checkout"],
        title: "Creating a Hosted Checkout Session",
        intro:
          "Initiate a checkout session from your backend application. The Payment Service returns a publicToken and a hosted checkout URL for customer redirection.",
        codeSample: {
          lang: "json",
          request: `POST /checkouts/public
{
  "amount": 50000,
  "currency": "TZS",
  "country": "TZA",
  "reference": "EVT-TICKET-8921",
  "description": "ReignovaEvents Standard Pass"
}`,
          response: `{
  "success": true,
  "data": {
    "publicToken": "chk_pub_98a7b6c5",
    "reference": "EVT-TICKET-8921",
    "amount": 50000,
    "currency": "TZS",
    "status": "PENDING"
  }
}`,
        },
        parameters: [
          {
            name: "amount",
            type: "number",
            required: true,
            desc: "Total transaction amount in smallest currency unit",
          },
          {
            name: "currency",
            type: "string",
            required: true,
            desc: "3-letter ISO code (e.g. TZS, KES, UGX)",
          },
          {
            name: "country",
            type: "string",
            required: true,
            desc: "3-letter ISO country code (e.g. TZA, KEN)",
          },
          {
            name: "reference",
            type: "string",
            required: true,
            desc: "Unique order or invoice reference from merchant system",
          },
        ],
      },
    ],
  },
  {
    title: "Webhooks",
    items: [
      {
        id: "signatures",
        label: "Signature Verification",
        href: "/docs/webhooks",
        breadcrumbs: ["Docs", "Webhooks", "Signature Verification"],
        title: "Verifying Webhook Signatures",
        intro:
          "Webhooks sent to your callback URL contain an HMAC signature header. Always verify the signature using your raw unparsed request body before processing fulfillment.",
        codeSample: {
          lang: "typescript",
          request: `import crypto from 'crypto';

function verifySignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}`,
          response: `// Return HTTP 200 OK immediately after queuing event
res.status(200).json({ received: true });`,
        },
        parameters: [
          {
            name: "x-reignova-signature",
            type: "header",
            required: true,
            desc: "HMAC-SHA256 signature of raw request body",
          },
          {
            name: "webhookSecret",
            type: "secret",
            required: true,
            desc: "Shared secret generated during merchant setup",
          },
        ],
      },
    ],
  },
];

export function DocOverviewSection() {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");
  const [copied, setCopied] = useState(false);

  const currentItem =
    DOC_NAVIGATION[selectedCategoryIdx].items[selectedItemIdx];

  const handleCopy = () => {
    const text =
      activeTab === "request"
        ? currentItem.codeSample.request
        : currentItem.codeSample.response;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
              Developer Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Comprehensive Integration Guides
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a documentation article to view API examples, headers, and
              payload parameters.
            </p>
          </div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-amber-700 hover:text-amber-800 hover:border-amber-400 text-xs font-semibold shadow-sm transition-colors"
          >
            <span>View Full Docs Index</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Two-Column Docs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Categorized Tree Navigation */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-6 shadow-sm">
            {DOC_NAVIGATION.map((cat, catIdx) => (
              <div key={cat.title} className="space-y-2">
                <div className="px-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-amber-600" />
                  <span>{cat.title}</span>
                </div>
                <div className="space-y-1">
                  {cat.items.map((item, itemIdx) => {
                    const isSelected =
                      catIdx === selectedCategoryIdx &&
                      itemIdx === selectedItemIdx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedCategoryIdx(catIdx);
                          setSelectedItemIdx(itemIdx);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-amber-50 text-amber-800 border border-amber-300 font-semibold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`size-3.5 ${isSelected ? "text-amber-600" : "text-slate-400"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick Links */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="px-3 text-[11px] font-mono text-slate-400 uppercase">
                Additional Resources
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/docs/providers"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-xs text-slate-700 hover:text-slate-900 border border-slate-200 text-center"
                >
                  Providers
                </Link>
                <Link
                  href="/docs/errors"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-xs text-slate-700 hover:text-slate-900 border border-slate-200 text-center"
                >
                  Error Codes
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Article Preview */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm relative">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              {currentItem.breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb}>
                  {i > 0 && <span className="text-slate-300">/</span>}
                  <span
                    className={
                      i === currentItem.breadcrumbs.length - 1
                        ? "text-amber-700 font-semibold"
                        : ""
                    }
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Title & Intro */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentItem.intro}
              </p>
            </div>

            {/* Interactive Dark Code Box inside Light Card for IDE Feel */}
            <div className="bg-[#0F1A25] border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#131E2A] border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Terminal className="size-3.5 text-amber-400" />
                  <span>Code Sample ({currentItem.codeSample.lang})</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      onClick={() => setActiveTab("request")}
                      className={`px-2.5 py-0.5 rounded font-mono transition-colors ${
                        activeTab === "request"
                          ? "bg-[#F3A221] text-slate-950 font-semibold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Request
                    </button>
                    <button
                      onClick={() => setActiveTab("response")}
                      className={`px-2.5 py-0.5 rounded font-mono transition-colors ${
                        activeTab === "response"
                          ? "bg-[#F3A221] text-slate-950 font-semibold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Response
                    </button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <pre className="p-4 font-mono text-xs text-amber-300/90 overflow-x-auto bg-[#0A121A]/80 leading-relaxed">
                <code>
                  {activeTab === "request"
                    ? currentItem.codeSample.request
                    : currentItem.codeSample.response}
                </code>
              </pre>
            </div>

            {/* Parameters Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Parameters & Environment Variables
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Field</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {currentItem.parameters.map((param) => (
                      <tr key={param.name} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-amber-700 font-medium">
                          {param.name}
                        </td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">
                          {param.type}
                        </td>
                        <td className="p-3">
                          {param.required ? (
                            <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-[10px]">
                              Required
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-slate-500 text-[10px]"
                            >
                              Optional
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-slate-700">{param.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer link to full guide */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-600">
                Want complete implementation steps?
              </span>
              <Button
                asChild
                size="sm"
                className="bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-xs gap-1.5"
              >
                <Link href={currentItem.href}>
                  <span>Read full guide</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
