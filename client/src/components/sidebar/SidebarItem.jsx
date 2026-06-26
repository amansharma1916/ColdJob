import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/classNames';

export function SidebarItem({ icon: Icon, label, route, isCollapsed }) {
  return (
    <NavLink
      to={route}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150',
          isActive
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
}