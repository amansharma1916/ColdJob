import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/variants';
import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center py-8 md:py-12 px-4 text-center ${className || ''}`}
    >
      {Icon && (
        <div className="mb-3 md:mb-4">
          <Icon className="h-10 w-10 md:h-12 md:w-12 text-gray-300" />
        </div>
      )}
      {title && <h3 className="text-sm md:text-base font-medium text-gray-900 mb-1">{title}</h3>}
      {description && <p className="text-xs md:text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}