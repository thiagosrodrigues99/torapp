import React, { useState } from 'react';
import { Icon } from './Icon';
import { CommissionPayment } from './CommissionPayment';
import { InfluencerSales } from './InfluencerSales';
import { EditInfluencer } from './EditInfluencer';

interface InfluencersManagementProps {
  onBack: () => void;
}

export const InfluencersManagement: React.FC<InfluencersManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'payment' | 'sales' | 'edit'>('list');

  if (view === 'payment') {
    return <CommissionPayment onBack={() => setView('list')} />;
  }

  if (view === 'sales') {
    return <InfluencerSales onBack={() => setView('list')} />;
  }

  if (view === 'edit') {
    return <EditInfluencer onBack={() => setView('list')} />;
  }

  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" className="text-xl" />
            </button>
            <h2 className="text-lg lg:text-xl font-bold tracking-tight uppercase italic text-white leading-tight">Gestão de Comissões e Perfil</h2>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="bg-primary hover:bg-[#b50031] text-white p-2.5 lg:px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2">
              <Icon name="add_circle" className="text-lg" />
              <span className="hidden sm:inline">Cadastrar Influenciador</span>
            </button>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors relative">
                <Icon name="notifications" className="text-2xl" />
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
              </button>
              <button className="flex items-center gap-3 px-1 lg:px-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold uppercase leading-none">Administrador</p>
                  <p className="text-[9px] text-slate-500 uppercase">Acesso Total</p>
                </div>
                <Icon name="account_circle" className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 lg:p-8 w-full max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
        
        {/* FILTER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card-dark/50 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="calendar_month" />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Período de Análise</h3>
              <p className="text-sm font-bold text-white">Outubro 2023</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <select className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-xs font-bold text-[#f0f0f0] focus:ring-primary focus:border-primary cursor-pointer w-full md:w-48 transition-all hover:bg-white/5">
                <option value="2023-10">Outubro 2023</option>
                <option value="2023-09">Setembro 2023</option>
                <option value="2023-08">Agosto 2023</option>
                <option value="2023-07">Julho 2023</option>
                <option value="2023-06">Junho 2023</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xl">
                 <Icon name="expand_more" />
              </span>
            </div>
            <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5">
              <Icon name="filter_list" />
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="groups" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Influenciadores</p>
              <p className="text-3xl font-black text-white mt-1">142</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Icon name="payments" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vendas por Cupom (R$)</p>
              <p className="text-3xl font-black text-white mt-1">R$ 84.250,00</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Icon name="account_balance_wallet" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comissões Pendentes</p>
              <p className="text-3xl font-black text-white mt-1">R$ 12.420,00</p>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <h3 className="text-sm font-black uppercase tracking-widest">Base de Parceiros</h3>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  <Icon name="search" />
                </span>
                <input className="bg-[#1a1a1a] border-white/5 rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-primary focus:border-primary w-full text-white placeholder:text-slate-500 outline-none" placeholder="Buscar influenciador..." type="text"/>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Influenciador</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Cupom</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">Status Cupom</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Chave Pix</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Comissão Out/23</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status Pagamento</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Bruno Siqueira */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                        <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9eqzLjWMoEKw6Rf-IeFtwjc7fyq6qtwYC1wgjGo4D5Z6RRWtfdQLIz-tdNze5fxS9zfrPwEI5RyJFPoFJ21Azk-09wQ-ahVEfmujnYI3_i7W2kHTIHL4xPIisGIqbzZX3eYfVv08cYbPgZaBJIRZ72qSIaV49DaUUV_yb4HVxsb_fwhJRNfFacexASlA-xbno_C78HapiRGfzr_fFE_D58c44gpbmarMLWDX1hBegbyuDspEKyoSJ-Ugu9rHzKYFwO99yMfr28CWi"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Bruno Siqueira</p>
                        <p className="text-[10px] text-slate-500">@brunosiqueira_fit</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/10 text-primary text-[11px] font-black px-3 py-1 rounded-md uppercase">BRUNO10</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox"/>
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300 font-mono">bruno.pix@gmail.com</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-black text-white">R$ 1.450,00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase">
                      <span className="size-1.5 rounded-full bg-amber-500"></span>
                      Pendente
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setView('edit')}
                        className="p-2 text-white hover:text-primary transition-colors flex items-center justify-center rounded-lg hover:bg-white/5 border border-white/5" 
                        title="Editar Perfil"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button 
                        onClick={() => setView('payment')}
                        className="px-3 py-2 text-[10px] font-black uppercase bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors shadow-lg shadow-green-500/20"
                      >
                        Pagar
                      </button>
                      <button 
                        onClick={() => setView('sales')}
                        className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                      >
                        Vendas
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Juliana Mello */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                        <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmuSh7j5PT13wC5cwBmEyzOzHUcq0qvR7DTc3jOE24rHuKu7yp4UbzWORssxWmohqySGQ1UkPEOoamh1t7gCB7IHA-57TCj67yH5sXJmdeXfsPOhgSAxys2iK9xtOI2JfceoTG8H0hDrgDX0nAiFFYbU0NPSXcCjEMWyII2DTDWDX-ehblqZNFOkbUaExAXyfroUSOHMt-8B7trkROWQhNvWNUdL5zlT9lvk2yxR3Zjmey5aQLSsQxWa-FEHiaNtbv6qed0wMRM2yv"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Juliana Mello</p>
                        <p className="text-[10px] text-slate-500">@juliana_wellness</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/10 text-primary text-[11px] font-black px-3 py-1 rounded-md uppercase">JULI15OFF</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox"/>
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300 font-mono">45.823.123/0001-90</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-black text-white">R$ 2.890,00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      Pago
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setView('edit')}
                        className="p-2 text-white hover:text-primary transition-colors flex items-center justify-center rounded-lg hover:bg-white/5 border border-white/5" 
                        title="Editar Perfil"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 text-slate-500 cursor-not-allowed rounded-lg transition-colors" disabled>Pago</button>
                      <button 
                        onClick={() => setView('sales')}
                        className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                      >
                        Vendas
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Ricardo Lima */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-white/10 flex-shrink-0">
                        <img alt="Avatar" className="w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI6hy5xDwrniXxq9J2iWmuSEsQLn0O3RHegp_Cua4-5lafedAV3EzR70JPYtpyqYCgpe4IO0BnPqTP4UbEBiOE4YC8ZWo0V1U2klN_kcVeYTTfcMVNkh_JoeiPErABzaDvc4KNfSp3EJHZYXCjVg24aQI_RMWACOG_mRwBP5V1kBIWVwGU4y_g4o5Ia2B0CVLtOdTIxDSl_CVGJVyliTcJ3zpMG-nyIj5ddTSdwv2381qGJV59Q7FVwPPu0W8Q45Jld7NcLJh4sfs5"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-400">Ricardo Lima</p>
                        <p className="text-[10px] text-slate-600">@ricardolima_coach</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white/5 text-slate-500 text-[11px] font-black px-3 py-1 rounded-md uppercase">RICARDO5</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox"/>
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 font-mono">ricardo@lima.com</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-black text-slate-500">R$ 0,00</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-500 uppercase">
                      <span className="size-1.5 rounded-full bg-slate-500"></span>
                      Inativo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setView('edit')}
                        className="p-2 text-white hover:text-primary transition-colors flex items-center justify-center rounded-lg hover:bg-white/5 border border-white/5" 
                        title="Editar Perfil"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 text-slate-500 cursor-not-allowed rounded-lg transition-colors" disabled>Sem Comissão</button>
                      <button 
                        onClick={() => setView('sales')}
                        className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                      >
                        Vendas
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Exibindo 3 de 142 influenciadores</p>
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
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">© 2024 Fitness Platform • Gestão de Dados</p>
        </div>
      </main>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
      </div>
    </div>
  );
};