import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Target,
  LineChart,
  Award,
  Compass,
  HeartHandshake,
  ChevronDown,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}

interface SubMenuItem {
  name: string;
  icon: React.ElementType;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  subItems?: SubMenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed = false, onClose }) => {
  const location = useLocation();
  const [executiveListOpen, setExecutiveListOpen] = React.useState(false);

  const isPathActive = (itemPath: string) => {
    const current = location.pathname;
    if (itemPath === '/dashboard') {
      return current === '/' || current === '/dashboard';
    }
    if (itemPath === '/import') {
      return current === '/import';
    }
    if (itemPath === '/setting') {
      return current === '/setting' || current === '/settings';
    }

    return current === itemPath;
  };

  const menuGroups: MenuGroup[] = [
    {
      title: 'HR EXECUTIVE DASHBOARD',
      items: [
        {
          name: 'HR Executive Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          subItems: [
            { name: 'KPI Management', icon: Target },
            { name: 'Productivity Analysis', icon: LineChart },
            { name: 'Talent', icon: Award },
            { name: 'Go To Market - HR Analysis', icon: Compass },
            { name: 'Employee Engagement Survey', icon: HeartHandshake }
          ]
        }
      ]
    },
    {
      title: 'DATA MNAGEMENT',
      items: [
        { name: 'Import Data', path: '/import', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'SETTING & INFORMASI',
      items: [
        { name: 'Setting', path: '/setting', icon: Settings },
        // { name: 'Tentang Aplikasi', path: '/about', icon: Compass },
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col bg-[#141724] text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:w-20' : 'lg:w-72'
          } ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div
          className={`h-16 shrink-0 flex items-center border-b border-slate-800/80 bg-[#10131d] transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
            }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 shrink-0 flex items-center justify-center">
              <img src="/BiensiIcon.webp" alt="icon" className="w-9 h-9 object-contain" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-1.5 leading-none">
                  <div className="w-28">
                    <img src="/BiensiType.webp" alt="Type" className="w-full object-contain" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-4 space-y-4 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {isCollapsed ? (
                <div className="my-2 border-t border-slate-800/60 mx-1" />
              ) : (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.title}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isPathActive(item.path);

                  if (item.subItems && item.subItems.length > 0) {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`relative flex items-center font-medium transition-all ${isCollapsed
                            ? 'justify-center p-2.5 my-0.5'
                            : 'justify-between px-3 py-2.5'
                            } ${active
                              ? 'bg-[#3b1522] text-white shadow-sm border-l-2 border-red-500 font-semibold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            } rounded-lg`}
                        >
                          <Link
                            to={item.path}
                            title={item.name}
                            onClick={() => {
                              setExecutiveListOpen((prev) => !prev);
                              if (window.innerWidth < 1024 && onClose) onClose();
                            }}
                            className="flex items-center gap-3 flex-1 overflow-hidden"
                          >
                            <item.icon
                              className={`w-4 h-4 shrink-0 ${active ? 'text-red-400' : 'text-slate-400'}`}
                            />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                          </Link>

                          {!isCollapsed && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setExecutiveListOpen(!executiveListOpen);
                              }}
                              className="p-1 -mr-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                              title={executiveListOpen ? 'Tutup list' : 'Buka list'}
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${executiveListOpen ? 'rotate-180 text-white' : ''
                                  }`}
                              />
                            </button>
                          )}
                        </div>

                        {!isCollapsed && executiveListOpen && (
                          <div className="pl-4 ml-3 border-l border-slate-800/80 space-y-0.5 pt-0.5 pb-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            {item.subItems.map((sub, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-2.5 px-3 py-2 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors"
                              >
                                <sub.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span className="truncate">{sub.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={item.name}
                      onClick={() => {
                        if (window.innerWidth < 1024 && onClose) onClose();
                      }}
                      className={`relative flex items-center font-medium transition-all ${isCollapsed
                        ? 'justify-center p-2.5 my-0.5'
                        : 'justify-between px-3 py-2.5'
                        } ${active
                          ? 'bg-[#3b1522] text-white shadow-sm border-l-2 border-red-500 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <item.icon
                          className={`w-4 h-4 shrink-0 ${active ? 'text-red-400' : 'text-slate-400'}`}
                        />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {item.badge && !isCollapsed && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-red-600 text-white shrink-0 tracking-wider">
                          {item.badge}
                        </span>
                      )}

                      {item.badge && isCollapsed && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-[#141724]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
