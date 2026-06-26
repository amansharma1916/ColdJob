import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/variants';
import { Button } from './Button';
import { LuWifi, LuServerCrash } from 'react-icons/lu';

export function ErrorState({ error, onRetry, isNetwork = false }) {
  const Icon = isNetwork ? LuWifi : LuServerCrash;

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="mb-4">
        <Icon className="h-12 w-12 text-gray-300" />
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-1">
        {isNetwork ? 'Connection lost' : 'Something went wrong'}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">
        {error?.message || (isNetwork
          ? 'Check your internet connection and try again.'
          : 'An unexpected error occurred.')}
      </p>
      {onRetry && (
        <Button variant="primary" size="md" onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  );
}