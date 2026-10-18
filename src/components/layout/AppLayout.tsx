import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SearchModal } from '../ui/SearchModal';

export const AppLayout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 antialiased">
      <Sidebar
        isOpen={mobileDrawerOpen}
        isCollapsed={isCollapsed}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
          }`}
      >
        <Topbar
          onToggleSidebar={handleToggleSidebar}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-10 lg:p-12 w-full no-scrollbar">
          <Outlet />
        </main>
      </div>

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};
