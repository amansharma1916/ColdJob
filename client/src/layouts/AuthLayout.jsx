import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 border-r border-gray-200 items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ColdJob</h1>
            <p className="text-lg text-gray-600 mb-8">
              Send smarter cold emails. Track every open. Land more replies.
            </p>
            <ul className="space-y-4">
              {[
                'Connect your Gmail in seconds',
                'Manage templates with dynamic variables',
                'Send to hundreds of contacts at once',
                'Track delivery, opens, and replies',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <blockquote className="mt-8 border-l-2 border-gray-200 pl-4">
              <p className="text-sm text-gray-500 italic">
                "ColdJob transformed how I reach out to recruiters. My response rate doubled."
              </p>
              <footer className="mt-2 text-xs text-gray-400">— Early Adopter</footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Auth card */}
        <div className="flex-1 flex items-center justify-center p-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-4">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <Link to={ROUTES.PRIVACY} className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </Link>
          <Link to={ROUTES.TERMS} className="hover:text-gray-700 transition-colors">
            Terms of Service
          </Link>
          <Link to={ROUTES.CONTACT} className="hover:text-gray-700 transition-colors">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
