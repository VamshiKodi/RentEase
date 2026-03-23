import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-luxury-700 text-white p-8 sm:p-10 shadow-luxury">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80 mb-3">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-3">
            We would love to hear from you
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            Reach out for product questions, partnership ideas, or issues with a specific
            listing. Our team is here to help.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-luxury p-6 sm:p-8 text-sm text-slate-700">
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-3">
              Support & feedback
            </h2>
            <p className="mb-3">
              For any questions about how RentEase works, issues with your account, or feedback
              about the product experience, drop us a message with as much detail as possible.
            </p>
            <p className="mb-3">
              If you are writing about a specific property, please include the property link or
              ID so we can investigate faster.
            </p>
            <p className="text-xs text-slate-500">
              We typically respond within <span className="font-semibold">24–48 business hours</span>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-sm text-slate-700">
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-900">Email</span>
              </div>
              <p className="font-mono">support@homelink.com</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-sm text-slate-700">
              <div className="flex items-center mb-2">
                <Phone className="h-4 w-4 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-900">Phone</span>
              </div>
              <p className="font-mono">+91 98765 43210</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-sm text-slate-700">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 text-primary-600 mr-2" />
                <span className="font-semibold text-slate-900">Location</span>
              </div>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
