import { forwardRef } from 'react';
import { cn } from '@/utils/classNames';

export const Textarea = forwardRef(function Textarea(
  { label, error, helpText, className, id, ...props },
  ref
) {
  const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-y min-h-[80px]',
          error && 'border-red-400 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
    </div>
  );
});