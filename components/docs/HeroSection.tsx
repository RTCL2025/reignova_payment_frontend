"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  RefreshCw,
  Zap,
  Server,
  Lock,
  CheckCircle2,
  Cpu,
  Smartphone,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentArchitectureIllustration } from "@/components/docs/PaymentArchitectureIllustration";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-10 pb-14 lg:pt-14 lg:pb-20 border-b border-slate-200 circuit-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-sm"
            >
              <Zap className="size-3.5 text-amber-600 animate-pulse" />
              <span>Unified Payment Engine v1.0 • PawaPay Integration</span>
              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
            >
              Payment Infrastructure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-amber-600 to-amber-700">
                Built for Reignova
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal"
            >
              Integrate secure hosted checkouts, payment processing, webhooks,
              and transaction management through a centralized payment
              infrastructure built for Reignova products.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all gap-2 cursor-pointer"
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
                className="bg-white hover:bg-slate-50 text-slate-800 border-slate-300 font-semibold text-sm px-5 py-2.5 rounded-xl gap-2 shadow-sm hover:border-amber-500 transition-all cursor-pointer"
              >
                <Link href="/admin">
                  <Shield className="size-4 text-amber-600" />
                  <span>Open Admin Portal</span>
                </Link>
              </Button>
            </motion.div>

            {/* Supported Payment Channels Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500"
            >
              <span className="font-semibold text-slate-700 font-sans text-xs mr-1">
                Supported Networks:
              </span>
              <Badge variant="outline" className="bg-emerald-50/80 text-emerald-800 border-emerald-300 font-medium">
                M-Pesa
              </Badge>
              <Badge variant="outline" className="bg-rose-50/80 text-rose-800 border-rose-300 font-medium">
                Airtel Money
              </Badge>
              <Badge variant="outline" className="bg-sky-50/80 text-sky-800 border-sky-300 font-medium">
                Tigo Pesa
              </Badge>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 font-medium">
                Cards & Bank
              </Badge>
            </motion.div>

            {/* Feature Badges Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200 text-xs"
            >
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
            </motion.div>
          </div>

          {/* Right Hero Visual: Compact Animated Architecture Illustration */}
          <div className="lg:col-span-6">
            <PaymentArchitectureIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
