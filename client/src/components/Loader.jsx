import React from 'react';
import { Home, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-primary-100 dark:border-primary-900/30 border-t-primary-600 dark:border-t-primary-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className="w-6 h-6 text-primary-600 dark:text-primary-500 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">{text}</p>
    </div>
  );
};

export const PageLoader = ({ text = 'Initializing RentEase...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 dark:bg-primary-900/10 blur-[150px] rounded-full" />

      <div className="text-center relative z-10">
        <div className="relative mb-10 inline-block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-slate-100 dark:border-slate-800 border-t-primary-600 dark:border-t-primary-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-primary-600 dark:text-primary-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">RentEase <span className="text-primary-600">Premium</span></h2>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">{text}</p>
      </div>
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
};

export const CardLoader = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-2 shadow-sm animate-pulse">
      <div className="bg-slate-100 dark:bg-slate-800 h-64 rounded-[2rem] mb-6"></div>
      <div className="px-6 pb-6 space-y-4">
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4"></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2"></div>
        <div className="flex space-x-4 pt-4">
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-24"></div>
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
