import React from 'react';
import { Icon } from './Icon';

interface MedalProps {
  icon: string;
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  active?: boolean;
}

const MedalItem: React.FC<MedalProps> = ({ icon, label, color, gradientFrom, gradientTo, active = true }) => {
  return (
    <div className={`flex flex-col items-center gap-2 w-16 text-center ${!active ? 'grayscale-filter' : ''}`}>
      <div className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} p-0.5 rounded-full`}>
        <div className={`w-full h-full bg-center bg-no-repeat aspect-square bg-cover rounded-full border-2 ${active ? 'border-white/20' : 'border-white/10'} flex items-center justify-center bg-surface-dark`}>
          <Icon name={icon} className={`${color} text-3xl`} fill={active} />
        </div>
      </div>
      <p className={`text-[11px] font-medium leading-tight ${!active ? 'text-slate-500' : ''}`}>{label}</p>
    </div>
  );
};

interface MedalsRowProps {
  onSeeAll?: () => void;
}

export const MedalsRow: React.FC<MedalsRowProps> = ({ onSeeAll }) => {
  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-2 pt-2">
        <h3 className="text-lg font-bold leading-tight tracking-tight">Suas Medalhas</h3>
        <button 
          onClick={onSeeAll}
          className="text-primary text-xs font-bold"
        >
          Ver Tudo
        </button>
      </div>
      <div className="flex w-full overflow-x-auto px-4 py-3 hide-scrollbar">
        <div className="flex flex-row items-start justify-start gap-6">
          <MedalItem 
            icon="emoji_events" 
            label="7 Dias" 
            color="text-yellow-500" 
            gradientFrom="from-yellow-300" 
            gradientTo="to-orange-500" 
            active={true}
          />
          <MedalItem 
            icon="water_drop" 
            label="Hidratado" 
            color="text-blue-400" 
            gradientFrom="from-blue-300" 
            gradientTo="to-indigo-500" 
            active={true}
          />
          <MedalItem 
            icon="fitness_center" 
            label="Maratonista" 
            color="text-slate-500" 
            gradientFrom="bg-slate-700" 
            gradientTo="bg-slate-700" 
            active={false}
          />
          <MedalItem 
            icon="bolt" 
            label="Elite" 
            color="text-slate-500" 
            gradientFrom="bg-slate-700" 
            gradientTo="bg-slate-700" 
            active={false}
          />
           <MedalItem 
            icon="workspace_premium" 
            label="Premium" 
            color="text-slate-500" 
            gradientFrom="bg-slate-700" 
            gradientTo="bg-slate-700" 
            active={false}
          />
        </div>
      </div>
    </div>
  );
};