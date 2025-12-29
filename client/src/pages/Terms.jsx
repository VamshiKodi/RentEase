import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-luxury-700 text-white p-8 sm:p-10 shadow-luxury">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
            Terms of service
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-3">
            Using RentEase responsibly
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            These terms outline the basic rules for using the RentEase platform. Please read them
            carefully before creating an account or listing a property.
          </p>
        </div>

        <div className="space-y-8 bg-white rounded-3xl border border-slate-100 shadow-luxury p-6 sm:p-8 text-sm text-slate-700">
          <section>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-2">Platform role</h2>
            <p>
              RentEase acts as a technology platform that connects property owners and renters. We
              do not own, manage, or operate the properties listed on the platform, and we are not
              a party to rental agreements between users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-2">User responsibilities</h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Provide accurate, up-to-date information in profiles and listings.</li>
              <li>
                Comply with applicable laws, housing regulations, and society rules when renting
                or listing properties.
              </li>
              <li>
                Handle all payments, deposits, and legal agreements directly with the other party.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-display font-bold text-slate-900 mb-2">Content & moderation</h2>
            <p className="mb-2">
              We may modify or remove content that is fraudulent, abusive, or violates our
              policies or applicable laws. Repeated violations may result in account suspension.
            </p>
            <p className="text-xs text-slate-500">
              This is a simplified summary for easy reading and does not replace a full legal
              agreement. For specific legal advice, please consult a professional.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
