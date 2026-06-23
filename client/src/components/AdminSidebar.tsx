import React from 'react';
import { NavLink } from 'react-router-dom';

export const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Draws', path: '/admin/draws', icon: 'play_arrow' },
    { name: 'Charities', path: '/admin/charities', icon: 'volunteer_activism' },
    { name: 'Users', path: '/admin/users', icon: 'group' },
    { name: 'Winners', path: '/admin/winners', icon: 'workspace_premium' },
    { name: 'Reports', path: '/admin/reports', icon: 'bar_chart' },
  ];

  return (
    <aside className="fixed left-0 top-[72px] w-64 h-[calc(100vh-72px)] bg-surface-container-lowest border-r border-outline-variant shadow-sm z-40 hidden md:flex flex-col">
      <div className="p-xl border-b border-outline-variant/30 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-sm mb-2">
          <img 
            src="/admin_avatar.png" 
            alt="Admin Avatar" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff';
            }}
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-md space-y-sm px-md custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-md px-lg py-md rounded-lg font-label-sm text-label-sm transition-all duration-200 ${
                isActive
                  ? 'bg-hero-blue-light text-primary font-bold shadow-sm'
                  : 'text-subtle-gray hover:bg-surface-variant hover:text-dark-slate'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-lg border-t border-outline-variant/30 text-center">
        <p className="font-label-sm text-[10px] text-subtle-gray uppercase tracking-widest">Admin Panel v1.0</p>
      </div>
    </aside>
  );
};
