'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Webhook, ShieldCheck, RefreshCw, Copy, Check, ArrowRight, Layers, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WebhookPreview() {
  const [copied, setCopied] = useState(false);

  const webhookVerificationCode = `import crypto from 'crypto';

// Express or Next.js App Router API Route
export async function POST(req: Request) {
  // 1. Extract signature from x-reignova-signature header
  const signature = req.headers.get('x-reignova-signature');
  if (!signature) {
    return new Response('Missing Signature', { status: 401 });
  }

  // 2. Read raw unparsed body string (Do NOT parse JSON first)
  const rawBody = await req.text();
  const secret = process.env.REIGNOVA_WEBHOOK_SECRET!;

  // 3. Compute expected HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // 4. Perform timing-safe signature comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    return new Response('Invalid Webhook Signature', { status: 401 });
  }

  // 5. Parse event payload safely & handle idempotency
  const event = JSON.parse(rawBody);
  console.log(\`Received verified event: \${event.event}\`, event.data);

  // Return HTTP 200 OK to acknowledge receipt
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookVerificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
            Real-Time Notifications
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Webhook Delivery & Signature Verification
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Process payment status updates asynchronously with cryptographic signature verification and built-in duplicate event suppression.
          </p>
        </div>

        {/* Conceptual Architecture Diagram */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-12 shadow-sm">
          <span className="text-xs font-mono text-slate-500 uppercase font-bold block mb-4 text-center">
            Webhook Event Dispatch Architecture
          </span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center text-xs font-mono">
            
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
              <span className="text-amber-700 block font-bold mb-1">Mobile Provider</span>
              <span className="text-[11px] text-slate-500">Vodacom / Airtel</span>
            </div>

            <div className="hidden md:flex justify-center text-amber-600">
              <ArrowRight className="size-5 animate-pulse" />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold">
              <span>Reignova Pay Engine</span>
              <span className="text-[10px] text-slate-600 block font-normal mt-0.5">Signs with HMAC-SHA256</span>
            </div>

            <div className="hidden md:flex justify-center text-amber-600">
              <ArrowRight className="size-5 animate-pulse" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-emerald-700 font-bold">
              <span>ReignovaEvents Backend</span>
              <span className="text-[10px] text-slate-500 block font-normal mt-0.5">Fulfills Ticket Order</span>
            </div>

          </div>
        </div>

        {/* Two-Column Explanation & Code Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Requirements & Principles */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 shrink-0 mt-0.5">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">HMAC-SHA256 Verification</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Every webhook payload is signed with your merchant secret key. Always compute signature over the raw body string to prevent tampering.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 shrink-0 mt-0.5">
                  <FileCode className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Raw Request Body Requirement</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Do not parse incoming JSON before computing the HMAC digest. Automatic middleware body parsers alter whitespace and key ordering, breaking signature verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 shrink-0 mt-0.5">
                  <RefreshCw className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Idempotency & Duplicate Events</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    The payment service retries unacknowledged notifications up to 5 times. Store processed deposit IDs in your database to handle duplicate callbacks safely.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                asChild
                className="bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-xs gap-1.5"
              >
                <Link href="/docs/webhooks">
                  <span>View Full Webhook Specification</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

          </div>

          {/* Right Column: TypeScript Verification Code Box */}
          <div className="lg:col-span-7 bg-[#0A121A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-[#131E2A] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Webhook className="size-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  verify-webhook.ts
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 font-mono text-xs text-amber-300/90 overflow-x-auto bg-[#0A121A] leading-relaxed">
              <code>{webhookVerificationCode}</code>
            </pre>

            <div className="px-4 py-2.5 bg-[#131E2A] border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Header: x-reignova-signature</span>
              <span className="text-emerald-400">Node.js / Next.js / Express Ready</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
