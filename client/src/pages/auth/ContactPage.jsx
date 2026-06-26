import { motion } from 'framer-motion';
import { slideUp } from '@/animations/variants';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function ContactPage() {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto w-full py-12 px-4 text-center"
    >
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6 text-left"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Login
      </Link>
      <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
        <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question or need help? Reach out to us at:
      </p>
      <a
        href="mailto:amansharmayt19@gmail.com"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        amansharmayt19@gmail.com
      </a>
    </motion.div>
  );
}