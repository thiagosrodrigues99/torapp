import React from 'react';
import { Icon } from './Icon';

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 ${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
  >
    <Icon name={icon} fill={active} />
    <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

interface BottomNavigationProps {
  currentTab?: string;
  onNavigate?: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab = 'dashboard', onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 pb-8 pt-2">
      <div className="flex items-center justify-around px-2">
        <NavItem
          icon="home"
          label="Início"
          active={currentTab === 'dashboard'}
          onClick={() => onNavigate?.('dashboard')}
        />

        <NavItem
          icon="groups"
          label="Comunidade"
          active={currentTab === 'community'}
          onClick={() => onNavigate?.('community')}
        />
      </div>
    </div>
  );
};