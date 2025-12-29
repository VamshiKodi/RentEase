import React from 'react';

const FAQ = () => {
  const items = [
    {
      question: 'Is RentEase free to use?',
      answer:
        'Yes, creating an account and browsing listings is free for both renters and owners. There is no brokerage charged by RentEase.',
    },
    {
      question: 'Do you charge any broker commission?',
      answer:
        'No. RentEase is a broker-free platform. We connect owners and tenants directly and do not take any commission on rent.',
    },
    {
      question: 'How does nearby homes using GPS work?',
      answer:
        'With your permission, we use your device location to run a geospatial search around you. We then show homes within a selected radius and display the approximate distance.',
    },
    {
      question: 'Can I use RentEase without sharing my location?',
      answer:
        'Absolutely. GPS-based search is optional. You can always search by city, locality, or landmark without enabling location.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-luxury-700 text-white p-8 sm:p-10 shadow-luxury">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
            FAQ
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-3">
            Frequently asked questions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            Quick answers to the most common questions from renters and owners using RentEase.
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.question}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-sm text-slate-700"
            >
              <p className="font-semibold text-slate-900 mb-1">{item.question}</p>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
