import React, { useState } from 'react';
import { Icon } from './Icon';

interface EditRecipeProps {
  onBack: () => void;
}

export const EditRecipe: React.FC<EditRecipeProps> = ({ onBack }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <div className="bg-background-dark text-white min-h-screen font-display">
      {/* Modal Overlay */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-dark w-full max-w-[340px] rounded-2xl p-6 shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-6 text-white text-center">Cadastrar Nova Categoria</h3>
            <div className="space-y-6">
              <div className="flex flex-col w-full">
                <p className="text-xs font-medium pb-2 text-gray-400">Nome da Categoria</p>
                <input className="w-full rounded-lg border border-gray-94 bg-surface-dark h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none text-white placeholder:text-gray-500" placeholder="Ex: Veganas" type="text"/>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 flex items-center justify-center h-12 rounded-lg font-bold text-sm text-gray-300 hover:bg-white/5 transition-colors border border-white/10"
                >
                    CANCELAR
                </button>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 flex items-center justify-center h-12 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    SALVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center bg-background-dark p-4 border-b border-white/10 justify-between">
        <div className="flex items-center gap-1">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-primary hover:opacity-80 transition-opacity"
          >
            <Icon name="chevron_left" className="text-2xl" />
            <span className="text-base font-medium">Voltar</span>
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] absolute left-1/2 -translate-x-1/2">Editar Receita</h2>
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-white/10">
            <Icon name="more_vert" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-10">
        <div className="px-4 pt-6 text-center">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Informações da Receita</h2>
          <p className="text-gray-400 text-sm mt-1">Atualize os dados da sua receita fit.</p>
        </div>

        <section className="mt-6 px-4">
          <div className="bg-surface-dark rounded-2xl p-5 space-y-5 border border-white/5 shadow-xl">
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-300">Título da Receita</p>
              <input className="w-full rounded-lg border-none bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none text-white placeholder:text-[#bc9aa3]" type="text" defaultValue="Omelete Fit de Espinafre"/>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-300">Descrição/Modo de Preparo</p>
              <textarea className="w-full rounded-lg border-none bg-[#3a272c] min-h-40 p-4 text-base focus:ring-2 focus:ring-primary outline-none text-white placeholder:text-[#bc9aa3] resize-none leading-relaxed" defaultValue="Bata os ovos com o espinafre picado. Tempere com sal e pimenta a gosto. Aqueça uma frigideira antiaderente levemente untada e despeje a mistura. Cozinhe em fogo baixo até dourar os dois lados uniformemente. Sirva quente."></textarea>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-300">Categoria</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select className="appearance-none w-full rounded-lg border-none bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none pr-10 text-white" defaultValue="cafe">
                    <option value="cafe">Café da manhã</option>
                    <option value="almoco">Almoço</option>
                    <option value="janta">Janta</option>
                    <option value="lanches">Lanches</option>
                    <option value="doces">Doces</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <Icon name="expand_more" />
                  </div>
                </div>
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="size-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Icon name="add" />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-300">Capa da Receita</p>
              <div className="relative group">
                <img alt="Omelete Fit" className="w-full h-48 rounded-xl object-cover brightness-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEuc6XT47ffBJWm5pzzHmkob6f8R_VKEoJGg1g_D1rt9h2DdkUbo3QwpW7d-GKY7u1tcBsc10a-Z0nquDGf8pHx8m4nJfovkqykqob7hL00aY8lH-ZTeH1u1LqIjIdoF9rpje40lX5FXZnywnQy05i8RsuilcG-DQKba5HPZ3y7HpWUdkuuFoEkJnGaEDdZB9x6lkmgwGHiqVGVTEou8WrBVmrPDQWGn9Z9A92YRVU3p2ezEV24gI3eNv6-hMTx7VBdoWE7WxPeCXL"/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 text-sm font-bold hover:bg-black/80 transition-all text-white">
                    <Icon name="add_a_photo" className="text-xl" />
                    ALTERAR IMAGEM
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors text-base uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-[0.98]">
                  SALVAR ALTERAÇÕES
              </button>
            </div>
          </div>
        </section>
        
        <div className="px-4 mt-6 text-center">
          <button className="text-gray-500 text-sm font-medium hover:text-white transition-colors">
              Excluir Receita
          </button>
        </div>
      </main>
    </div>
  );
};