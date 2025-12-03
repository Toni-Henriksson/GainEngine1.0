import React from 'react';
import { Icons } from './Icons';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-white font-sans relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-5%] w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="relative z-10 pb-24 md:pb-10 max-w-4xl mx-auto min-h-screen flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50 z-50 safe-area-bottom">
        <div className="flex justify-around items-center p-3 max-w-4xl mx-auto">
          <NavItem to="/" icon={<Icons.Workout size={24} />} label="Workout" active={isActive('/')} />
          <NavItem to="/plan" icon={<Icons.Calendar size={24} />} label="Plan" active={isActive('/plan')} />
          <NavItem to="/progress" icon={<Icons.Progress size={24} />} label="Progress" active={isActive('/progress')} />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${active ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}
  >
    {icon}
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </Link>
);