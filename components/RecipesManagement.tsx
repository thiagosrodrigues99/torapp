import React, { useState } from 'react';
import { Icon } from './Icon';
import { EditRecipe } from './EditRecipe';

interface RecipesManagementProps {
  onBack: () => void;
}

export const RecipesManagement: React.FC<RecipesManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (view === 'edit') {
    return <EditRecipe onBack={() => setView('list')} />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen font-display">
      {/* Modal Overlay */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-dark w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-4 text-white">Cadastrar Nova Categoria</h3>
            <div className="space-y-4">
              <div className="flex flex-col w-full">
                <p className="text-xs font-medium pb-2 text-gray-400">Nome da Categoria</p>
                <input className="w-full rounded-lg border-none bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none placeholder:text-[#bc9aa3] text-white" placeholder="Ex: Veganas" type="text"/>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 flex items-center justify-center h-12 rounded-lg font-bold text-sm text-gray-400 hover:bg-white/5 transition-colors"
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

      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-gray-200 dark:border-white/10 justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors"
          >
            <Icon name="arrow_back_ios_new" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Gestão de Receitas</h2>
        </div>
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-white/10">
            <Icon name="more_vert" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-20">
        <div className="px-4 pt-6">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Cadastrar Nova Receita</h2>
        </div>
        
        <section className="mt-4 px-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm space-y-4 border border-gray-100 dark:border-transparent">
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Título da Receita</p>
              <input className="w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3]" placeholder="Ex: Omelete de Espinafre" type="text"/>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Descrição/Modo de Preparo</p>
              <textarea className="w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] min-h-32 p-4 text-base focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3] resize-none" placeholder="Descreva o passo a passo..."></textarea>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Categoria</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select className="appearance-none w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none pr-10 text-gray-900 dark:text-white">
                    <option value="">Selecione uma categoria</option>
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
                  className="size-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/10"
                >
                  <Icon name="add" />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Upload de Imagem</p>
              <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-[#3a272c]/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3a272c]/50 transition-colors">
                <Icon name="add_a_photo" className="text-4xl text-gray-400 dark:text-white/40" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Toque para selecionar imagem</span>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors mt-2 text-base uppercase tracking-wider shadow-lg shadow-primary/20">
                CADASTRAR RECEITA
            </button>
          </div>
        </section>

        <div className="h-8"></div>
        
        <div className="px-4">
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Receitas Cadastradas</h2>
        </div>
        
        <div className="px-4 mt-4 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="search" />
            </span>
            <input className="w-full rounded-lg border-none bg-white dark:bg-surface-dark h-11 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-400 border border-gray-100 dark:border-transparent shadow-sm" placeholder="Buscar receitas..." type="text"/>
          </div>
          <div className="relative">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-11 px-4 flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-100 dark:border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 dark:text-white"
            >
                <Icon name="filter_list" className="text-primary text-xl" />
                <span className="hidden sm:inline">Filtrar</span>
            </button>
            {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                    <div className="p-1 flex flex-col">
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold bg-primary text-white rounded-lg text-left transition-colors">
                            <Icon name="check_circle" className="text-lg" />
                            Todas
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-94 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left transition-colors">
                            <span className="size-2 rounded-full bg-gray-400"></span>
                            Café da manhã
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-94 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left transition-colors">
                            <span className="size-2 rounded-full bg-gray-400"></span>
                            Almoço
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-94 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left transition-colors">
                            <span className="size-2 rounded-full bg-gray-400"></span>
                            Janta
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-94 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left transition-colors">
                            <span className="size-2 rounded-full bg-gray-400"></span>
                            Lanches
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-94 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left transition-colors">
                            <span className="size-2 rounded-full bg-gray-400"></span>
                            Doces
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="mt-6 px-4 space-y-3">
          <RecipeItem 
            title="Omelete Fit de Espinafre"
            category="Café da Manhã"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDEuc6XT47ffBJWm5pzzHmkob6f8R_VKEoJGg1g_D1rt9h2DdkUbo3QwpW7d-GKY7u1tcBsc10a-Z0nquDGf8pHx8m4nJfovkqykqob7hL00aY8lH-ZTeH1u1LqIjIdoF9rpje40lX5FXZnywnQy05i8RsuilcG-DQKba5HPZ3y7HpWUdkuuFoEkJnGaEDdZB9x6lkmgwGHiqVGVTEou8WrBVmrPDQWGn9Z9A92YRVU3p2ezEV24gI3eNv6-hMTx7VBdoWE7WxPeCXL"
            onEdit={() => setView('edit')}
          />
          <RecipeItem 
            title="Bowl de Salmão e Quinoa"
            category="Almoço"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCVjkZM441ZNDwqquZdIARTt18crnuboy04y0_vsRBgjQmF94IMpBUJ1s8Fj36x5-AAZyiF1FkeAZDzCPRrhqUIuChtF2CZ4GlPyRhhcJyhsV9APihXC5Yvg9WpFOxZIfzd8cNGBOaziLFtbNBKi19JZByX0vr7dBqTyLrgZwI_fkmtDMlbjqPMJdMu3FjzuN-s93n6s6F4vc3RYGV1bUEE_W5QJHHnkNf2S3ZbbMK9Efvw5cSM8q1ZDsi2yCIX_myLrGkNRvImW6CV"
            onEdit={() => setView('edit')}
          />
          <RecipeItem 
            title="Bolo de Cacau Proteico"
            category="Doces"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuARPyM0QSjGUdmZExT_6K9at8GHQW_0y-7jDZ1lP_a2Vk2xL6kpr2h9kDgQ6Fu8gupxW2kDlOZhVtukUIT62YHi126ipkiULB5nOKCHPX_ECC-n8arafowURK8HZPhaGO883VyCw4XzSM2tAiiIVse0Kz5hyG9FAQDdHIMbi5xPoX5iOkQK3HcEaMHcuwXJAocDHpzbUBqmiQlx1lh8n_9idPUKvtSM7AmEtDpYvyU3sZ8yP50gaO-Tf48o1IC6VQtnm7K536EL-sw6"
            onEdit={() => setView('edit')}
          />
        </div>
      </main>
    </div>
  );
};

const RecipeItem = ({ title, category, image, onEdit }: { title: string, category: string, image: string, onEdit?: () => void }) => (
  <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-transparent">
    <img alt="Receita" className="size-20 rounded-lg object-cover bg-gray-200" src={image}/>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-base truncate text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xs text-primary font-medium mt-1">{category}</p>
    </div>
    <div className="flex items-center gap-1">
      <button 
        onClick={onEdit}
        className="size-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-primary transition-colors"
      >
        <Icon name="edit" className="text-xl" />
      </button>
      <button className="size-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
        <Icon name="delete" className="text-xl" />
      </button>
    </div>
  </div>
);