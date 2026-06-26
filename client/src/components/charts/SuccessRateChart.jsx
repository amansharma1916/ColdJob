import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/variants';

export function SuccessRateChart({ successRate = 0, failedRate = 0 }) {
  const percentage = Math.round(successRate);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-white border border-gray-200 rounded-lg p-4 md:p-6"
    >
      <h3 className="text-sm md:text-base font-medium text-gray-900 mb-3 md:mb-4">Success Rate</h3>
      <div className="flex items-center justify-center h-32 md:h-48">
        <div className="relative">
          <svg className="h-24 w-24 md:h-32 md:w-32 -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#16A34A"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg md:text-2xl font-bold text-gray-900">{percentage}%</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 text-xs text-gray-500 mt-2">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-green-500 rounded-full" />
          Success
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 bg-red-500 rounded-full" />
          Failed
        </span>
      </div>
    </motion.div>
  );
}