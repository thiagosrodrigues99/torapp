import React from 'react';
import { Icon } from './Icon';

interface RecipesListProps {
  onBack: () => void;
  onRecipeClick: () => void;
}

export const RecipesList: React.FC<RecipesListProps> = ({ onBack, onRecipeClick }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased font-jakarta">
      <div className="recipe-list-container flex flex-col min-h-screen pb-24">
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center p-4 justify-between">
            <div 
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Icon name="arrow_back_ios_new" className="text-slate-900 dark:text-white" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Almoço</h2>
          </div>
        </header>

        <div className="px-4 py-2">
          <button className="w-full flex items-center justify-between bg-card-dark border border-primary-accent rounded-xl px-4 py-3 text-text-main transition-colors active:bg-zinc-800">
            <div className="flex items-center gap-3">
              <Icon name="restaurant_menu" className="text-primary-accent" />
              <span className="font-semibold text-sm">Trocar Categoria</span>
            </div>
            <Icon name="expand_more" className="text-primary-accent" />
          </button>
        </div>

        <div className="px-4 py-2">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-primary flex border-none bg-slate-200 dark:bg-card-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <Icon name="search" />
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-200 dark:bg-card-dark focus:border-none h-full placeholder:text-slate-500 dark:placeholder:text-[#bc9aa3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                placeholder="Buscar receitas..." 
              />
            </div>
          </label>
        </div>

        <main className="flex-1 overflow-y-auto pt-2">
          <div className="p-4 @container">
            <div 
              onClick={onRecipeClick}
              className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-card-dark overflow-hidden transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div 
                className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAayopf32A3rAZFqc2iO8ZEwR5JKN8KGOcLJkSfU8LDUXwp9uH7Zrx9BA8_qSQ_JP5NoCv023xnr4Gg_qMbEIGREFM33Gkyp9GIjm2ntzoG6dzAcHONz07QOHQL5u0gogDX9VcofQLkuYowt1GWs-_A1TTSLWdlk11qMlnr-ydpHu8vVxmEtu8oOVUJ82MYnITA1B_CpR4gl8GsdwsT566jdr_pALOLSKF01sRjM9mFySUkqMbpBK-15cm0JUDlyh_1-lcPjDSoo704")' }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Destaque</span>
                </div>
              </div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Frango Grelhado com Legumes</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="schedule" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">20 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="local_fire_department" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">350 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 @container">
            <div 
              onClick={onRecipeClick}
              className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-card-dark overflow-hidden transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div 
                className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0PdCZzW0Ot9B0Jj8cDL-Mn19ONkurMKVmle5uaat-GGbWWJdPgS-8Z0kwh11yYsyDoqQ00m62VOHszp8arJ639r8KQfLsC5xR3eavEBzXClWn4p91qcyPQ6-AwKNH2bmXUljk83faQ7EpyZ_CJMpqrttJKgnaKZjbxBRTuSdeIZgnti3beNFqSu4g22wJjZJ-NpbbCl4eW-p2LXt3zJtxT-Jd3rVCaW6YUi4zBXFTls4uKaEtSGvud0jXx_D8PONLMk2Dlkdcs8ug")' }}
              >
              </div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Salmão ao Forno</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="schedule" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">25 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="local_fire_department" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">420 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 @container">
            <div 
              onClick={onRecipeClick}
              className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-card-dark overflow-hidden transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div 
                className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJmpwiMlCZNNfc6NcM65XCGysv0mp143n_K8w75uWFVI-YjMiORFPouq2iN1-A0BKJJdV296nB9lb61ipCuOOiX5Ie76ONKcuLrGMwnsWpPbCus9Urb4uGVtFgKrO0d-LJUdReky1DX0EQf428o_0Hz_pvgkzVrzepmKdGrzN9jb5e71TR7VDNDG_VvBNXpUz5CpHl-I-9nPKAOD5ES6bunYhe1SGT7paRfbMSjEg_fAMXyG-BjX3C0HryaTMtFFSh1Rf3-pQ1GhF6")' }}
              >
              </div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Salada Caesar Fit</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="schedule" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">15 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="local_fire_department" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">280 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 @container">
            <div 
              onClick={onRecipeClick}
              className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-card-dark overflow-hidden transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div 
                className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZonmUeLbJp7vFalcElm6pwdS4lgTl_G4cRlXxrFcXxI26UV8sB0xTt2mkBJlLo06HsWpgbZ-IgCR6k8dVtwaDAToSi6z6mn9YhtVnQMqReLf4KNdiF64Etd8XRlwT7QioDtnDEqF4lLKYEqZu_oSm_JEkp9i79WJr5QCnqMVr7HwS_CLnZeVaQsTCSEjgHGfZGNBAP6ZrIO5vuBliL-a6uS8vLaiHqBKQ6G7c_v6CbN4mO6K4XRwc4UZ1jNDiY0NKVjen6nQ2-z1j")' }}
              >
              </div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Pimentão Recheado com Quinoa</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="schedule" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">35 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-[#bc9aa3]">
                    <Icon name="local_fire_department" className="text-[18px] text-primary" />
                    <span className="text-sm font-medium">310 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-card-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-6 py-3">
          <div className="recipe-list-container flex justify-around items-center mx-auto">
            <div 
              onClick={onBack}
              className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer flex-1"
            >
              <Icon name="home" />
              <span className="text-[10px] font-medium">Início</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer flex-1">
              <Icon name="calendar_month" />
              <span className="text-[10px] font-medium">Agenda</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer flex-1">
              <Icon name="groups" />
              <span className="text-[10px] font-medium">Comunidade</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};