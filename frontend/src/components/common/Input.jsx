import React from 'react';

/**
 * Componente Input reutilizable
 * 
 * Props:
 * - label: string
 * - placeholder: string
 * - type: 'text' | 'email' | 'password' | 'number' | 'textarea' (default: 'text')
 * - value: string | number
 * - onChange: function
 * - error: string (mensaje de error)
 * - disabled: boolean (default: false)
 * - required: boolean (default: false)
 * - className: string (clases adicionales)
 */
export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Component
        type={isTextarea ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-300'
        } ${isTextarea ? 'resize-vertical min-h-[120px]' : ''}`}
        {...props}
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
