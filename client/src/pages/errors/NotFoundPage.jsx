import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/variants';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-white p-8"
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-100 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}