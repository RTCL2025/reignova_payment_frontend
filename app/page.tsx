import React from 'react';
import { Header } from '@/components/docs/Header';
import { HeroSection } from '@/components/docs/HeroSection';
import { CapabilityGrid } from '@/components/docs/CapabilityGrid';
import { DocOverviewSection } from '@/components/docs/DocOverviewSection';
import { QuickstartSection } from '@/components/docs/QuickstartSection';
import { ApiCodeExplorer } from '@/components/docs/ApiCodeExplorer';
import { CheckoutLifecycle } from '@/components/docs/CheckoutLifecycle';
import { WebhookPreview } from '@/components/docs/WebhookPreview';
import { AdminPortalCta } from '@/components/docs/AdminPortalCta';
import { Footer } from '@/components/docs/Footer';

export const metadata = {
  title: 'Reignova Payment Service — Developer Portal & Documentation',
  description: 'Centralized payment infrastructure built for Reignova products. Hosted checkouts, mobile money payment processing via pawaPay, API references, and webhooks.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#F3A221] selection:text-slate-950">
      
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Platform Capabilities */}
        <CapabilityGrid />

        {/* 4. Documentation Overview */}
        <DocOverviewSection />

        {/* 5. Quickstart Guide */}
        <QuickstartSection />

        {/* 6. Interactive API Explorer */}
        <ApiCodeExplorer />

        {/* 7. Checkout Lifecycle State Machine */}
        <CheckoutLifecycle />

        {/* 8. Webhook Specification & Signatures */}
        <WebhookPreview />

        {/* 9. Protected Admin Portal CTA */}
        <AdminPortalCta />
      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
