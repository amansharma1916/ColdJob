import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/variants';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-white p-8"
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-100 mb-4">403</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access denied</h2>
        <p className="text-sm text-gray-500 mb-6">
          You don't have permission to access this page.
        </p>
        <Button onClick={() => navigate('/login')}>
          Log in
        </Button>
      </div>
    </motion.div>
  );
}