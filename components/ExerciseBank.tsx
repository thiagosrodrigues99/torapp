import React from 'react';
import { Icon } from './Icon';

interface ExerciseBankProps {
  onBack: () => void;
}

export const ExerciseBank: React.FC<ExerciseBankProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen font-display">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex items-center bg-[#141414] border-b border-[#281b1e] p-4 justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={onBack}
            className="text-white flex size-10 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
          >
            <Icon name="arrow_back" />
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Banco de Exercícios</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-[#281b1e] text-white hover:bg-white/10 transition-colors">
            <Icon name="account_circle" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-10">
        {/* HeadlineText: Form Section */}
        <div className="px-4 pt-6">
          <h3 className="text-white tracking-tight text-2xl font-bold leading-tight">Cadastrar Novo Exercício</h3>
          <p className="text-[#bc9aa3] text-sm mt-1">Adicione novos itens à sua base de dados</p>
        </div>

        {/* Form Container */}
        <div className="flex flex-col gap-1 mt-4">
          {/* TextField: Título */}
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Título do Exercício</p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#563941] bg-[#1e1e1e] focus:border-primary h-14 placeholder:text-[#bc9aa3] p-[15px] text-base font-normal leading-normal transition-all" 
                placeholder="Ex: Agachamento Livre" 
                type="text"
              />
            </label>
          </div>

          {/* TextField: Grupo Muscular with Add Action */}
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <div className="flex justify-between items-center pb-2">
                <p className="text-white text-base font-medium leading-normal">Grupo Muscular</p>
                <button className="text-primary text-sm flex items-center gap-1 font-bold hover:text-white transition-colors">
                  <Icon name="add_circle" className="text-sm" />
                  Novo
                </button>
              </div>
              <div className="relative">
                <select className="appearance-none form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#563941] bg-[#1e1e1e] focus:border-primary h-14 placeholder:text-[#bc9aa3] p-[15px] text-base font-normal leading-normal transition-all">
                  <option value="">Selecione um grupo</option>
                  <option value="pernas">Pernas</option>
                  <option value="peito">Peito</option>
                  <option value="costas">Costas</option>
                  <option value="ombros">Ombros</option>
                  <option value="bracos">Braços</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#bc9aa3]">
                  <Icon name="expand_more" />
                </div>
              </div>
            </label>
          </div>

          {/* EmptyState: Media Upload */}
          <div className="px-4 py-3">
            <p className="text-white text-base font-medium leading-normal pb-2">Demonstração (GIF ou Vídeo)</p>
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#563941] bg-[#1e1e1e]/50 px-6 py-10 transition-colors hover:bg-[#1e1e1e] cursor-pointer group">
              <div className="flex flex-col items-center gap-2">
                <Icon name="cloud_upload" className="text-primary text-4xl mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-white text-lg font-bold leading-tight tracking-tight text-center">Upload de Mídia</p>
                <p className="text-[#bc9aa3] text-sm font-normal leading-normal text-center">Arraste e solte ou toque para selecionar</p>
              </div>
              <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3a272c] text-white text-sm font-bold leading-normal tracking-wide hover:bg-[#4a373c] transition-colors">
                <span className="truncate">Selecionar Arquivo</span>
              </button>
            </div>
          </div>

          {/* Main Action Button */}
          <div className="px-4 py-6">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95">
              <Icon name="save" />
              SALVAR NO BANCO
            </button>
          </div>
        </div>

        <div className="h-4 bg-[#141414] border-t border-[#281b1e] mt-4"></div>

        {/* Library Section */}
        <section className="mt-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-xl font-bold">Biblioteca</h3>
            <span className="text-[#bc9aa3] text-sm">142 exercícios</span>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bc9aa3]">
                <Icon name="search" />
              </span>
              <input 
                className="w-full bg-[#1e1e1e] border border-[#563941] rounded-lg h-11 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-[#bc9aa3] transition-all" 
                placeholder="Buscar exercício..." 
                type="text"
              />
            </div>
            <button className="w-11 h-11 flex items-center justify-center bg-[#1e1e1e] border border-[#563941] rounded-lg text-white hover:bg-white/5 transition-colors">
              <Icon name="filter_list" />
            </button>
          </div>

          {/* Exercise List */}
          <div className="flex flex-col gap-3">
            <ExerciseItem 
              title="Leg Press 45º" 
              muscle="Pernas" 
              muscleColor="text-primary bg-primary/20"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6YQOPHL6OX5fKaP-0QeOrAStftTM9Zl81JzSzt1plX56MI0kSeaizl97z26CPWHf-xgWl3wmIQBsGEK6B6irJD2FEdKVqOsLKTFJtg_AGctRao6C3l6Em5bfEd9duT0iJvDI5e61ViJk3LWdYkVg7I-aiBWhdlAMSOIuDd9xQ8sALJAhMGkJau8s2DbWr84z8ZhjlGCyGtdqn4WwUr-kANaRDlFuO1jmUt_UcCtQad2H__DGuunbhyecSTstttq0YSENMPZqYwpt"
            />
            <ExerciseItem 
              title="Supino Inclinado" 
              muscle="Peito" 
              muscleColor="text-blue-400 bg-blue-500/20"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKpie_2GRagQjk4ch0yYH3Zm5ELuZJp9uI-Dby93uofvr6WJYrXXze6rPIPh5RQVfAYcT7k--yXVGXAS80yekQZ-L2_PcKYdSSzGnQDINk3M4XwVjWdbD20tQxRazgvkg1E-zFoGn_zwOQSkmc4Kz_DUUL3rXEdNg_zNIKQLCk2tunRb9i0J6-KNVXSqsm5YGA-yQUltwfWxp4yOd8MKWB0JU82ryHKujcc1KfEg0JXeb0z8o_yB-PXxZJ6Q_ky2pUUyHsIbOSR7m"
            />
            <ExerciseItem 
              title="Elevação Lateral" 
              muscle="Ombros" 
              muscleColor="text-purple-400 bg-purple-500/20"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCPBjhXSoyTFl02Rr1Q6CbZ7UIIBgxOhdzBwY0CsyZTNBmt2P1TywYrbpiBVmKKkW-Wfq9DAmc27LMC1krT-CAUummRAnDxh4sdIS5ZdEBxdnbuHnPrSXxtqnJztxP46iJg-Fcull8T9wbLSVd4wKiaAguBt3ZyzAf8h47wsf_-8w6f3DLcQo0uSGT8bMSVkwCo1as5E2DbJhXcWywmedmrEjYLfC1KlAUGOqkuNZ8-j17-dMSYGvtzkdqUoH8L-VcaLcL5VbDOxbqL"
            />
          </div>

          {/* Load More Button */}
          <button className="mt-2 w-full py-3 text-[#bc9aa3] text-sm font-medium hover:text-white transition-colors">
            Carregar mais exercícios...
          </button>
        </section>
      </main>
    </div>
  );
};

const ExerciseItem = ({ title, muscle, muscleColor, image }: { title: string, muscle: string, muscleColor: string, image: string }) => (
  <div className="flex items-center gap-3 p-3 bg-[#1e1e1e] rounded-xl border border-[#281b1e]">
    <div className="w-16 h-16 rounded-lg bg-[#281b1e] overflow-hidden flex-shrink-0">
      <img className="w-full h-full object-cover" alt={title} src={image}/>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-semibold truncate">{title}</h4>
      <div className="flex gap-2 mt-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${muscleColor}`}>{muscle}</span>
      </div>
    </div>
    <div className="flex gap-1">
      <button className="p-2 text-[#bc9aa3] hover:text-white transition-colors">
        <Icon name="edit" className="text-xl" />
      </button>
      <button className="p-2 text-[#bc9aa3] hover:text-primary transition-colors">
        <Icon name="delete" className="text-xl" />
      </button>
    </div>
  </div>
);