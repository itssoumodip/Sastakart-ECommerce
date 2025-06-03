import React from 'react';

const LoadingSpinner = ({ size = 'md', label, fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-80 z-50'
    : 'w-full';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses}`}>
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-gray-200 border-t-black`}
      />
      {label && (
        <p className="mt-4 ml-2 text-gray-600 text-sm font-medium">{label}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
