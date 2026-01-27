import React, { useState } from 'react';
import { Icon } from './Icon';

interface FemaleWorkoutManagementProps {
  onBack: () => void;
}

export const FemaleWorkoutManagement: React.FC<FemaleWorkoutManagementProps> = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display relative">
      <header className="sticky top-0 z-40 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto">
          <button 
            onClick={onBack}
            className="text-gray-900 dark:text-white flex size-10 items-center justify-start hover:opacity-70 transition-opacity"
          >
            <Icon name="arrow_back_ios" />
          </button>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Gestão de Treino Feminino
          </h1>
        </div>
      </header>
      
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Adicionar Novo Exercício</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Busque exercícios no banco de dados para adicionar à planilha.</p>
        </div>
        
        <section className="px-4 py-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-5 border border-gray-200 dark:border-white/5">
            <div>
              <label className="block mb-2">
                <span className="text-gray-700 dark:text-white text-sm font-semibold uppercase tracking-wider">Buscar no Banco de Dados</span>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3] font-bold" 
                      placeholder="EX: AGACHAMENTO SUMÔ..." 
                      type="text" 
                    />
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20" 
                    title="Novo Músculo"
                  >
                    <Icon name="add" className="text-2xl" />
                  </button>
                </div>
              </label>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Selecionado</p>
                <h4 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">Agachamento Sumô</h4>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Glúteos</span>
              </div>
              <Icon name="check_circle" className="text-green-500" />
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
            
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wider mt-4">
              Adicionar Exercício
            </button>
          </div>
        </section>

        <section className="mt-6 px-4 pb-10 flex-1">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold">Exercícios Cadastrados</h3>
              <span className="bg-gray-200 dark:bg-surface-dark text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium border border-gray-300 dark:border-white/10">3 Exercícios</span>
            </div>
            <div className="relative">
              <select className="appearance-none w-full rounded-lg border-none bg-white dark:bg-surface-dark text-gray-900 dark:text-[#f0f0f0] h-10 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/50 shadow-sm border border-gray-200 dark:border-white/10 pr-10">
                <option value="all">Todos os grupos musculares</option>
                <option value="gluteos">Glúteos</option>
                <option value="posteriores">Posteriores</option>
                <option value="quadriceps">Quadríceps</option>
                <option value="costas">Costas</option>
                <option value="membros-superiores">Membros Superiores</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Icon name="expand_more" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-8">
            <RegisteredWorkoutItem title="Agachamento Sumô" category="Glúteos" reps="4x 12-15 reps" />
            <RegisteredWorkoutItem title="Stiff" category="Posteriores" reps="3x 12 reps" />
            <RegisteredWorkoutItem title="Elevação Pélvica" category="Glúteos" reps="4x 10 reps" />
          </div>
          
          <div className="sticky bottom-4 pt-4">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/40 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-lg">
              Salvar Alterações
            </button>
          </div>
        </section>
      </main>

      {/* Modal cadastrar novo músculo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/10 overflow-hidden">
            <h3 className="text-white text-xl font-bold mb-4">Cadastrar Novo Músculo</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">
                  <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Nome do Músculo</span>
                  <input 
                    className="mt-1 block w-full rounded-lg border-none bg-[#3a272c] text-white h-12 px-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-500" 
                    placeholder="Ex: Adutores" 
                    type="text" 
                  />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg text-center cursor-pointer transition-colors uppercase text-sm"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm" 
                  type="button"
                >
                  SALVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RegisteredWorkoutItem: React.FC<{ title: string; category: string; reps: string }> = ({ title, category, reps }) => (
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
    <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
      <Icon name="delete_outline" />
    </button>
  </div>
);
