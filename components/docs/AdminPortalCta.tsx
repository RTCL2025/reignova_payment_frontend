'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, ArrowRight, LayoutDashboard, Receipt, CreditCard, Webhook, Network, Key, CheckCircle, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const ADMIN_FEATURES = [
  { name: 'Dashboard', icon: LayoutDashboard, status: 'Available' },
  { name: 'Transactions', icon: Receipt, status: 'Available' },
  { name: 'Checkouts', icon: CreditCard, status: 'Available' },
  { name: 'Payment Attempts', icon: Shield, status: 'Available' },
  { name: 'Webhooks', icon: Webhook, status: 'Available' },
  { name: 'Providers', icon: Network, status: 'Available' },
  { name: 'API Keys', icon: Key, status: 'Available' },
  { name: 'Reconciliation', icon: CheckCircle, status: 'Available' },
  { name: 'Audit Logs', icon: FileText, status: 'Available' },
  { name: 'System Settings', icon: Settings, status: 'Available' },
];

export function AdminPortalCta() {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden circuit-pattern">
      {/* Glow background circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-b from-amber-50/90 via-white to-slate-50 border border-amber-300/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          {/* Top protected area badge */}
          <div className="flex items-center justify-between pb-6 border-b border-amber-200/80">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-mono text-xs gap-1.5 py-1 px-3">
                <Lock className="size-3 text-amber-700" />
                <span>Protected Application Area</span>
              </Badge>
              <span className="hidden sm:inline-block text-xs font-mono text-slate-500">
                Requires Merchant API Authentication
              </span>
            </div>
            <span className="text-xs font-mono text-amber-800 font-bold">
              Admin Gateway v1.0
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Manage Your Payment Infrastructure
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Monitor transactions, inspect checkouts, manage integrations, review payment events, and configure your payment environment from the Reignova Payment Service Admin Portal.
              </p>

              {/* Action Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-extrabold text-sm px-8 py-3 rounded-xl shadow-md gap-2"
                >
                  <Link href="/admin">
                    <Shield className="size-4" />
                    <span>Open Admin Portal</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                
                <span className="text-xs text-slate-500 font-mono">
                  Direct Route: <code className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">/admin</code>
                </span>
              </div>
            </div>

            {/* Right Chips Grid */}
            <div className="lg:col-span-5">
              <span className="text-xs font-mono text-slate-500 uppercase font-bold block mb-3">
                Admin Portal Capabilities
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {ADMIN_FEATURES.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.name}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 hover:border-amber-400 transition-colors shadow-sm"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-800">
                        {feat.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
