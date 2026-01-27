import React from 'react';
import { Icon } from './Icon';

interface EditMedalProps {
  onBack: () => void;
}

export const EditMedal: React.FC<EditMedalProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 h-16 max-w-screen-xl mx-auto w-full justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-[#f0f0f0] hover:opacity-70 transition-opacity"
          >
            <Icon name="arrow_back_ios" className="text-lg" />
            <p className="text-base font-medium leading-normal tracking-[0.015em]">Voltar</p>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] absolute left-1/2 -translate-x-1/2">Editar Medalha</h2>
          <div className="w-12"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full pb-32">
        {/* Image Preview / Replacement Section */}
        <section className="p-4 flex flex-col items-center">
          <div className="w-full max-w-xs aspect-square bg-[#282828] rounded-xl overflow-hidden relative group border border-white/5">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-uWP9jjUJcuCes0tl_V8DORtR_HG8zDMLVntaxiAmHTFDPEU0V8SXMA91AuR1yuvouEADSdZUdYuDZFCTKIrivANqaB3tHRL8_I1ehAImkDfGXFgIYajqdYqvcgOZcSNBPQeSR6inACWV40NI8WX62ShycLE58Oeyv91MMDjbpty30V7UjJyc-ukrPMxqqGw5_daM2_ah2Lu9uYCV0vXyHw_wwdeNWuU8zR9OL-Zm8OJcC1PKEVeg26AtODixyEmzlFb0UfCUShPq")' }}
            >
            </div>
            {/* Overlay for substitution action */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-6 backdrop-blur-[2px]">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Icon name="upload" className="text-xl" />
                <span className="text-sm font-bold uppercase tracking-wider">Substituir PNG</span>
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Recomendado: 512x512px (Fundo transparente)</p>
        </section>

        {/* Form Section */}
        <section className="flex flex-col gap-2 px-4 mt-4">
          {/* TextField: Título da Medalha */}
          <div className="flex flex-col gap-2 py-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-700 dark:text-[#f0f0f0] text-base font-medium leading-normal pb-2">Título da Medalha</p>
              <input 
                className="flex w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-gray-200 dark:bg-[#282828] h-14 placeholder:text-gray-500 dark:placeholder:text-[#bc9aa3] p-4 text-base font-normal leading-normal" 
                placeholder="Ex: Desafio de Verão" 
                type="text" 
                defaultValue="Maratonista de Elite"
              />
            </label>
          </div>

          {/* TextField: Pontos para Conquistar */}
          <div className="flex flex-col gap-2 py-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-700 dark:text-[#f0f0f0] text-base font-medium leading-normal pb-2">Pontos para Conquistar</p>
              <div className="relative">
                <input 
                  className="flex w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-gray-200 dark:bg-[#282828] h-14 placeholder:text-gray-500 dark:placeholder:text-[#bc9aa3] p-4 text-base font-normal leading-normal" 
                  inputMode="numeric" 
                  placeholder="0" 
                  type="number" 
                  defaultValue="1500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#bc9aa3] font-medium">PTS</span>
              </div>
            </label>
          </div>

          {/* Category Display (Static/Extra Context) */}
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <Icon name="info" className="text-primary" />
              <div>
                <p className="text-sm font-bold text-primary uppercase">Status da Conquista</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Esta medalha está visível para todos os usuários ativos na plataforma.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Footer Action */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary hover:bg-opacity-90 active:scale-[0.98] transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20">
            <span className="truncate uppercase">Salvar Alterações</span>
          </button>
        </div>
      </footer>
    </div>
  );
};