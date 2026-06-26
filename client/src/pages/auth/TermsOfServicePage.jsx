import { motion } from 'framer-motion';
import { slideUp } from '@/animations/variants';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function TermsOfServicePage() {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto w-full py-12 px-4"
    >
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Login
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 26, 2026</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ColdJob, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Service Description</h2>
          <p>
            ColdJob is a cold email platform that allows users to send personalized email campaigns
            through their Gmail account. We provide tools for managing templates, contacts, and
            tracking email performance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Comply with all applicable laws and regulations regarding email marketing</li>
            <li>Not use the service to send spam, unsolicited bulk emails, or fraudulent messages</li>
            <li>Maintain accurate and up-to-date contact information</li>
            <li>Not exceed fair usage limits or abuse the API</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Limitation of Liability</h2>
          <p>
            ColdJob is provided "as is" without any warranty. We are not liable for any damages
            arising from your use of the service, including but not limited to email delivery failures,
            data loss, or service interruptions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time if you violate
            these terms. You may also stop using the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. We will notify you of any material changes
            via email or through the platform. Continued use after changes constitutes acceptance.
          </p>
        </section>
      </div>
    </motion.div>
  );
}