import React from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full p-6`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {title && (
            <div className="border-b border-gray-200 pb-4 mb-6 pr-8">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}