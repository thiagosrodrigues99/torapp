import React from 'react';
import { Icon } from './Icon';

interface GoogleAnalyticsConfigProps {
  onBack: () => void;
}

export const GoogleAnalyticsConfig: React.FC<GoogleAnalyticsConfigProps> = ({ onBack }) => {
  return (
    <div className="bg-background-dark text-white min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center p-4 justify-between max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Configurar Analytics</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center overflow-hidden border border-orange-500/20">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2X0F8ptnVTcEYibmSMGiWHSMKyooHXvaoBX-bhj_jf2Ly6LfbHu6sVdnSSB3EsS-Pjhp3lMyGnMbAEoEadvQMDZOr2-BgUmrQFGkLr0aOgUV6pFI-RiODpXbkdIFDbb6-3tLjy3BP2zoaksoeuy7ReTRs3-MYQ4ka_duutBxwIhvAl7cTpyZimIHFm02muR92jAgR7GaW_Gs4hSPgfy52E4SWQZ7QsNR0hkGPrKEPuPq_7-p5HrOvZ2lLIych-EPNh9HGX15nhZAp")' }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col">
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300 ml-1">ID de Mensuração</span>
              <div className="mt-1.5 flex items-stretch rounded-xl h-14 bg-card-dark border border-white/10 overflow-hidden focus-within:border-primary transition-colors">
                <div className="text-slate-500 flex items-center justify-center pl-4">
                  <Icon name="tag" className="text-xl" />
                </div>
                <input 
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 text-base font-medium placeholder:text-slate-600 text-white px-4" 
                  placeholder="G-XXXXXXX" 
                  type="text" 
                  defaultValue="G-V2B7X9L3P"
                />
              </div>
            </label>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
              <Icon name="info" className="text-blue-400 shrink-0" />
              <div className="text-sm text-blue-100/80 leading-relaxed">
                Para encontrar seu ID, acesse o painel do Google Analytics, vá em <strong>Administrador &gt; Fluxos de Dados</strong> e selecione seu site.
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Opções de Rastreamento</h3>
            <div className="space-y-3">
              <TrackingToggle 
                icon="touch_app"
                label="Rastrear Cliques em Botões"
                defaultChecked={true}
              />
              <TrackingToggle 
                icon="timer"
                label="Rastrear Tempo de Sessão"
                defaultChecked={true}
              />
              <TrackingToggle 
                icon="shopping_cart"
                label="Rastrear Conversões de Venda"
                defaultChecked={false}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 pb-10">
          <button 
            onClick={onBack}
            className="w-full h-14 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <Icon name="save" />
            Salvar Alterações
          </button>
        </div>
      </main>
    </div>
  );
};

interface TrackingToggleProps {
  icon: string;
  label: string;
  defaultChecked: boolean;
}

const TrackingToggle: React.FC<TrackingToggleProps> = ({ icon, label, defaultChecked }) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  
  return (
    <label className="flex items-center justify-between p-4 bg-card-dark border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-lg bg-white/5 flex items-center justify-center transition-colors ${checked ? 'text-primary' : 'text-slate-400'}`}>
          <Icon name={icon} />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </div>
    </label>
  );
};
