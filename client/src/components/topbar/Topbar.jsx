import { useLocation } from 'react-router-dom';
import { LuMenu } from 'react-icons/lu';
import { useSidebarContext } from '@/context/SidebarContext';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from './SearchBar';
import { NotificationBell } from './NotificationBell';
import { ProfileMenu } from './ProfileMenu';
import { cn } from '@/utils/classNames';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/compose': 'Compose',
  '/templates': 'Templates',
  '/resumes': 'Resumes',
  '/contacts': 'Contacts',
  '/history': 'Email History',
  '/scheduled': 'Scheduled',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export function Topbar() {
  const location = useLocation();
  const { toggleMobile } = useSidebarContext();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || 'ColdJob';

  return (
    <header className="h-14 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center px-2 sm:px-4 gap-1 sm:gap-2">
      <button
        onClick={toggleMobile}
        className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors md:hidden shrink-0"
        aria-label="Toggle sidebar"
      >
        <LuMenu className="h-5 w-5" />
      </button>

      <h1 className="text-base sm:text-lg font-semibold text-gray-900 shrink min-w-0 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">{title}</h1>

      <div className="flex-1 min-w-0 flex justify-end sm:justify-center items-center gap-2 sm:gap-3">
        <SearchBar /> 
      {/* </div> */}

      {/* <div className="flex items-center gap-0.5 sm:gap-1 shrink-0"> */}

        <NotificationBell />
        {user?.email && (
          <div className="hidden lg:flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-2 py-1 rounded-full truncate max-w-[120px] xl:max-w-[200px]">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        )}

        <ProfileMenu />
      </div>
    </header>
  );
}