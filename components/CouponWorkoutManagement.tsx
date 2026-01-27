import React from 'react';
import { Icon } from './Icon';

interface CouponWorkoutManagementProps {
  onBack: () => void;
}

export const CouponWorkoutManagement: React.FC<CouponWorkoutManagementProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-border-dark p-4 justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Gestão de Treino por Cupom</h1>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark">
          <Icon name="more_vert" className="text-white" />
        </button>
      </header>
      
      <main className="max-w-xl mx-auto pb-10">
        <section className="px-4 pt-6 pb-2">
          <div className="bg-surface-dark/50 border border-primary/20 p-4 rounded-xl">
            <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-3">Filtro de Campanha</h3>
            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium leading-normal pb-2">Selecionar Cupom de Influenciador</p>
              <div className="relative">
                <select className="appearance-none flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-surface-dark h-14 px-[15px] text-base font-normal leading-normal">
                  <option value="bruno10">BRUNO10 - Bruno Gym Pro</option>
                  <option value="mara_fit">MARA_FIT - Mara Health</option>
                  <option value="power_up">POWER_UP - Desafio 30 Dias</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Icon name="expand_more" />
                </div>
              </div>
            </label>
            <p className="text-gray-400 text-xs mt-2 italic">A seleção define qual plano de treino será editado abaixo.</p>
          </div>
        </section>

        <section className="px-4 pt-6">
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
            <Icon name="add_circle" className="text-primary" />
            Adicionar Novo Exercício
          </h2>
          <div className="space-y-4 bg-surface-dark p-5 rounded-xl border border-[#333333]">
            <div>
              <label className="text-white text-sm font-medium mb-1.5 block">Buscar no Banco de Dados</label>
              <div className="relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-background-dark h-14 pl-12 pr-4 text-base font-normal" 
                  placeholder="BUSCAR NO BANCO DE DADOS" 
                  type="text"
                />
              </div>
            </div>
            
            <div className="bg-background-dark/50 border border-[#333333] rounded-lg p-4 flex items-center gap-3">
              <div className="size-12 rounded-lg bg-surface-dark flex items-center justify-center border border-[#333333]">
                <Icon name="fitness_center" className="text-primary" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Supino Reto Barra</p>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Peitoral</p>
              </div>
              <button className="ml-auto text-gray-500 hover:text-white">
                <Icon name="close" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">Séries</label>
                <input className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-background-dark h-14 px-4 text-base font-normal" placeholder="Ex: 4" type="number"/>
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">Repetições</label>
                <input className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-background-dark h-14 px-4 text-base font-normal" placeholder="Ex: 12-15" type="text"/>
              </div>
            </div>
            
            <button className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-base transition-transform active:scale-95 shadow-lg shadow-primary/20 mt-2">
              CADASTRAR EXERCÍCIO
            </button>
          </div>
        </section>

        <section className="px-4 pt-10">
          <div className="flex items-center justify-between mb-4 gap-4">
            <h2 className="text-white text-xl font-bold leading-tight tracking-tight whitespace-nowrap">Exercícios Cadastrados</h2>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="relative">
                <select className="appearance-none text-[11px] font-bold bg-surface-dark border border-[#333333] text-white rounded-lg h-8 py-0 pl-2 pr-8 focus:ring-1 focus:ring-primary">
                  <option value="todos">FILTRAR: TODOS</option>
                  <option value="peitoral">PEITORAL</option>
                  <option value="biceps">BÍCEPS</option>
                  <option value="pernas">PERNAS</option>
                  <option value="costas">COSTAS</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Icon name="expand_more" className="text-sm" />
                </div>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/20 whitespace-nowrap">4 TOTAIS</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <CouponWorkoutItem 
              title="Supino Reto Barra" 
              category="Peitoral" 
              series="4" 
              reps="12" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCTsZwdp6qsjaxCxCyXo53cervsmNT96n3afTc2CFXpfLsopFivPojd1nMYrkqsHOsewJ1oYMXnF0GRA7QXQVUuXDxrgqyse6Vx_3ut269CMEgT10eax_wbR7XpUv0gcTQxn1PA0oOH-jNihh9XCu9UPACz1Zov7MD54sxyWg7GS7tZzhL5vD-ct2mPTJn9bCpP4hgRGlUZRy4lgojEK5l0siWh1ziwDq4iJDU5dLT2IbELcbSR_Xh0kBvGKseZJyW9vXQ_eurSGLD-"
            />
            <CouponWorkoutItem 
              title="Rosca Alternada" 
              category="Bíceps" 
              series="3" 
              reps="10" 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAU9zAbbmKP9jnFMZW464IVgV1qh1NREOVV2x6RjRWSoaUWLDGX-fqaxIFWUqUStsuyhDz9pGgAMVfL8j4kwHAN5FSDbM3BYjlfa4nBOIhiaqMm2oIRCi-4bmPAXsQqwlcd0PD8K_JYr2fLV675hRKW8nQpeX2clui61ggD4DV30fW8dtNDO2vQiTydZw3ZpG8oDM94x2VIEA54UwCwlXvpi-qYxmqu3M8gbUGbeOwYYl3gFFRS6TYXte80DgK5x2I4nVN9yNmXjjW-"
            />
            <CouponWorkoutItem 
              title="Agachamento Livre" 
              category="Pernas" 
              series="4" 
              reps="8-10" 
            />
          </div>
        </section>

        <section className="px-4 py-8">
          <button className="w-full bg-transparent border-2 border-primary text-primary h-14 rounded-lg font-bold text-base hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
            <Icon name="save" />
            SALVAR PLANO DE TREINO
          </button>
          <p className="text-center text-gray-500 text-xs mt-4">As alterações serão aplicadas instantaneamente para usuários do cupom <span className="text-white font-bold">BRUNO10</span>.</p>
        </section>
      </main>
    </div>
  );
};

interface CouponWorkoutItemProps {
  title: string;
  category: string;
  series: string;
  reps: string;
  imageUrl?: string;
}

const CouponWorkoutItem: React.FC<CouponWorkoutItemProps> = ({ title, category, series, reps, imageUrl }) => (
  <div className="flex items-center gap-4 bg-surface-dark border border-[#333333] p-3 rounded-xl">
    <div className="size-20 rounded-lg overflow-hidden bg-background-dark flex-shrink-0 relative">
      {imageUrl ? (
        <img alt={title} className="w-full h-full object-cover opacity-80" src={imageUrl} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Icon name="image" className="text-gray-600 text-3xl" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon name="play_circle" className="text-white/50 text-xl" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-bold text-base truncate">{title}</h4>
      <p className="text-gray-400 text-xs uppercase tracking-wide">{category}</p>
      <div className="flex gap-3 mt-1.5">
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          <Icon name="reorder" className="text-sm" /> {series} Séries
        </div>
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          <Icon name="repeat" className="text-sm" /> {reps} Reps
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <button className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#333333]">
        <Icon name="edit" className="text-[20px]" />
      </button>
      <button className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10">
        <Icon name="delete" className="text-[20px]" />
      </button>
    </div>
  </div>
);
