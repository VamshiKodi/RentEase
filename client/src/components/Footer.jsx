import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How it Works', href: '/how-it-works' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety', href: '/safety' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Guides', href: '/guides' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-8 group">
              <div className="bg-primary-600 text-white p-2.5 rounded-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                <Home className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">RentEase</span>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest -mt-1">Premium Rentals</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed font-medium">
              Revolutionizing the rental experience with transparency, verification, and zero brokerage. Your dream home, directly from the owner.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="bg-slate-900 hover:bg-primary-600 text-slate-400 hover:text-white p-3 rounded-xl transition-all duration-300 shadow-lg border border-slate-800 hover:border-primary-500/50"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200 font-bold text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200 font-bold text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 group">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 group-hover:bg-primary-900/30 group-hover:border-primary-500/30 transition-all">
                  <Mail className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-sm font-bold text-slate-200">hello@rentease.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 group-hover:bg-primary-900/30 group-hover:border-primary-500/30 transition-all">
                  <Phone className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-bold text-slate-200">+91 (800) RENT-EASE</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 group-hover:bg-primary-900/30 group-hover:border-primary-500/30 transition-all">
                  <MapPin className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Headquarters</p>
                  <p className="text-sm font-bold text-slate-200">BKC, Mumbai, MA 400051</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-900 mt-20 pt-10">
          <div className="lg:col-span-8 flex flex-col items-center justify-center text-center py-12">
            <p className="text-sm text-slate-500 font-medium">
              {currentYear} RentEase. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/privacy" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">Privacy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">Terms</Link>
            <Link to="/cookies" className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
