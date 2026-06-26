import { cn } from '@/utils/classNames';

export function SkeletonLoader({ width, height = 'h-4', rounded = 'rounded-md', className }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        rounded,
        width || 'w-full',
        height,
        className
      )}
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4 space-y-3', className)}>
      <SkeletonLoader height="h-4" width="w-2/3" />
      <SkeletonLoader height="h-3" width="w-1/2" />
      <SkeletonLoader height="h-3" width="w-3/4" />
      <div className="pt-2">
        <SkeletonLoader height="h-8" width="w-24" rounded="rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLoader height="h-4" width={i === 0 ? 'w-3/4' : 'w-1/2'} />
        </td>
      ))}
    </tr>
  );
}