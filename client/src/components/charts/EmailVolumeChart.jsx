import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/variants';

export function EmailVolumeChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Email Volume</h3>
        <div className="h-48 flex items-center justify-center text-sm text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-white border border-gray-200 rounded-lg p-4 md:p-6"
    >
      <h3 className="text-sm md:text-base font-medium text-gray-900 mb-3 md:mb-4">Email Volume</h3>
      <div className="h-32 md:h-48 flex items-end gap-1 md:gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-0.5 md:gap-1">
            <div
              className="w-full bg-blue-500 rounded-t-sm transition-all duration-300"
              style={{
                height: `${(item.count / maxValue) * 100}%`,
                minHeight: item.count > 0 ? '4px' : '0',
              }}
            />
            <span className="text-[10px] md:text-xs text-gray-400 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}