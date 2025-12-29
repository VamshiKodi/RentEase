import React from 'react';
import { Home } from 'lucide-react';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Spinning circle */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
        
        {/* Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className={`${sizeClasses[size]} text-primary-600 animate-pulse`} style={{ width: '50%', height: '50%' }} />
        </div>
      </div>
      
      {text && (
        <p className={`mt-4 text-gray-600 ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loader
export const PageLoader = ({ text = 'Loading RentEase...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-8 h-8 text-primary-600 animate-bounce" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">RentEase</h2>
        <p className="text-gray-600 animate-pulse">{text}</p>
      </div>
    </div>
  );
};

// Button loader
export const ButtonLoader = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
  );
};

// Card loader skeleton
export const CardLoader = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-4">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
