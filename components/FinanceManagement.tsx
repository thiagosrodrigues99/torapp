import React from 'react';
import { Icon } from './Icon';

interface FinanceManagementProps {
  onBack: () => void;
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({ onBack }) => {
  return (
    <div className="bg-[#141414] min-h-screen text-slate-100 font-manrope">
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex items-center bg-[#141414]/80 backdrop-blur-md px-4 md:px-8 py-6 justify-between border-b border-gray-800">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors md:hidden">
                <Icon name="arrow_back" />
              </button>
              <div className="text-primary flex items-center gap-3">
                <Icon name="fitness_center" className="text-3xl font-bold" />
                <span className="text-xl font-extrabold tracking-tight hidden md:block">FITADMIN</span>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-800 hidden md:block"></div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Gestão Financeira</h1>
              <p className="text-slate-400 text-xs md:text-sm">Visão geral do desempenho financeiro</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative w-40 md:w-64 hidden sm:block">
              <select className="appearance-none w-full rounded-xl text-white border border-gray-800 bg-[#1e1e1e] h-11 px-4 pr-10 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer outline-none">
                <option value="out23">Outubro 2023</option>
                <option value="set23">Setembro 2023</option>
                <option value="ago23">Agosto 2023</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
                <Icon name="calendar_month" className="text-xl" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center size-11 rounded-xl bg-[#1e1e1e] border border-gray-800 text-slate-300 hover:text-primary transition-colors">
                <Icon name="notifications" />
              </button>
              <button className="flex items-center justify-center size-11 rounded-xl bg-[#1e1e1e] border border-gray-800 text-slate-300 hover:text-primary transition-colors hidden sm:flex">
                <Icon name="download" />
              </button>
              <div className="h-11 w-px bg-gray-800 ml-2 hidden xl:block"></div>
              <div className="flex items-center gap-3 pl-2 hidden xl:flex">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">AD</div>
                <div>
                  <p className="text-sm font-bold">Admin Master</p>
                  <p className="text-xs text-slate-500">Sair</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-primary rounded-2xl p-6 shadow-xl shadow-primary/10 relative overflow-hidden flex flex-col justify-between h-40">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Icon name="account_balance" className="text-8xl" />
              </div>
              <div className="relative z-10">
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.1em]">Lucro Líquido</p>
                <h3 className="text-3xl font-extrabold mt-1">R$ 45.280,00</h3>
              </div>
              <div className="relative z-10 flex items-center gap-1.5 text-white/80 text-xs">
                <Icon name="check_circle" className="text-sm" />
                <span>Líquido mensal</span>
              </div>
            </div>
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">Teste Grátis</p>
                  <Icon name="person_add" className="text-primary text-xl" />
                </div>
                <h3 className="text-3xl font-extrabold">128</h3>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Icon name="trending_up" className="text-sm" />
                <span>+8% este mês</span>
              </div>
            </div>
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">Pagos</p>
                  <Icon name="verified" className="text-primary text-xl" />
                </div>
                <h3 className="text-3xl font-extrabold">854</h3>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Icon name="trending_up" className="text-sm" />
                <span>+15% este mês</span>
              </div>
            </div>
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">Faturado Bruto</p>
                  <Icon name="payments" className="text-primary text-xl" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-100">R$ 58.000</h3>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">Comissões</p>
                  <Icon name="send_money" className="text-primary text-xl" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-100">R$ 12.720</h3>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-[22%]"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold">Crescimento de Receita</h3>
                  <p className="text-sm text-slate-500">Comparativo dos últimos 6 meses</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 text-xs font-bold bg-gray-800 rounded-lg text-slate-400">Mensal</button>
                  <button className="px-4 py-1.5 text-xs font-bold bg-primary rounded-lg text-white">Semanal</button>
                </div>
              </div>
              <div className="flex items-end justify-between h-80 gap-2 sm:gap-6 px-4">
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-primary/20 hover:bg-primary/30 rounded-t-xl h-[40%] transition-all"></div>
                  <span className="text-xs text-slate-500 font-bold">MAI</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-primary/30 hover:bg-primary/40 rounded-t-xl h-[60%] transition-all"></div>
                  <span className="text-xs text-slate-500 font-bold">JUN</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-primary/40 hover:bg-primary/50 rounded-t-xl h-[55%] transition-all"></div>
                  <span className="text-xs text-slate-500 font-bold">JUL</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-primary/60 hover:bg-primary/70 rounded-t-xl h-[75%] transition-all"></div>
                  <span className="text-xs text-slate-500 font-bold">AGO</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-primary/80 hover:bg-primary/90 rounded-t-xl h-[65%] transition-all"></div>
                  <span className="text-xs text-slate-500 font-bold">SET</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full bg-primary rounded-t-xl h-[95%] relative transition-all shadow-lg shadow-primary/20">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-background-dark font-bold text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap hidden group-hover:block sm:block">
                        R$ 58.000,00
                    </div>
                  </div>
                  <span className="text-xs text-primary font-black uppercase">OUT</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Últimos Lançamentos</h3>
                <button className="text-primary hover:text-red-400 text-sm font-bold transition-colors">Ver todos</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414]/50 border border-gray-800/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Icon name="add_circle" className="font-bold" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold group-hover:text-primary transition-colors">Assinatura Premium</p>
                      <p className="text-xs text-slate-500">Ricardo Almeida • 14:30</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-emerald-500">+ R$ 129,90</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414]/50 border border-gray-800/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon name="account_balance_wallet" className="font-bold" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold group-hover:text-primary transition-colors">Comissão Parceiro</p>
                      <p className="text-xs text-slate-500">ID #9822 • 11:20</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-primary">- R$ 25,98</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414]/50 border border-gray-800/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Icon name="add_circle" className="font-bold" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold group-hover:text-primary transition-colors">Mensalidade Ativa</p>
                      <p className="text-xs text-slate-500">Carla Souze • 09:15</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-emerald-500">+ R$ 89,90</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414]/50 border border-gray-800/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon name="account_balance_wallet" className="font-bold" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold group-hover:text-primary transition-colors">Saque Efetuado</p>
                      <p className="text-xs text-slate-500">Transferência • Ontem</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-primary">- R$ 1.200,00</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};