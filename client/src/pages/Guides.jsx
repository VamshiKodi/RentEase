import React from 'react';

const Guides = () => {
  const guides = [
    {
      title: 'Owner: Creating high-converting listings',
      points: [
        'Write clear, honest titles and descriptions.',
        'Upload bright, well-framed photos of every key room.',
        'Highlight amenities and nearby landmarks renters care about.',
      ],
    },
    {
      title: 'Renter: Shortlisting and comparing properties',
      points: [
        'Use filters for budget, BHK, and furnishing first.',
        'Save a shortlist of 3–5 serious options instead of browsing endlessly.',
        'Compare location, amenities, and total cost of moving.',
      ],
    },
    {
      title: 'Using GPS-based nearby search effectively',
      points: [
        'Enable location only when you want hyper-local results.',
        'Look at distance and rent together to decide trade-offs.',
        'Use it after work or college to see realistic commute times.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-luxury-700 text-white p-8 sm:p-10 shadow-luxury">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
            Guides
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-3">
            Make the most of RentEase
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            Step-by-step guidance on using RentEase as an owner or renter, plus tips for getting
            the best results from our GPS-powered features.
          </p>
        </div>

        <div className="space-y-6">
          {guides.map((guide) => (
            <div
              key={guide.title}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 mb-3">
                {guide.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                {guide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guides;
