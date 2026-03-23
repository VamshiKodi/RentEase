import React from 'react';
import { Star, Mail } from 'lucide-react';

const Press = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-primary-600 via-luxury-600 to-accent-500 text-white p-8 sm:p-10 shadow-luxury relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-20" aria-hidden="true"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
                Press & media
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black mb-3">
                Tell the RentEase story
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
                We are on a mission to make renting homes in India transparent, digital, and
                commission-free. For interviews, product demos, or data requests, our media team
                is happy to help.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-xs sm:text-sm text-white/90 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span className="font-mono">press@homelink.com</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-luxury p-6 sm:p-8">
            <div className="inline-flex items-center rounded-2xl bg-primary-50 text-primary-600 p-3 mb-4">
              <Star className="h-5 w-5" />
              <span className="ml-2 text-xs font-semibold tracking-wide uppercase">About the brand</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3">
              RentEase is a digital rental marketplace that connects owners & tenants directly.
              Our platform combines verified listings, rich property details, and
              location-aware search to make finding a home as seamless as booking a cab.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              We focus on tier-1 and tier-2 Indian cities, with a product designed for mobile-first
              users who expect clarity, speed, and trust in every interaction.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Media contact
              </p>
              <p className="mb-1">
                Email: <span className="font-mono">press@homelink.com</span>
              </p>
              <p>We typically respond within 1-2 business days.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                What we can share</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Product screenshots and branding guidelines.</li>
                <li>Founding story and leadership bios.</li>
                <li>High-level metrics and market insights where available.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
