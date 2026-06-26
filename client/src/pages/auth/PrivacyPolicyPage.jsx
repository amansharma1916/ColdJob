import { motion } from 'framer-motion';
import { slideUp } from '@/animations/variants';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function PrivacyPolicyPage() {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 26, 2026</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            When you sign in with Google, we collect your email address, name, and profile picture.
            We also access your Gmail account solely to send emails on your behalf and track email delivery status.
            We do not read the content of your emails beyond what is necessary to provide our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Send cold emails on your behalf using your Gmail account</li>
            <li>Track email delivery, opens, and replies</li>
            <li>Store and manage your email templates and contact lists</li>
            <li>Improve and optimize our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Data Storage and Security</h2>
          <p>
            Your data is stored securely on our servers. We implement industry-standard security measures
            to protect your personal information. We retain your data only as long as necessary to provide
            our services or as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
          <p>
            We use Google APIs to send and track emails. Your use of Google services through our platform
            is subject to Google's Privacy Policy. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal data at any time.
            You can revoke our access to your Gmail account at any time through your Google Account settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:support@coldjob.app" className="text-blue-600 hover:underline">amansharmayt19@gmail.com</a>.
          </p>
        </section>
      </div>
    </motion.div>
  );
}