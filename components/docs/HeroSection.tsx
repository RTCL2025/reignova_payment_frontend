'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Terminal, Check, Copy, Play, RefreshCw, Zap, Server, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'create_checkout' | 'webhook_payload' | 'payment_status'>('create_checkout');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<'PENDING' | 'WAITING_PAYMENT' | 'COMPLETED'>('PENDING');

  const snippets = {
    create_checkout: {
      title: 'POST /checkouts/public',
      code: `curl -X POST https://pay.reignovatechnologies.com/api/v1/checkouts \\
  -H "Authorization: Bearer sk_live_reignova_events_8f3a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "TZS",
    "country": "TZA",
    "reference": "EVT-2026-9921",
    "description": "ReignovaEvents VIP Ticket Pass",
    "returnUrl": "https://events.reignova.com/checkout/success"
  }'`,
      response: `{
  "success": true,
  "data": {
    "publicToken": "chk_live_9f82ab411e72",
    "reference": "EVT-2026-9921",
    "amount": 25000,
    "currency": "TZS",
    "status": "${simulatedStatus}",
    "merchant": { "name": "ReignovaEvents", "slug": "reignova-events" },
    "expiresAt": "2026-09-21T13:22:03Z",
    "supportedProviders": [{ "id": "VODACOM_TZ", "name": "M-Pesa" }, { "id": "AIRTEL_TZ", "name": "Airtel Money" }]
  }
}`,
    },
    webhook_payload: {
      title: 'POST /api/webhooks/reignova-pay',
      code: `// Verification & Raw Payload Handling
import { verifyWebhookSignature } from '@reignova/pay-sdk';

export async function POST(req: Request) {
  const signature = req.headers.get('x-reignova-signature');
  const rawBody = await req.text();
  
  const isValid = verifyWebhookSignature(rawBody, signature, process.env.WEBHOOK_SECRET);
  if (!isValid) return new Response('Invalid Signature', { status: 401 });

  const event = JSON.parse(rawBody);
  // Handle event.type === 'checkout.completed'
}`,
      response: `{
  "event": "checkout.completed",
  "publicToken": "chk_live_9f82ab411e72",
  "reference": "EVT-2026-9921",
  "amount": 25000,
  "currency": "TZS",
  "depositId": "pawapay_dep_88921a",
  "provider": "VODACOM_TZ",
  "timestamp": "${new Date().toISOString()}"
}`,
    },
    payment_status: {
      title: 'GET /checkouts/public/chk_live_9f82ab411e72/status',
      code: `const status = await getCheckoutStatus("chk_live_9f82ab411e72");
console.log("Current session status:", status);`,
      response: `{
  "success": true,
  "data": {
    "status": "${simulatedStatus}",
    "depositId": "pawapay_dep_88921a",
    "failureReason": null,
    "failureCode": null
  }
}`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulatedStatus('PENDING');
    setTimeout(() => {
      setSimulatedStatus('WAITING_PAYMENT');
      setTimeout(() => {
        setSimulatedStatus('COMPLETED');
        setIsSimulating(false);
      }, 1200);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 circuit-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-800 text-xs font-semibold">
              <Zap className="size-3.5 text-amber-600" />
              <span>Unified Payment Engine v1.0 • pawaPay Integration</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Payment Infrastructure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-amber-600 to-amber-700">
                Built for Reignova
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Integrate secure hosted checkouts, payment processing, webhooks, and transaction management through a centralized payment infrastructure built for Reignova products.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-sm px-6 py-2.5 rounded-xl shadow-md gap-2"
              >
                <Link href="/docs">
                  <span>Explore Documentation</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white hover:bg-slate-50 text-slate-800 border-slate-300 font-semibold text-sm px-5 py-2.5 rounded-xl gap-2 shadow-sm hover:border-amber-500"
              >
                <Link href="/admin">
                  <Shield className="size-4 text-amber-600" />
                  <span>Open Admin Portal</span>
                </Link>
              </Button>
            </div>

            {/* Quick stats / Features badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Server className="size-4 text-amber-600 shrink-0" />
                <span>Service-to-Service API</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Lock className="size-4 text-emerald-600 shrink-0" />
                <span>Hosted Checkouts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <RefreshCw className="size-4 text-sky-600 shrink-0" />
                <span>Live Webhooks</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Dark Code Box for high contrast on light mode */}
          <div className="lg:col-span-6">
            <div className="bg-[#0F1A25] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#131E2A] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-rose-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-300 flex items-center gap-1.5">
                    <Terminal className="size-3 text-amber-400" />
                    {snippets[activeTab].title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 disabled:opacity-50 transition-colors"
                  >
                    <Play className={`size-3 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? 'Processing...' : 'Simulate Call'}</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Copy request"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Request / Response Tab Selector */}
              <div className="flex border-b border-slate-800 bg-[#0A121A]/60 px-2 pt-2 gap-1 text-xs">
                <button
                  onClick={() => setActiveTab('create_checkout')}
                  className={`px-3 py-1.5 rounded-t-lg font-mono font-medium transition-colors ${
                    activeTab === 'create_checkout'
                      ? 'bg-[#0F1A25] text-amber-400 border-t-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Checkout
                </button>
                <button
                  onClick={() => setActiveTab('payment_status')}
                  className={`px-3 py-1.5 rounded-t-lg font-mono font-medium transition-colors ${
                    activeTab === 'payment_status'
                      ? 'bg-[#0F1A25] text-amber-400 border-t-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Check Status
                </button>
                <button
                  onClick={() => setActiveTab('webhook_payload')}
                  className={`px-3 py-1.5 rounded-t-lg font-mono font-medium transition-colors ${
                    activeTab === 'webhook_payload'
                      ? 'bg-[#0F1A25] text-amber-400 border-t-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Webhook Event
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className="p-4 font-mono text-xs overflow-x-auto space-y-3 bg-[#0A121A]/80">
                <div>
                  <span className="text-slate-500 font-bold select-none">// REQUEST</span>
                  <pre className="text-slate-300 mt-1 leading-relaxed">
                    <code>{snippets[activeTab].code}</code>
                  </pre>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold select-none">// RESPONSE (200 OK)</span>
                    <Badge variant="outline" className={`text-[10px] font-mono ${
                      simulatedStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                      simulatedStatus === 'WAITING_PAYMENT' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      STATUS: {simulatedStatus}
                    </Badge>
                  </div>
                  <pre className="text-amber-300/90 mt-1 leading-relaxed">
                    <code>{snippets[activeTab].response}</code>
                  </pre>
                </div>
              </div>

              {/* Status bar */}
              <div className="px-4 py-2 bg-[#131E2A] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>API Base: https://pay.reignovatechnologies.com/api/v1</span>
                </span>
                <span className="text-slate-500">v1.0.0</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
