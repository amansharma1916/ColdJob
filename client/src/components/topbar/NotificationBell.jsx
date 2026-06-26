import { useState, useRef } from 'react';
import { LuBell, LuCheck } from 'react-icons/lu';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/utils/classNames';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const unreadCount = 0; // Will be connected to real data later

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        aria-label="Notifications"
      >
        <LuBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-dropdown border border-gray-200 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Mark all as read
              </button>
            )}
          </div>
          <div className="py-8 text-center">
            <LuBell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        </div>
      )}
    </div>
  );
}