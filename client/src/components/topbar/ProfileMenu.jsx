import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuUser, LuSettings, LuLogOut } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/common/Avatar';
import { useClickOutside } from '@/hooks/useClickOutside';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setIsOpen(false));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-50 transition-colors"
        aria-label="Profile menu"
      >
        <Avatar src={user?.avatar} name={user?.name} size="sm" />
        <span className="hidden lg:inline text-sm font-medium text-gray-700 truncate max-w-[100px]">
          {user?.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-dropdown border border-gray-200 z-50 py-1">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => { navigate('/profile'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LuUser className="h-4 w-4 text-gray-400" />
            Profile
          </button>
          <button
            onClick={() => { navigate('/settings'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LuSettings className="h-4 w-4 text-gray-400" />
            Settings
          </button>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LuLogOut className="h-4 w-4 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}