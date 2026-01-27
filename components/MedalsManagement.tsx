import React, { useState } from 'react';
import { Icon } from './Icon';
import { EditMedal } from './EditMedal';

interface MedalsManagementProps {
  onBack: () => void;
}

export const MedalsManagement: React.FC<MedalsManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'edit'>('list');

  if (view === 'edit') {
    return <EditMedal onBack={() => setView('list')} />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white transition-colors duration-200 font-display">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors"
            >
              <Icon name="arrow_back" className="text-gray-700 dark:text-white" />
            </button>
            <h1 className="text-xl font-bold leading-tight tracking-tight">Gestão de Medalhas</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">Admin Platform</span>
              <span className="text-xs text-gray-500">v2.4.0</span>
            </div>
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Registration Section */}
        <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold">Cadastrar Nova Medalha</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Adicione novos conquistas para motivar seus atletas.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Fields */}
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Título da Medalha</label>
                  <input className="w-full h-12 bg-gray-50 dark:bg-[#141414] border border-gray-300 dark:border-white/10 rounded-lg px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" placeholder="Ex: Super Atleta 2024" type="text"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pontos para Conquistar</label>
                  <div className="relative">
                    <input className="w-full h-12 bg-gray-50 dark:bg-[#141414] border border-gray-300 dark:border-white/10 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" placeholder="000" type="number"/>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase">PTS</span>
                  </div>
                </div>
                <button className="w-full md:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Icon name="add_circle" />
                  Salvar Medalha
                </button>
              </div>
              {/* Upload Area */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ícone da Medalha (PNG)</label>
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 bg-gray-50 dark:bg-[#141414] hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon name="cloud_upload" className="text-4xl" />
                    </div>
                    <div>
                      <p className="text-base font-bold dark:text-white">Arraste ou clique para selecionar</p>
                      <p className="text-sm text-gray-500">Recomendado: 512x512px, fundo transparente</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-200 dark:bg-surface-dark rounded-lg text-sm font-bold hover:bg-gray-300 dark:hover:bg-white/10 dark:text-white transition-colors">
                      Selecionar Arquivo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* List Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Medalhas Cadastradas</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total: 8 Medalhas</span>
          </div>
        </div>

        {/* Grid of Medals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {/* Medal Card 1 */}
          <div className="group bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:border-primary transition-all hover:shadow-lg dark:hover:shadow-primary/5">
            <div className="relative aspect-square mb-4 bg-gray-50 dark:bg-background-dark rounded-lg flex items-center justify-center overflow-hidden">
              <img alt="Medalha de Ouro" className="size-28 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrr9SeOMHMAR07A0SOxmYPhWMATGU2ZVCKMVrrz_Cn6ye3wjlKGasOOzP3NxCfakh1EZezGCrCo36IlkGQ8f8dZ_fT1DsMkXZ6k3Vcouu6vSWxVYvJobsZgn_LF3MCaq-TaSTJjbC8ClVCISeRhNJeQctmUTNHlFvbcxn98WPe_YwSqebRlz0lmRrbYHBhdJ-yaMceOK9JuCJfPb5_weRtAQIFv5xTDIR1rpUxVYnREaZnZYavsogqw-N3KYWX8zf0ERhHWOJNRwJL"/>
              <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                ATIVO
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1 truncate">Maratonista Elite</h3>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="stars" className="text-primary text-sm" />
              <span className="text-sm text-gray-500 font-medium">5.000 Pontos</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('edit')}
                className="flex-1 h-9 flex items-center justify-center gap-1 text-xs font-bold uppercase rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors"
              >
                <Icon name="edit" className="text-sm" /> Editar
              </button>
              <button className="size-9 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Icon name="delete" />
              </button>
            </div>
          </div>

          {/* Medal Card 2 */}
          <div className="group bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:border-primary transition-all hover:shadow-lg">
            <div className="relative aspect-square mb-4 bg-gray-50 dark:bg-background-dark rounded-lg flex items-center justify-center overflow-hidden">
              <img alt="Iniciante" className="size-28 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIHkcN5rawQ2TdxZ6C26pI-rFYvBRkQ1ltPH4DwyEFIlyUdoRBd6tDNRFYxo8Jwjc5Bnf5rkicLOy3z8nX0a1rEHSg00GYo40lZQkTA7TeKKap72JmM-1AT9K-EzARTdBsOT4vdG81mUCXP_LVWRr1B4hWsseblIWb8TwBl5gFfYkgrhLirGT1e_hM2vNR1LPpAc1IFoMdiTq7VJHDwW3xiO1FvXQs1kAIJg1ozxs0LsslcbzzUeNiiU_MdNal0rN5U2XJN6kmJgH4"/>
            </div>
            <h3 className="font-bold text-lg mb-1 truncate">Primeira Corrida</h3>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="stars" className="text-primary text-sm" />
              <span className="text-sm text-gray-500 font-medium">100 Pontos</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('edit')}
                className="flex-1 h-9 flex items-center justify-center gap-1 text-xs font-bold uppercase rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors"
              >
                <Icon name="edit" className="text-sm" /> Editar
              </button>
              <button className="size-9 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Icon name="delete" />
              </button>
            </div>
          </div>

          {/* Medal Card 3 */}
          <div className="group bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:border-primary transition-all hover:shadow-lg">
            <div className="relative aspect-square mb-4 bg-gray-50 dark:bg-background-dark rounded-lg flex items-center justify-center overflow-hidden">
              <img alt="Mestre" className="size-28 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsifAmllfG8buAng4_r0VUjvhynrEbdGvkVLX_2MjpTqte_U0A9liy_NWS8VWYX2-M5fl0tF7OcTeNW18aqo8EeXKO7JWanZrTBuN52-HZ9OpGLoiKPDKByWhaiIOB7X3sF13M4NxmBJWdhnGC7YJpFthPG-7PeRcJqIZHAFwJs0KvZ5jL6R22ozPiGEH8SzW5ULqtRK-VvCU7-lq_q3DuaVgK46_sQjk5Rel_HjS-HZyYDuGiONaAthwpXZmXJx472nIX2bDk46HI"/>
            </div>
            <h3 className="font-bold text-lg mb-1 truncate">Mestre do Cardio</h3>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="stars" className="text-primary text-sm" />
              <span className="text-sm text-gray-500 font-medium">2.500 Pontos</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('edit')}
                className="flex-1 h-9 flex items-center justify-center gap-1 text-xs font-bold uppercase rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors"
              >
                <Icon name="edit" className="text-sm" /> Editar
              </button>
              <button className="size-9 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Icon name="delete" />
              </button>
            </div>
          </div>

          {/* Medal Card 4 (Empty State / Add Placeholder) */}
          <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-dark transition-all">
            <div className="size-16 rounded-full bg-gray-100 dark:bg-background-dark flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
              <Icon name="add" className="text-3xl" />
            </div>
            <p className="font-bold text-gray-500 dark:text-gray-400">Criar Nova</p>
          </div>
        </div>
      </main>

      {/* Footer Space */}
      <footer className="mt-20 py-8 border-t border-gray-200 dark:border-white/10 text-center">
        <p className="text-sm text-gray-500">© 2024 Admin Panel - FitnessPlatform</p>
      </footer>
    </div>
  );
};