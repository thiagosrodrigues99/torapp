import React from 'react';
import { Icon } from './Icon';

interface MaleWorkoutManagementProps {
  onBack: () => void;
}

export const MaleWorkoutManagement: React.FC<MaleWorkoutManagementProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-40 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto">
          <button 
            onClick={onBack}
            className="text-gray-900 dark:text-white flex size-10 items-center justify-start hover:opacity-70 transition-opacity"
          >
            <Icon name="arrow_back_ios" />
          </button>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Gestão de Treino Masculino
          </h1>
        </div>
      </header>
      
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Seleção de Exercícios</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Busque exercícios salvos no banco de dados.</p>
        </div>
        
        <section className="px-4 py-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-5 border border-gray-200 dark:border-white/5">
            <div className="relative">
              <label className="block mb-2">
                <span className="text-gray-700 dark:text-white text-sm font-semibold uppercase">Buscar no banco de dados</span>
                <div className="relative mt-1">
                  <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    className="block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3]" 
                    placeholder="Ex: Supino Reto, Agachamento..." 
                    type="text" 
                  />
                </div>
              </label>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                <Icon name="fitness_center" className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 dark:text-white font-bold text-sm">Supino Reto com Barra</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-white uppercase inline-block mt-0.5 tracking-wider">PEITORAL</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <label className="flex-1">
                <span className="text-gray-700 dark:text-white text-sm font-semibold">Séries</span>
                <input 
                  className="mt-1 block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50" 
                  placeholder="4" 
                  type="number" 
                />
              </label>
              <label className="flex-1">
                <span className="text-gray-700 dark:text-white text-sm font-semibold">Repetições</span>
                <input 
                  className="mt-1 block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50" 
                  placeholder="12-15" 
                  type="text" 
                />
              </label>
            </div>
            
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wider mt-2">
              ADICIONAR EXERCÍCIO
            </button>
          </div>
        </section>

        <section className="mt-6 px-4 pb-10 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold">Exercícios Cadastrados</h3>
            <div className="flex items-center gap-2">
              <select className="appearance-none text-xs font-medium bg-[#282828] text-[#f0f0f0] border-none rounded-lg h-8 pl-3 pr-8 focus:ring-1 focus:ring-primary/50 cursor-pointer">
                <option value="todos">Todos Músculos</option>
                <option value="peitoral">Peitoral</option>
                <option value="costas">Costas</option>
                <option value="pernas">Pernas</option>
                <option value="ombros">Ombros</option>
                <option value="biceps">Bíceps</option>
                <option value="triceps">Tríceps</option>
              </select>
              <span className="bg-gray-200 dark:bg-surface-dark text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">3 Exercícios</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <WorkoutListItem title="Supino Reto" category="Peitoral" reps="4x 10-12 reps" />
            <WorkoutListItem title="Rosca Direta" category="Bíceps" reps="3x 12-15 reps" />
            <WorkoutListItem title="Agachamento" category="Pernas" reps="4x 8-10 reps" />
          </div>
          
          <div className="mt-12 mb-8">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-xl shadow-xl shadow-primary/30 transition-all active:scale-[0.97] uppercase tracking-widest text-lg border-2 border-primary">
              SALVAR ALTERAÇÕES
            </button>
            <p className="text-center text-gray-500 text-[10px] mt-3 uppercase font-bold tracking-tighter opacity-50">Confirme para atualizar a planilha de treino</p>
          </div>
        </section>
      </main>
    </div>
  );
};

const WorkoutListItem: React.FC<{ title: string; category: string; reps: string }> = ({ title, category, reps }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-200 dark:border-white/5">
    <div className="w-16 h-16 bg-gray-100 dark:bg-[#3a272c] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/10">
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Icon name="play_circle" className="text-primary/40" />
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-gray-900 dark:text-white font-bold text-base">{title}</h4>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">{category}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{reps}</span>
      </div>
    </div>
    <button className="text-gray-400 hover:text-red-500 transition-colors">
      <Icon name="delete_outline" />
    </button>
  </div>
);
