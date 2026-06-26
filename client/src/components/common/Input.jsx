import { forwardRef } from 'react';
import { cn } from '@/utils/classNames';

export const Input = forwardRef(function Input(
  { label, error, helpText, leftIcon: LeftIcon, rightIcon: RightIcon, className, id, ...props },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LeftIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-500 focus:border-red-500',
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <RightIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
    </div>
  );
});