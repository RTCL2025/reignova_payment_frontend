"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Globe,
  Zap,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Terminal,
  Check,
  Copy,
  Activity,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// Types & Data Model
// ============================================================================

export type StepStatusType = "emerald" | "amber" | "sky" | "purple";

export interface StepInfo {
  id: number;
  stepNumber: string;
  title: string;
  shortTitle: string;
  sourceNodeId: "merchant" | "gateway" | "pawapay" | "customer";
  targetNodeId: "merchant" | "gateway" | "pawapay" | "customer";
  endpoint: string;
  method: "POST" | "GET" | "USSD" | "WEBHOOK";
  latency: string;
  accumulatedTime: string;
  status: string;
  statusType: StepStatusType;
  provider: string;
  description: string;
  payload: string;
}

export const FLOW_STEPS: StepInfo[] = [
  {
    id: 1,
    stepNumber: "01",
    title: "1. Merchant Initiates Checkout",
    shortTitle: "Create Session",
    sourceNodeId: "merchant",
    targetNodeId: "gateway",
    endpoint: "/checkouts/public",
    method: "POST",
    latency: "45ms",
    accumulatedTime: "45ms",
    status: "201 CREATED",
    statusType: "amber",
    provider: "API Gateway",
    description:
      "Merchant backend issues authenticated REST request to generate a hosted checkout session token.",
    payload: `{\n  "amount": 25000,\n  "currency": "TZS",\n  "reference": "EVT-2026-9921",\n  "merchantSlug": "reignova-events",\n  "returnUrl": "https://events.reignovatechnologies.com/checkout/success"\n}`,
  },
  {
    id: 2,
    stepNumber: "02",
    title: "2. Session Token & Hosted URL",
    shortTitle: "Token Issued",
    sourceNodeId: "gateway",
    targetNodeId: "merchant",
    endpoint: "chk_live_9f82ab411e72",
    method: "POST",
    latency: "18ms",
    accumulatedTime: "63ms",
    status: "PENDING_PAYMENT",
    statusType: "sky",
    provider: "Reignova Engine",
    description:
      "Gateway generates a signed checkout session token and returns the secure hosted checkout URL.",
    payload: `{\n  "success": true,\n  "data": {\n    "publicToken": "chk_live_9f82ab411e72",\n    "checkoutUrl": "https://pay.reignovatechnologies.com/checkout/chk_live_9f82ab411e72",\n    "expiresAt": "2026-09-23T21:45:00Z"\n  }\n}`,
  },
  {
    id: 3,
    stepNumber: "03",
    title: "3. PawaPay USSD Push Dispatch",
    shortTitle: "USSD Push",
    sourceNodeId: "gateway",
    targetNodeId: "pawapay",
    endpoint: "/pawapay/deposits",
    method: "POST",
    latency: "120ms",
    accumulatedTime: "183ms",
    status: "USSD_PUSHED",
    statusType: "purple",
    provider: "PawaPay Gateway",
    description:
      "Gateway forwards deposit request to PawaPay aggregator to dispatch mobile-money USSD prompt.",
    payload: `{\n  "depositId": "pawapay_dep_88921a",\n  "phoneNumber": "255754XXXXXX",\n  "provider": "VODACOM_TZ",\n  "amount": "25000.00"\n}`,
  },
  {
    id: 4,
    stepNumber: "04",
    title: "4. Customer PIN Authorization",
    shortTitle: "PIN Verification",
    sourceNodeId: "customer",
    targetNodeId: "pawapay",
    endpoint: "USSD Session (M-Pesa)",
    method: "USSD",
    latency: "1.2s",
    accumulatedTime: "1.38s",
    status: "DEPOSIT_SUCCESS",
    statusType: "emerald",
    provider: "Vodacom M-Pesa",
    description:
      "Customer inputs secret PIN on mobile screen. Telco network validates funds and settles transaction.",
    payload: `{\n  "status": "COMPLETED",\n  "payerMobile": "+255754XXXXXX",\n  "financialTransactionId": "99A12089X"\n}`,
  },
  {
    id: 5,
    stepNumber: "05",
    title: "5. Real-time Signed Webhook",
    shortTitle: "Webhook",
    sourceNodeId: "gateway",
    targetNodeId: "merchant",
    endpoint: "/api/webhooks/reignova",
    method: "WEBHOOK",
    latency: "65ms",
    accumulatedTime: "1.45s",
    status: "HMAC_VERIFIED",
    statusType: "emerald",
    provider: "Reignova Webhooks",
    description:
      "Gateway signs event body with HMAC-SHA256 secret and dispatches webhook to unlock order.",
    payload: `{\n  "event": "checkout.completed",\n  "publicToken": "chk_live_9f82ab411e72",\n  "amount": 25000,\n  "status": "COMPLETED",\n  "signature": "sha256=e3b0c44298fc1c149afbf4c8996fb924..."\n}`,
  },
];

// ============================================================================
// Helper Component: Clean JSON Syntax Highlighter
// ============================================================================

function HighlightedJSON({ code }: { code: string }) {
  const lines = code.split("\n");

  return (
    <div className="font-mono text-[11px] leading-relaxed select-text">
      {lines.map((line, lineIdx) => {
        const keyMatch = line.match(/^(\s*)("[^"]+"):/);
        const stringValMatch = line.match(/:\s*("[^"]*")/);
        const numberValMatch = line.match(/:\s*([0-9.]+)/);
        const boolValMatch = line.match(/:\s*(true|false|null)/);

        return (
          <div key={lineIdx} className="flex hover:bg-white/[0.03] px-1 rounded transition-colors">
            <span className="w-5 shrink-0 text-slate-600 text-[10px] select-none text-right pr-2 font-mono">
              {lineIdx + 1}
            </span>
            <span className="text-slate-300 truncate">
              {keyMatch ? (
                <>
                  <span>{keyMatch[1]}</span>
                  <span className="text-amber-400 font-semibold">{keyMatch[2]}</span>
                  <span>:</span>
                  <span>{line.slice(keyMatch[0].length)}</span>
                </>
              ) : stringValMatch ? (
                <span>
                  {line.split(stringValMatch[1])[0]}
                  <span className="text-emerald-300">{stringValMatch[1]}</span>
                  {line.split(stringValMatch[1])[1]}
                </span>
              ) : numberValMatch ? (
                <span>
                  {line.split(numberValMatch[1])[0]}
                  <span className="text-sky-300 font-semibold">{numberValMatch[1]}</span>
                  {line.split(numberValMatch[1])[1]}
                </span>
              ) : boolValMatch ? (
                <span>
                  {line.split(boolValMatch[1])[0]}
                  <span className="text-purple-300 font-semibold">{boolValMatch[1]}</span>
                  {line.split(boolValMatch[1])[1]}
                </span>
              ) : (
                <span>{line}</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Subcomponent 1: Header Toolbar
// ============================================================================

function ArchitectureHeader({
  isPlaying,
  onTogglePlay,
  onReset,
  activeStep,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  activeStep: StepInfo;
}) {
  return (
    <div className="px-3.5 py-2.5 bg-[#131E2A] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 z-10 relative">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0A121A] border border-slate-800">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-slate-200 tracking-wider">
            REIGNOVA
          </span>
        </div>
        <div className="h-3 w-px bg-slate-800 hidden sm:block" />
        <div>
          <h3 className="text-xs font-bold text-slate-100 font-mono tracking-tight">
            Payment Architecture
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {!isPlaying && (
          <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded font-semibold uppercase">
            PAUSED
          </span>
        )}

        <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">
          99.99% Uptime
        </span>

        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="size-3" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="size-3 fill-amber-300" />
              <span>Auto</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          aria-label="Reset simulation"
          className="p-1 rounded bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="size-3" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Subcomponent 2: Timeline Bar
// ============================================================================

function TransactionTimeline({
  steps,
  activeStepIdx,
  onSelectStep,
}: {
  steps: StepInfo[];
  activeStepIdx: number;
  onSelectStep: (idx: number) => void;
}) {
  return (
    <nav
      aria-label="Timeline"
      className="bg-[#0A121A]/95 border-b border-slate-800/80 px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none"
    >
      {steps.map((step, idx) => {
        const isActive = idx === activeStepIdx;
        const isCompleted = idx < activeStepIdx;

        return (
          <button
            key={step.id}
            onClick={() => onSelectStep(idx)}
            aria-current={isActive ? "step" : undefined}
            className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              isActive
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/50 font-bold"
                : isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {isCompleted ? (
              <Check className="size-2.5 text-emerald-400 shrink-0" />
            ) : isActive ? (
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            ) : (
              <span className="text-[9px] text-slate-500 font-mono">{step.stepNumber}</span>
            )}
            <span>{step.shortTitle}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ============================================================================
// Subcomponent 3: Compact Metrics Bar (Fixed Overflow)
// ============================================================================

function TransactionMetrics({ activeStep }: { activeStep: StepInfo }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#091118] border-b border-slate-800/80 px-3 py-1.5 text-[10px] font-mono">
      <div className="flex items-center justify-between bg-[#0F1A25]/60 px-2 py-0.5 rounded border border-slate-800/60 overflow-hidden">
        <span className="text-slate-500 truncate mr-1">TIME</span>
        <span className="text-amber-300 font-bold shrink-0">{activeStep.accumulatedTime}</span>
      </div>
      <div className="flex items-center justify-between bg-[#0F1A25]/60 px-2 py-0.5 rounded border border-slate-800/60 overflow-hidden">
        <span className="text-slate-500 truncate mr-1">STEP</span>
        <span className="text-slate-200 font-bold shrink-0">0{activeStep.id}/05</span>
      </div>
      <div className="flex items-center justify-between bg-[#0F1A25]/60 px-2 py-0.5 rounded border border-slate-800/60 overflow-hidden">
        <span className="text-slate-500 truncate mr-1">PROVIDER</span>
        <span className="text-sky-300 font-semibold truncate max-w-[80px] sm:max-w-[100px]">{activeStep.provider}</span>
      </div>
      <div className="flex items-center justify-between bg-[#0F1A25]/60 px-2 py-0.5 rounded border border-slate-800/60 overflow-hidden">
        <span className="text-slate-500 truncate mr-1">SECURITY</span>
        <span className="text-emerald-400 font-semibold shrink-0">HMAC VERIFIED</span>
      </div>
    </div>
  );
}

// ============================================================================
// Subcomponent 4: Compact Architecture Diagram Layout
// ============================================================================

function PaymentFlowDiagram({
  activeStep,
  onNodeClick,
}: {
  activeStep: StepInfo;
  onNodeClick: (nodeId: StepInfo["sourceNodeId"]) => void;
}) {
  const isNodeActive = (nodeKey: string) => {
    return activeStep.sourceNodeId === nodeKey || activeStep.targetNodeId === nodeKey;
  };

  return (
    <div className="p-3.5 relative min-h-[190px] flex flex-col justify-between bg-gradient-to-b from-[#0A121A]/80 via-[#0F1A25] to-[#0A121A] overflow-hidden">
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F3A221_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* SVG Connecting Paths Layer */}
      <svg className="absolute inset-0 size-full pointer-events-none z-0">
        <line
          x1="25%"
          y1="25%"
          x2="50%"
          y2="50%"
          stroke={activeStep.id === 1 || activeStep.id === 2 ? "#F3A221" : "#1E293B"}
          strokeWidth={activeStep.id === 1 || activeStep.id === 2 ? "2" : "1"}
          strokeDasharray={activeStep.id === 1 || activeStep.id === 2 ? "5,5" : "none"}
        />
        <line
          x1="50%"
          y1="50%"
          x2="75%"
          y2="25%"
          stroke={activeStep.id === 3 ? "#38BDF8" : "#1E293B"}
          strokeWidth={activeStep.id === 3 ? "2" : "1"}
          strokeDasharray={activeStep.id === 3 ? "5,5" : "none"}
        />
        <line
          x1="50%"
          y1="50%"
          x2="50%"
          y2="80%"
          stroke={activeStep.id === 4 ? "#10B981" : "#1E293B"}
          strokeWidth={activeStep.id === 4 ? "2" : "1"}
          strokeDasharray={activeStep.id === 4 ? "5,5" : "none"}
        />
        <line
          x1="50%"
          y1="50%"
          x2="25%"
          y2="25%"
          stroke={activeStep.id === 5 ? "#10B981" : "transparent"}
          strokeWidth={activeStep.id === 5 ? "2" : "0"}
          strokeDasharray={activeStep.id === 5 ? "4,4" : "none"}
        />
      </svg>

      {/* Top Node Row: Merchant App & PawaPay Aggregator */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {/* Node 1: Merchant App */}
        <div
          onClick={() => onNodeClick("merchant")}
          className={`p-2.5 rounded-lg border bg-[#131E2A]/95 transition-all shadow cursor-pointer ${
            isNodeActive("merchant")
              ? "border-amber-400/80 ring-1 ring-amber-400/30 shadow-[0_0_15px_rgba(243,162,33,0.15)]"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-amber-500/15 text-amber-400">
                <Globe className="size-3.5" />
              </div>
              <div className="truncate">
                <h4 className="text-[11px] font-bold text-white font-mono truncate">
                  Merchant App
                </h4>
                <p className="text-[9px] text-slate-400 truncate">Reignova Events</p>
              </div>
            </div>
            {isNodeActive("merchant") && (
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            )}
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-1 mt-1">
            <span>REST API</span>
            <span className="text-amber-400">HMAC SHA-256</span>
          </div>
        </div>

        {/* Node 2: PawaPay Aggregator */}
        <div
          onClick={() => onNodeClick("pawapay")}
          className={`p-2.5 rounded-lg border bg-[#131E2A]/95 transition-all shadow cursor-pointer ${
            isNodeActive("pawapay")
              ? "border-sky-400/80 ring-1 ring-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-sky-500/15 text-sky-400">
                <Cpu className="size-3.5" />
              </div>
              <div className="truncate">
                <h4 className="text-[11px] font-bold text-white font-mono truncate">
                  PawaPay Aggregator
                </h4>
                <p className="text-[9px] text-slate-400 truncate">Mobile Money Gateway</p>
              </div>
            </div>
            {isNodeActive("pawapay") && (
              <span className="size-1.5 rounded-full bg-sky-400 animate-pulse shrink-0" />
            )}
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-1 mt-1">
            <span>Vodacom • Airtel</span>
            <span className="text-sky-400">USSD 2FA</span>
          </div>
        </div>
      </div>

      {/* Center Row: Gateway Centerpiece */}
      <div className="my-2 relative z-10 flex justify-center">
        <div
          onClick={() => onNodeClick("gateway")}
          className={`w-full max-w-sm p-2.5 rounded-lg border bg-gradient-to-r from-[#172535] via-[#131E2A] to-[#172535] transition-all shadow-md cursor-pointer ${
            isNodeActive("gateway")
              ? "border-amber-400/90 ring-1 ring-amber-400/30 shadow-[0_0_20px_rgba(243,162,33,0.15)]"
              : "border-slate-700 hover:border-slate-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Zap className="size-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[11px] font-extrabold text-white font-mono tracking-wide">
                    Reignova Payment Gateway
                  </h4>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[8px] px-1 py-0 font-mono">
                    v1.0
                  </Badge>
                </div>
                <p className="text-[9px] text-slate-400">
                  Central Orchestration Engine
                </p>
              </div>
            </div>
            {isNodeActive("gateway") && (
              <span className="size-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Customer Mobile Node */}
      <div className="flex justify-center relative z-10">
        <div
          onClick={() => onNodeClick("customer")}
          className={`w-full max-w-xs p-2 rounded-lg border bg-[#131E2A]/95 transition-all shadow cursor-pointer ${
            isNodeActive("customer")
              ? "border-emerald-400/80 ring-1 ring-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-500/15 text-emerald-400">
                <Smartphone className="size-3.5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white font-mono">
                  Customer Mobile
                </h4>
                <p className="text-[8px] text-slate-400">USSD PIN Authorization</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-mono bg-emerald-500/10 text-emerald-300 border-emerald-500/40 px-1 py-0"
            >
              PIN Entry
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Subcomponent 5: Compact Structured Transaction Inspector
// ============================================================================

function TransactionInspector({ activeStep }: { activeStep: StepInfo }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeStep.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 bg-[#0A121A] border-t border-slate-800 font-mono text-[11px]">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 truncate mr-2">
          <span className="text-[10px] font-bold text-slate-300 font-sans tracking-wide shrink-0">
            INSPECTOR:
          </span>
          <span className="text-[10px] text-amber-300 font-mono truncate">{activeStep.title}</span>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono bg-amber-500/10 text-amber-300 border-amber-500/40 shrink-0">
          {activeStep.status}
        </Badge>
      </div>

      <p className="text-[11px] text-slate-400 leading-snug font-sans mb-2">
        {activeStep.description}
      </p>

      {/* Code Viewer Panel (Max height capped at 120px to prevent visual stretching) */}
      <div className="rounded bg-[#060C12] border border-slate-800/90 overflow-hidden">
        <div className="flex items-center justify-between px-2.5 py-1 bg-[#0D1620] border-b border-slate-800 text-[9px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Terminal className="size-3 text-amber-400" />
            <span className="text-slate-300 font-bold uppercase">{activeStep.method} PAYLOAD</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-2.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-[9px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-2.5 text-slate-400" />
                <span className="text-[9px]">Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="p-2 max-h-28 overflow-y-auto overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.12 }}
            >
              <HighlightedJSON code={activeStep.payload} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Subcomponent 6: System Status Footer Bar
// ============================================================================

function SystemStatusBar() {
  return (
    <div className="px-3 py-1.5 bg-[#131E2A] border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-semibold uppercase tracking-wider">
          ALL SYSTEMS OPERATIONAL
        </span>
      </div>
      <span className="text-slate-500 font-bold">Reignova Payments</span>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PaymentArchitectureIllustration() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeStep = FLOW_STEPS[activeStepIdx];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleTogglePlay = () => setIsPlaying((prev) => !prev);
  const handleReset = () => {
    setActiveStepIdx(0);
    setIsPlaying(true);
  };
  const handleSelectStep = (idx: number) => {
    setActiveStepIdx(idx);
    setIsPlaying(false);
  };

  const handleNodeClick = (nodeId: StepInfo["sourceNodeId"]) => {
    const targetStepIdx = FLOW_STEPS.findIndex(
      (s) => s.sourceNodeId === nodeId || s.targetNodeId === nodeId
    );
    if (targetStepIdx !== -1) {
      handleSelectStep(targetStepIdx);
    }
  };

  return (
    <div className="bg-[#0F1A25] border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative font-sans max-w-full">
      <ArchitectureHeader
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        activeStep={activeStep}
      />
      <TransactionTimeline
        steps={FLOW_STEPS}
        activeStepIdx={activeStepIdx}
        onSelectStep={handleSelectStep}
      />
      <TransactionMetrics activeStep={activeStep} />
      <PaymentFlowDiagram
        activeStep={activeStep}
        onNodeClick={handleNodeClick}
      />
      <TransactionInspector activeStep={activeStep} />
      <SystemStatusBar />
    </div>
  );
}
