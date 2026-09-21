'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ShieldCheck, CreditCard, ArrowLeftRight, Webhook, Network, AlertCircle, TestTube, Code2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'Getting Started' | 'Authentication' | 'Checkouts' | 'Payments' | 'Webhooks' | 'Providers' | 'Errors' | 'Testing' | 'API Reference';
  href: string;
}

export const DOC_SEARCH_ITEMS: SearchItem[] = [
  {
    id: '1',
    title: 'Quickstart & Environment Setup',
    description: 'Learn how to configure base URLs, API keys, and make your first payment request.',
    category: 'Getting Started',
    href: '/docs/getting-started',
  },
  {
    id: '2',
    title: 'API Authentication & Headers',
    description: 'How to authenticate API requests using Bearer tokens and Admin-Api-Key headers.',
    category: 'Authentication',
    href: '/docs/authentication',
  },
  {
    id: '3',
    title: 'Hosted Checkout Lifecycle',
    description: 'Create checkout sessions, manage public tokens, redirects, and customer return flows.',
    category: 'Checkouts',
    href: '/docs/checkouts',
  },
  {
    id: '4',
    title: 'Payment Initiation & Statuses',
    description: 'Initiate mobile money payments, track deposit statuses, and handle idempotency keys.',
    category: 'Payments',
    href: '/docs/payments',
  },
  {
    id: '5',
    title: 'Webhooks & HMAC Signatures',
    description: 'Verify callback signatures, process raw request bodies, and handle duplicate notifications.',
    category: 'Webhooks',
    href: '/docs/webhooks',
  },
  {
    id: '6',
    title: 'Mobile Money Providers & pawaPay',
    description: 'Supported countries (TZ, KE, UG, GH, ZM), currencies, and provider-specific details.',
    category: 'Providers',
    href: '/docs/providers',
  },
  {
    id: '7',
    title: 'Errors & Failure Codes',
    description: 'HTTP status codes, provider failure mappings, retryable errors vs terminal failures.',
    category: 'Errors',
    href: '/docs/errors',
  },
  {
    id: '8',
    title: 'Sandbox Testing & Test Numbers',
    description: 'Test payment scenarios, mock deposit approvals, and simulated timeout responses.',
    category: 'Testing',
    href: '/docs/testing',
  },
  {
    id: '9',
    title: 'Interactive API Reference',
    description: 'Full REST API endpoint specifications for checkouts, payments, webhooks, and status checks.',
    category: 'API Reference',
    href: '/docs/api-reference',
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = DOC_SEARCH_ITEMS.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started': return <BookOpen className="size-4 text-amber-600" />;
      case 'Authentication': return <ShieldCheck className="size-4 text-emerald-600" />;
      case 'Checkouts': return <CreditCard className="size-4 text-sky-600" />;
      case 'Payments': return <ArrowLeftRight className="size-4 text-indigo-600" />;
      case 'Webhooks': return <Webhook className="size-4 text-purple-600" />;
      case 'Providers': return <Network className="size-4 text-rose-600" />;
      case 'Errors': return <AlertCircle className="size-4 text-orange-600" />;
      case 'Testing': return <TestTube className="size-4 text-teal-600" />;
      default: return <Code2 className="size-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="size-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, guides, API endpoints..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-500 bg-slate-200/80 rounded border border-slate-300 hover:text-slate-900"
          >
            ESC
          </button>
        </div>

        {/* Search Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="size-8 mx-auto mb-2 opacity-30 text-amber-600" />
              <p className="text-sm font-medium">No documentation found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;checkout&quot;, &quot;webhooks&quot;, or &quot;authentication&quot;</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                    idx === selectedIndex
                      ? 'bg-amber-50 border border-amber-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {item.title}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200 shrink-0">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-slate-400 self-center shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] text-slate-700">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] text-slate-700">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] text-slate-700">↵</kbd> to select</span>
          </div>
          <span className="text-amber-700 font-sans font-semibold">Reignova Payment Docs</span>
        </div>

      </div>
    </div>
  );
}
