'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { BookOpen, ShieldCheck, CreditCard, ArrowLeftRight, Webhook, Network, AlertCircle, TestTube, Code2, ChevronRight, Menu, X, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

export interface DocsLayoutProps {
  children: React.ReactNode;
  breadcrumbs: { title: string; href?: string }[];
  title: string;
  description?: string;
  toc?: TocItem[];
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

export const SIDEBAR_NAV = [
  {
    category: 'Getting Started',
    icon: BookOpen,
    items: [
      { title: 'Overview & Architecture', href: '/docs' },
      { title: 'Quickstart Setup', href: '/docs/getting-started' },
      { title: 'API Authentication', href: '/docs/authentication' },
    ],
  },
  {
    category: 'Checkouts',
    icon: CreditCard,
    items: [
      { title: 'Hosted Checkouts Guide', href: '/docs/checkouts' },
    ],
  },
  {
    category: 'Payments',
    icon: ArrowLeftRight,
    items: [
      { title: 'Payment Processing', href: '/docs/payments' },
    ],
  },
  {
    category: 'Webhooks',
    icon: Webhook,
    items: [
      { title: 'Webhooks & HMAC Signatures', href: '/docs/webhooks' },
    ],
  },
  {
    category: 'Providers',
    icon: Network,
    items: [
      { title: 'Mobile Money Providers', href: '/docs/providers' },
    ],
  },
  {
    category: 'Errors & Troubleshooting',
    icon: AlertCircle,
    items: [
      { title: 'Errors & Failure Codes', href: '/docs/errors' },
    ],
  },
  {
    category: 'Testing & Sandbox',
    icon: TestTube,
    items: [
      { title: 'Sandbox Environment', href: '/docs/testing' },
    ],
  },
  {
    category: 'API Reference',
    icon: Code2,
    items: [
      { title: 'Interactive API Reference', href: '/docs/api-reference' },
    ],
  },
];

export function DocsLayout({
  children,
  breadcrumbs,
  title,
  description,
  toc = [],
  prevPage,
  nextPage,
}: DocsLayoutProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      {/* Main Documentation Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col md:flex-row gap-8 py-8">
        
        {/* Mobile Sidebar Toggle Button */}
        <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-sm"
          >
            <Menu className="size-4 text-amber-600" />
            <span>Documentation Sidebar Menu</span>
          </button>
          <span className="text-xs font-mono text-amber-700 font-bold">Reignova Docs</span>
        </div>

        {/* Left Navigation Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          {SIDEBAR_NAV.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.category} className="space-y-2">
                <div className="flex items-center gap-2 px-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  <Icon className="size-3.5 text-amber-600" />
                  <span>{section.category}</span>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold'
                            : 'text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {isActive && <ChevronRight className="size-3 text-amber-600 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Mobile Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex md:hidden">
            <div className="w-80 max-w-[85vw] bg-white h-full p-6 overflow-y-auto space-y-6 border-r border-slate-200 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Documentation Navigation</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="size-5" />
                </button>
              </div>

              {SIDEBAR_NAV.map((section) => (
                <div key={section.category} className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    {section.category}
                  </span>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs ${
                            isActive ? 'bg-[#F3A221] text-slate-950 font-bold' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Main Article Content */}
        <main className="flex-1 min-w-0 space-y-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={b.title}>
                {i > 0 && <span>/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-slate-900">{b.title}</Link>
                ) : (
                  <span className="text-amber-700 font-semibold">{b.title}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Article Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {/* Main Article Body */}
          <article className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">
            {children}
          </article>

          {/* Page Pagination Links (Prev / Next) */}
          <div className="pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevPage ? (
              <Link
                href={prevPage.href}
                className="w-full sm:w-auto p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-left transition-all shadow-sm group"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Previous Article</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 flex items-center gap-1 mt-0.5">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>{prevPage.title}</span>
                </span>
              </Link>
            ) : <div />}

            {nextPage && (
              <Link
                href={nextPage.href}
                className="w-full sm:w-auto p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-right transition-all shadow-sm group ml-auto"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Next Article</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 flex items-center justify-end gap-1 mt-0.5">
                  <span>{nextPage.title}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </div>

        </main>

        {/* Right Sidebar: On-this-page Table of Contents (TOC) */}
        {toc.length > 0 && (
          <aside className="hidden lg:block w-56 shrink-0 self-start sticky top-24 space-y-4 border-l border-slate-200 pl-4 text-xs">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              On This Page
            </span>
            <nav className="space-y-2 font-mono">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-slate-500 hover:text-amber-700 transition-colors truncate"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

      </div>

      <Footer />
    </div>
  );
}
