import { cn } from '@/utils/classNames';

export function Avatar({ src, name, size = 'md', className }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-20 w-20 text-xl',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium',
        sizeClasses[size],
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {initials}
    </div>
  );
}