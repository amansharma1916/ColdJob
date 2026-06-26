import { useSidebarContext } from '@/context/SidebarContext';
import { SidebarItem } from './SidebarItem';
import { SidebarFooter } from './SidebarFooter';
import { LuChevronsLeft, LuChevronsRight, LuLayoutDashboard, LuPenLine, LuFileText, LuFileBadge, LuUsers, LuInbox, LuCalendarClock, LuSettings } from 'react-icons/lu';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/classNames';

const navItems = [
  { icon: LuLayoutDashboard, label: 'Dashboard', route: ROUTES.DASHBOARD },
  { icon: LuPenLine, label: 'Compose', route: ROUTES.COMPOSE },
  { icon: LuFileText, label: 'Templates', route: ROUTES.TEMPLATES },
  { icon: LuFileBadge, label: 'Resumes', route: ROUTES.RESUMES },
  { icon: LuUsers, label: 'Contacts', route: ROUTES.CONTACTS },
  { icon: LuInbox, label: 'Email History', route: ROUTES.HISTORY },
  { icon: LuCalendarClock, label: 'Scheduled', route: ROUTES.SCHEDULED },
  { icon: LuSettings, label: 'Settings', route: ROUTES.SETTINGS },
];

export function Sidebar() {
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebarContext();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 flex flex-col',
          'transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-16' : 'w-60',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo area - click to toggle collapse */}
        <div
          onClick={toggleCollapse}
          className={cn(
            'flex items-center h-14 border-b border-gray-200 px-3 cursor-pointer',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {isCollapsed ? (
            <span className="text-blue-600 font-bold text-lg">CC</span>
          ) : (
            <>
              <span className="text-blue-600 font-semibold text-lg">ColdJob</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleCollapse(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-1"
                aria-label="Collapse sidebar"
              >
                <LuChevronsLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.route}
              icon={item.icon}
              label={item.label}
              route={item.route}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        <SidebarFooter isCollapsed={isCollapsed} />
      </aside>
    </>
  );
}