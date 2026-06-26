import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuLogOut, LuUser } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/common/Avatar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/utils/classNames';
import { Tooltip } from '@/components/common/Tooltip';

export function SidebarFooter({ isCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userMenuItems = (
    <>
      <button
        onClick={() => navigate('/profile')}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <LuUser className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>Profile</span>}
      </button>
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <LuLogOut className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </>
  );

  return (
    <>
      <div className="border-t border-gray-200 p-3 space-y-1">
        {isCollapsed ? (
          <div className="space-y-1">
            <Tooltip content={user?.name || 'User'} position="right">
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex justify-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Avatar src={user?.avatar} name={user?.name} size="" />
              </button>
            </Tooltip>
            <Tooltip content="Logout" position="right">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex justify-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LuLogOut className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/profile')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="flex-1 text-left truncate">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <LuLogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={async () => {
          await logout();
          navigate('/login');
        }}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        variant="primary"
      />
    </>
  );
}