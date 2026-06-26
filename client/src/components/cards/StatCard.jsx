import { motion } from 'framer-motion';
import { slideUp } from '@/animations/variants';
import { cn } from '@/utils/classNames';

export function StatCard({ icon: Icon, label, value, trend, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <motion.div
      variants={slideUp}
      className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-card hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className={cn('rounded-md p-1.5 md:p-2', colorClasses[color])}>
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend > 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
      <div className="mt-2 md:mt-3">
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}