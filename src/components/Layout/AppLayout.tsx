import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { BarChart2, History, Home } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Accueil', icon: Home, end: true },
    { to: '/history', label: 'Historique', icon: History, end: false },
    { to: '/stats', label: 'Statistiques', icon: BarChart2, end: false }
  ];

  return (
    <div
      className="flex min-h-screen flex-col bg-[#F5EFE6] font-sans text-[#2D283E] antialiased md:flex-row">
      {/* SIDEBAR (Desktop) */}
      <aside
        className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#E8DFD8] bg-white p-6 md:flex">
        <div>
          <div className="mb-8">
            <h1
              className="font-serif text-2xl font-bold text-[#5E4B8B]">DoctoFoufi</h1>
            <p className="mt-0.5 text-xs text-[#8E8294]">Suivi d'injection
              quotidien</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#E5D9F2] font-semibold text-[#5E4B8B]'
                      : 'text-[#8E8294] hover:bg-[#F5EFE6] hover:text-[#2D283E]'
                  } `
                }>
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* ZONE DE CONTENU */}
      <main
        className="mx-auto w-full max-w-xl flex-1 overflow-y-auto p-2 pb-24 sm:p-6 md:pb-6">
        <Outlet />
      </main>

      {/* BOTTOM BAR (Mobile) */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-[#E8DFD8] bg-white/90 px-2 py-2 backdrop-blur-md md:hidden">
        <ul className="flex items-center justify-around">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all ${
                    isActive ? 'font-bold text-[#5E4B8B]' : 'text-[#8E8294]'
                  } `
                }>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
