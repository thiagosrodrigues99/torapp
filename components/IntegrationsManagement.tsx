import React, { useState } from 'react';
import { Icon } from './Icon';
import { MercadoPagoConfig } from './MercadoPagoConfig';
import { SupabaseConfig } from './SupabaseConfig';
import { GoogleAnalyticsConfig } from './GoogleAnalyticsConfig';
import { FacebookPixelConfig } from './FacebookPixelConfig';

interface IntegrationsManagementProps {
  onBack: () => void;
  onLogout: () => void;
}

type IntegrationsView = 'list' | 'mercadopago' | 'supabase' | 'googleanalytics' | 'facebookpixel';

export const IntegrationsManagement: React.FC<IntegrationsManagementProps> = ({ onBack, onLogout }) => {
  const [view, setView] = useState<IntegrationsView>('list');

  if (view === 'mercadopago') {
    return <MercadoPagoConfig onBack={() => setView('list')} />;
  }

  if (view === 'supabase') {
    return <SupabaseConfig onBack={() => setView('list')} />;
  }

  if (view === 'googleanalytics') {
    return <GoogleAnalyticsConfig onBack={() => setView('list')} />;
  }

  if (view === 'facebookpixel') {
    return <FacebookPixelConfig onBack={() => setView('list')} />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="api" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Integrações</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative">
              <Icon name="notifications" />
              <span className="absolute top-2.5 right-2.5 size-1.5 bg-primary rounded-full"></span>
            </button>
            <button 
              onClick={onLogout}
              className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <Icon name="account_circle" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <label className="flex flex-col w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-12 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                <Icon name="search" />
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4" 
                placeholder="Buscar integrações..." 
              />
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold leading-tight">Serviços Conectados</h3>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">4 Ativos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegrationCard 
            logoUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuASeH3IunWaZM1nK9ymjvFD17EbS2JJHaNNoSo6_baNplxhF32mZ7ZjlYF_62_8K4rvToqPJICS19GiJWf2jGNRzuI4S8p1a27lvpaE5acfgZnMcfEwTa09WBbPK47m0l9IkbT9n16eL5rDi6SuiMIdaAMcNVsKPdzWXgMaou6xEwOhlR1VQAJ7Nfsecp6WnkXU91dBvmnAtdutsppe4I4CiOLtvOQVfUEiPtvrjJAS_89A0mpw3POtF51cfkJqa9ChEF1M8sXTwGWt"
            category="Pagamentos"
            name="Mercado Pago"
            status="Ativo"
            meta="Última sync: 2min atrás"
            onConfigure={() => setView('mercadopago')}
          />
          <IntegrationCard 
            logoUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0MPr4lhroOxWHzVYD_yoc8aWSF6KjNL5xBLJ7csa6ZIDwbkO0gx9vVy35ui8ocJ6vcgJHIIziKCDA3QJnlAI0RGeYbV_cAWaIuTau8X95efNOe_Tim3HYD6JYKKZRyhIa26Z1Awh5-OXd3rEfs-BkhumHbygpDP4HXHr1gLxC3jH03cGIqmmY7Hu7mt5z1JfjgqQGOKYNENfR-K9BSycsynUQYjM5e_ZPS8q48SId-gT3rZtq0mOIndv86GlR5E3y5ifq8D_w4S7"
            category="Banco de Dados"
            name="Supabase"
            status="Ativo"
            meta="Latency: 24ms"
            onConfigure={() => setView('supabase')}
          />
          <IntegrationCard 
            logoUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuB1JCiTioHaV2eHhPYalmhwxPGJpevTHVONHpnD3mlXM9v-NxOMJw7C9yl3hAx4Vh7-sAYJMBh3RH810e6Ws2cWy1Kt6aBUofVYonDm6zd6gMAN7Rfxb-tldPN7IFWc1YADWmKmCsEaZe14pcydXXLiuHHEDNWDg1KqCHKN6y0ZYo98as3Qe33TyHTvBSkooqUrSUp3PTNndwmeAY1TORWbMkK69YC-cPtoXnRyFaHmy_Spnj6RDEH-TTfay9txaBl_RMT52l7C1DJv"
            category="Marketing"
            name="Pixel Facebook"
            status="Inativo"
            meta="Aguardando chave API"
            onConfigure={() => setView('facebookpixel')}
          />
          <IntegrationCard 
            logoUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuB2X0F8ptnVTcEYibmSMGiWHSMKyooHXvaoBX-bhj_jf2Ly6LfbHu6sVdnSSB3EsS-Pjhp3lMyGnMbAEoEadvQMDZOr2-BgUmrQFGkLr0aOgUV6pFI-RiODpXbkdIFDbb6-3tLjy3BP2zoaksoeuy7ReTRs3-MYQ4ka_duutBxwIhvAl7cTpyZimIHFm02muR92jAgR7GaW_Gs4hSPgfy52E4SWQZ7QsNR0hkGPrKEPuPq_7-p5HrOvZ2lLIych-EPNh9HGX15nhZAp"
            category="Analytics"
            name="Google Analytics"
            status="Ativo"
            meta="Property: G-V2B7X9L3P"
            onConfigure={() => setView('googleanalytics')}
          />
        </div>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h3 className="text-lg font-bold leading-tight">Disponíveis para Conectar</h3>
        </div>

        <button className="w-full mb-12 flex items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:border-primary/50 hover:text-primary transition-all group">
          <Icon name="add_circle" className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-base">Adicionar Nova Integração</span>
        </button>
      </main>
    </div>
  );
};

interface IntegrationCardProps {
  logoUrl: string;
  category: string;
  name: string;
  status: 'Ativo' | 'Inativo';
  meta: string;
  onConfigure: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ logoUrl, category, name, status, meta, onConfigure }) => {
  const isActive = status === 'Ativo';
  
  return (
    <div className={`flex flex-col gap-4 rounded-xl bg-white dark:bg-card-dark p-5 border border-slate-200 dark:border-white/5 shadow-sm ${!isActive ? 'opacity-90' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
            <div 
              className="w-full h-full bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: `url("${logoUrl}")` }}
            ></div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{category}</p>
            <p className="text-lg font-bold leading-tight">{name}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'}`}>
          <span className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          {status}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-white/5">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{meta}</p>
        <button 
          onClick={onConfigure}
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
        >
          Configurar
        </button>
      </div>
    </div>
  );
};
