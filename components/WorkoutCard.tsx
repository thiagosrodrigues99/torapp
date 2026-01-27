import React from 'react';
import { Icon } from './Icon';

interface WorkoutCardProps {
  onStartWorkout?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ onStartWorkout }) => {
  return (
    <div className="px-4 mt-2">
      <h3 className="text-lg font-bold leading-tight tracking-tight mb-4">Meu Treino</h3>
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xl font-bold">Ficha A: Iniciante</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">Pernas</span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">Glúteos</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-primary font-bold text-lg">40%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Concluído</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: '40%' }}></div>
        </div>
        <button 
          onClick={onStartWorkout}
          className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Icon name="play_arrow" className="mr-2" />
          INICIAR TREINO
        </button>
      </div>
    </div>
  );
};