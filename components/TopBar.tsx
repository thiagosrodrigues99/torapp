import React from 'react';
import { Icon } from './Icon';

interface TopBarProps {
  onEditProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onEditProfile }) => {
  return (
    <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-dark/10 dark:bg-surface-dark">
          <Icon name="notifications" className="text-primary" />
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Dashboard</h2>
        <div className="flex items-center justify-end">
          <button 
            onClick={onEditProfile}
            className="text-primary text-sm font-bold leading-normal tracking-wide"
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};