'use client';

import React from 'react';
import Link from 'next/link';
import { ReignovaLogo } from '@/components/brand/ReignovaLogo';
import { Shield, ExternalLink, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <ReignovaLogo size={32} showText={true} textClassName="text-slate-900" />
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Centralized payment infrastructure platform developed by Reignova Technologies. Powering hosted checkouts, mobile money processing via pawaPay, and real-time webhook delivery for Reignova products.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 font-mono text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                <Shield className="size-3.5 text-amber-700" />
                <span>Protected Admin Gateway</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="hover:text-amber-700 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference" className="hover:text-amber-700 transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-700 transition-colors flex items-center gap-1">
                  <span>Admin Portal</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono">Protected</span>
                </Link>
              </li>
              <li>
                <Link href="/docs/testing" className="hover:text-amber-700 transition-colors">
                  Sandbox & Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/getting-started" className="hover:text-amber-700 transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/authentication" className="hover:text-amber-700 transition-colors">
                  Authentication & Keys
                </Link>
              </li>
              <li>
                <Link href="/docs/checkouts" className="hover:text-amber-700 transition-colors">
                  Hosted Checkouts
                </Link>
              </li>
              <li>
                <Link href="/docs/webhooks" className="hover:text-amber-700 transition-colors">
                  Webhooks & Signatures
                </Link>
              </li>
              <li>
                <Link href="/docs/providers" className="hover:text-amber-700 transition-colors">
                  Mobile Money Providers
                </Link>
              </li>
              <li>
                <Link href="/docs/errors" className="hover:text-amber-700 transition-colors">
                  Error Code Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Company & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://reignovatechnologies.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>Reignova Technologies</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Security Infrastructure</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            © Reignova Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Reignova Products</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">pawaPay Integration</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
