import React from 'react';
import { Icon } from './Icon';

interface InfluencerSalesProps {
  onBack: () => void;
}

export const InfluencerSales: React.FC<InfluencerSalesProps> = ({ onBack }) => {
  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight uppercase italic text-white leading-none">Bruno Siqueira</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded border border-primary/20 uppercase">BRUNO10</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Vendas do Influenciador</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors relative">
                <Icon name="notifications" className="text-2xl" />
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
              </button>
              <button className="flex items-center gap-3 px-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold uppercase leading-none">Administrador</p>
                  <p className="text-[9px] text-slate-500 uppercase">Acesso Total</p>
                </div>
                <Icon name="account_circle" className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-8 w-full max-w-[1600px] mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Icon name="payments" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total de Vendas (R$)</p>
              <p className="text-3xl font-black text-white mt-1">R$ 12.450,00</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="account_balance_wallet" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comissão a Pagar (R$)</p>
              <p className="text-3xl font-black text-white mt-1">R$ 1.245,00</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Icon name="query_stats" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversão (%)</p>
              <p className="text-3xl font-black text-white mt-1">4.2%</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="person_add" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuários Cadastrados</p>
              <p className="text-3xl font-black text-white mt-1">1,248</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="timer" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuários em Teste Grátis</p>
              <p className="text-3xl font-black text-white mt-1">342</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="verified_user" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuários Pagos</p>
              <p className="text-3xl font-black text-white mt-1">156</p>
            </div>
          </div>
        </div>
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Relatório de Transações</h3>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl pointer-events-none">
                  <Icon name="calendar_month" />
                </span>
                <select className="bg-[#1a1a1a] border-white/5 rounded-lg pl-10 pr-10 py-2 text-xs focus:ring-primary focus:border-primary w-48 text-[#f0f0f0] cursor-pointer hover:bg-[#222] transition-colors appearance-none">
                  <option defaultValue="out-2023">Outubro 2023</option>
                  <option value="set-2023">Setembro 2023</option>
                  <option value="ago-2023">Agosto 2023</option>
                  <option value="jul-2023">Julho 2023</option>
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  <Icon name="date_range" />
                </span>
                <input className="bg-[#1a1a1a] border-white/5 rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-primary focus:border-primary w-48 text-[#f0f0f0]" readOnly type="text" defaultValue="Últimos 30 dias"/>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Valor da Venda</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status do Pagamento</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Comissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300">12/10/2023 14:35</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-slate-800 flex items-center justify-center">
                        <Icon name="person" className="text-sm text-slate-500" />
                      </div>
                      <p className="text-sm font-medium text-white">Marcos Oliveira</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">R$ 197,90</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      Pago
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-primary">R$ 19,79</p>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300">12/10/2023 11:20</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-slate-800 flex items-center justify-center">
                         <Icon name="person" className="text-sm text-slate-500" />
                      </div>
                      <p className="text-sm font-medium text-white">Ana Paula Silva</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">R$ 450,00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-500 uppercase">
                      <span className="size-1.5 rounded-full bg-yellow-500"></span>
                      Pendente
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-primary">R$ 45,00</p>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300">11/10/2023 20:15</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-slate-800 flex items-center justify-center">
                         <Icon name="person" className="text-sm text-slate-500" />
                      </div>
                      <p className="text-sm font-medium text-white">Lucas Ferreira</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">R$ 197,90</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      Pago
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-primary">R$ 19,79</p>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300">11/10/2023 18:42</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-slate-800 flex items-center justify-center">
                         <Icon name="person" className="text-sm text-slate-500" />
                      </div>
                      <p className="text-sm font-medium text-white">Beatriz Souza</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">R$ 297,00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      Pago
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-primary">R$ 29,70</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Exibindo 4 de 62 transações</p>
            <div className="flex gap-2">
              <button className="size-8 flex items-center justify-center rounded bg-white/5 text-white/50 cursor-not-allowed">
                <Icon name="chevron_left" className="text-lg" />
              </button>
              <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
              <button className="size-8 flex items-center justify-center rounded bg-white/5 text-white hover:bg-white/10 transition-colors font-bold text-xs">2</button>
              <button className="size-8 flex items-center justify-center rounded bg-white/5 text-white hover:bg-white/10 transition-colors font-bold text-xs">3</button>
              <button className="size-8 flex items-center justify-center rounded bg-white/5 text-white hover:bg-white/10 transition-colors">
                 <Icon name="chevron_right" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center py-6">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2">Painel Administrativo</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">© 2024 Fitness Platform • Performance de Influenciador</p>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
      </div>
    </div>
  );
};