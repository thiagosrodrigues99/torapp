import React from 'react';
import { Icon } from './Icon';

interface AllMedalsProps {
  onBack: () => void;
}

export const AllMedals: React.FC<AllMedalsProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-start cursor-pointer active:opacity-60 transition-opacity"
          >
            <Icon name="arrow_back_ios" className="text-2xl" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Conquistas</h2>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 flex flex-col min-h-[calc(100vh-72px)] pb-8">
        <div className="flex-grow flex flex-col">
          <div className="py-6">
            <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 shadow-sm">
              <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-medium uppercase tracking-wider">Total de Pontos</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold leading-tight">1.250</p>
                <p className="text-primary font-bold text-xl">pts</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 pb-4">
            <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Minhas Medalhas</h3>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">4 Desbloqueadas</span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-3 p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5">
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                <Icon name="workspace_premium" className="text-5xl text-primary" fill />
              </div>
              <div>
                <p className="text-base font-bold leading-tight">Maratonista</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-primary text-xs font-bold">500 pts</p>
                  <Icon name="check_circle" className="text-green-500 text-base" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5">
              <div className="w-full aspect-square bg-gradient-to-br from-amber-400/20 to-amber-600/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                <Icon name="fitness_center" className="text-5xl text-amber-500" fill />
              </div>
              <div>
                <p className="text-base font-bold leading-tight">Guerreiro Matinal</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-primary text-xs font-bold">300 pts</p>
                  <Icon name="check_circle" className="text-green-500 text-base" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 pb-4">
            <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Próximos Desafios</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 mb-4">
            <div className="flex flex-col gap-3 p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 opacity-80">
              <div className="w-full aspect-square bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center relative">
                <Icon name="mode_night" className="text-5xl text-slate-400 grayscale-filter" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <Icon name="lock" className="text-white text-2xl" />
                </div>
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-slate-600 dark:text-slate-200">Coruja Noturna</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1.5 font-semibold">
                    <span className="text-primary">80/100</span>
                    <span className="text-slate-400">80%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 opacity-80">
              <div className="w-full aspect-square bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center relative">
                <Icon name="local_fire_department" className="text-5xl text-slate-400 grayscale-filter" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <Icon name="lock" className="text-white text-2xl" />
                </div>
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-slate-600 dark:text-slate-200">Sequência 30 Dias</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1.5 font-semibold">
                    <span className="text-primary">12/30</span>
                    <span className="text-slate-400">40%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};