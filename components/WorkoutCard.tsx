import React from 'react';
import { Icon } from './Icon';

interface WorkoutCardProps {
  onStartWorkout?: () => void;
  planName?: string;
  category?: string;
  progress?: number;
  loading?: boolean;

}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  onStartWorkout,
  planName,
  category,
  progress = 0,
  loading = false
}) => {
  return (
    <div className="px-4 mt-2">
      <h3 className="text-lg font-bold leading-tight tracking-tight mb-4">Meu Treino</h3>
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 p-5 shadow-sm">
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-[10px] text-slate-500 uppercase font-black">Carregando plano...</p>
          </div>
        ) : planName ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xl font-bold">{planName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">{category}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-primary font-bold text-lg">{progress}%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Concluído</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <button
              onClick={onStartWorkout}
              className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Icon name="play_arrow" className="mr-2" />
              INICIAR TREINO
            </button>
          </>
        ) : (
          <div className="py-8 text-center">
            <Icon name="fitness_center" className="text-slate-300 dark:text-slate-100/10 text-4xl mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Você ainda não tem um plano atribuído.</p>

          </div>
        )}
      </div>
    </div>
  );
};