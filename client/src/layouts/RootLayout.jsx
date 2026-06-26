import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Topbar } from '@/components/topbar/Topbar';
import { useSidebarContext } from '@/context/SidebarContext';

export function RootLayout() {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="h-full min-h-screen bg-white overflow-x-hidden">
      <Sidebar />
      <div
        className={`transition-all duration-200 ease-in-out w-full ${
          isCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <Topbar />
        <main className="min-h-[calc(100vh-3.5rem)] px-2 sm:px-4 md:px-6 max-w-screen-2xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
