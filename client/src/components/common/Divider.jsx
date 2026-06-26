import { cn } from '@/utils/classNames';

export function Divider({ className }) {
  return <hr className={cn('border-t border-gray-200 my-6', className)} />;
}