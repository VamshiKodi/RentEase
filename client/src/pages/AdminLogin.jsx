import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-100/30 dark:bg-primary-900/10 blur-[160px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-slate-200/40 dark:bg-slate-900/30 blur-[160px] rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 dark:bg-slate-950/60 backdrop-blur border border-slate-200/70 dark:border-slate-800/70 rounded-3xl shadow-xl p-7 sm:p-9">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Sign In</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Review and approve owner listings.</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-primary-500/20 shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/40"
                placeholder="admin@homelink.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/40"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary !justify-center !py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 text-xs text-slate-500 dark:text-slate-500">
            This area is restricted to RentEase administrators.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
