import React from 'react';

export const Loader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} border-outline-variant border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] w-full gap-md">
      <div className="relative">
        <div className="absolute inset-0 bg-hero-blue-light rounded-full blur-md opacity-50 animate-pulse"></div>
        <div className="relative w-16 h-16 border-4 border-outline-variant border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-subtle-gray font-label-sm uppercase tracking-widest animate-pulse mt-sm">Loading...</p>
    </div>
  );
};
