import React from 'react';
import { NavLink } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function NavBar() {
  const { isOffline, language, setLanguage } = useStore();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/voice', label: 'Voice Apply' },
    { to: '/schemes', label: 'Schemes' },
    { to: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex flex-col">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-['Inter']">
              समृद्धि सेतु
            </span>
            <span className="text-xs text-cyan-300/70 tracking-widest uppercase">
              SamriddhiSetu
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-cyan-400 bg-white/5'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="px-3 py-1 text-xs border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'} ${!isOffline && 'animate-pulse'}`} />
              <span className="text-xs text-slate-300">{isOffline ? 'Offline Mode' : 'Online'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
