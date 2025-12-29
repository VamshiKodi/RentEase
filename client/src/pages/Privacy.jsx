import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-luxury-700 text-white p-8 sm:p-10 shadow-luxury">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
            Privacy
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-3">
            Your data, handled with care
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            We collect only the information needed to provide and improve RentEase, and we treat
            your personal data with respect.
          </p>
        </div>

        <div className="space-y-6 bg-white rounded-3xl border border-slate-100 shadow-luxury p-6 sm:p-8 text-sm text-slate-700">
          <section>
            <h2 className="text-base font-display font-bold text-slate-900 mb-1">What we collect</h2>
            <p>
              We may collect basic details like your name, email, phone number, and information
              about the properties you view or list. This helps us run the platform securely and
              improve the experience over time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-display font-bold text-slate-900 mb-1">Location data</h2>
            <p className="mb-2">
              Location access is always optional. We only use your device location to show nearby
              homes or help owners set accurate property coordinates. You can disable location
              access at any time from your browser or device settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-display font-bold text-slate-900 mb-1">Contacting us</h2>
            <p>
              For any privacy-related questions or requests, write to
              <span className="font-mono"> privacy@rentease.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
