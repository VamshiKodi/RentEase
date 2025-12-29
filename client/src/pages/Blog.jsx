import React from 'react';
import { PenSquare } from 'lucide-react';

const Blog = () => {
  const placeholders = [
    {
      badge: 'For renters',
      title: 'Finding the right neighborhood in a new city',
      desc: 'How to shortlist areas based on commute, budget, and lifestyle using RentEase filters and nearby search.',
    },
    {
      badge: 'For owners',
      title: 'Creating listings that stand out',
      desc: 'Tips on photos, pricing, amenities, and location so your property attracts serious tenants.',
    },
    {
      badge: 'Product updates',
      title: 'GPS-based nearby homes explained',
      desc: 'A behind-the-scenes look at how our geospatial search works and how we keep your location private.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-luxury-700 text-white p-8 sm:p-10 shadow-luxury flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
              Blog
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-black mb-3">
              Stories and ideas from RentEase
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
              Coming soon: practical advice for renters, playbooks for owners, and deep dives into
              how we build the RentEase product.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-xs sm:text-sm text-white/90 flex items-center">
            <PenSquare className="h-4 w-4 mr-2" />
            <span>We are curating our first set of articles.</span>
          </div>
        </div>

        {/* Placeholder articles */}
        <div className="grid gap-6 md:grid-cols-3">
          {placeholders.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">
                  {item.badge}
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <p className="mt-4 text-xs text-slate-400">Article coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
