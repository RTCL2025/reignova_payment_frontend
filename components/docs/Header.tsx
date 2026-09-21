'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Shield, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { ReignovaLogo } from '@/components/brand/ReignovaLogo';
import { SearchModal } from './SearchModal';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [environment, setEnvironment] = useState<'Production' | 'Sandbox'>('Production');
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/docs/api-reference' },
    { name: 'Guides', href: '/docs/getting-started' },
    { name: 'Status', href: '/docs/testing' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left section: Logo & Product Label */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ReignovaLogo
                showText={false}
                size={32}
                className="transition-transform group-hover:scale-105"
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  Reignova <span className="text-[#D97706]">Pay</span>
                </span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono border border-slate-200">
                  Payment Service
                </span>
              </div>
            </Link>

            {/* Environment Badge Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsEnvDropdownOpen(!isEnvDropdownOpen)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:border-amber-500/50 transition-colors"
              >
                <span className={`size-1.5 rounded-full ${environment === 'Production' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{environment}</span>
                <ChevronDown className="size-3 text-slate-500" />
              </button>

              {isEnvDropdownOpen && (
                <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <button
                    onClick={() => { setEnvironment('Production'); setIsEnvDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Production
                    </span>
                    {environment === 'Production' && <Check className="size-3 text-amber-600" />}
                  </button>
                  <button
                    onClick={() => { setEnvironment('Sandbox'); setIsEnvDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Sandbox
                    </span>
                    {environment === 'Sandbox' && <Check className="size-3 text-amber-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center navigation links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#B45309] bg-amber-50 font-semibold border border-amber-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right section: Search & Admin Portal CTA */}
          <div className="flex items-center gap-2.5">
            {/* Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-900 text-xs transition-colors"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search docs...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-600 rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* Admin Portal Button */}
            <Button
              asChild
              size="sm"
              className="bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-xs rounded-lg shadow-sm gap-1.5"
            >
              <Link href="/admin">
                <Shield className="size-3.5" />
                <span>Admin Portal</span>
              </Link>
            </Button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-mono text-slate-500">Environment:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEnvironment('Production')}
                  className={`px-2 py-1 text-xs rounded ${environment === 'Production' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'text-slate-500'}`}
                >
                  Production
                </button>
                <button
                  onClick={() => setEnvironment('Sandbox')}
                  className={`px-2 py-1 text-xs rounded ${environment === 'Sandbox' ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'text-slate-500'}`}
                >
                  Sandbox
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Button
                asChild
                className="w-full bg-[#F3A221] hover:bg-[#E59210] text-[#0A121A] font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2"
              >
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="size-4" />
                  <span>Open Admin Portal</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
