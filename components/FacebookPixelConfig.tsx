import React, { useState } from 'react';
import { Icon } from './Icon';

interface FacebookPixelConfigProps {
  onBack: () => void;
}

export const FacebookPixelConfig: React.FC<FacebookPixelConfigProps> = ({ onBack }) => {
  return (
    <div className="bg-background-dark text-white min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center p-4 w-full max-w-lg mx-auto">
          <button 
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors -ml-2"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="ml-2 text-lg font-bold uppercase tracking-tight">Configuração Pixel</h1>
        </div>
      </header>

      <main className="w-full max-w-lg mx-auto px-4 py-6 flex-1 overflow-y-auto">
        <div className="space-y-6">
          <div className="bg-card-dark rounded-xl p-5 border border-white/5 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Identificação</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Pixel ID</label>
                <input 
                  className="w-full bg-black/40 border border-white/10 rounded-lg h-12 px-4 text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 transition-all outline-none" 
                  placeholder="Ex: 123456789012345" 
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="bg-card-dark rounded-xl p-5 border border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Conversions API (CAPI)</h2>
              <Icon name="info" className="text-[16px] text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-300">CAPI Access Token</label>
              <textarea 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 text-sm font-mono leading-relaxed outline-none" 
                placeholder="Insira o seu token de acesso..." 
                rows={5}
              ></textarea>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed font-medium">
                O token de acesso permite que os eventos sejam enviados diretamente do seu servidor, aumentando a precisão do rastreamento de conversões.
              </p>
            </div>
          </div>

          <div className="bg-card-dark rounded-xl p-5 border border-white/5 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Eventos de Rastreamento</h2>
            <div className="divide-y divide-white/5">
              <ToggleRow 
                id="compra"
                label="Compra"
                description="Finalização de pagamento"
                defaultChecked={true}
              />
              <ToggleRow 
                id="cadastro"
                label="Cadastro Completo"
                description="Criação de conta no sistema"
                defaultChecked={true}
              />
              <ToggleRow 
                id="checkout"
                label="Início de Checkout"
                description="Entrada no fluxo de pagamento"
                defaultChecked={false}
              />
            </div>
          </div>

          <div className="pt-6 pb-12 space-y-3">
            <button 
              onClick={onBack}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              <Icon name="save" />
              Salvar Configurações
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-transparent hover:bg-white/5 text-slate-400 font-bold py-3 rounded-xl transition-colors active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ id, label, description, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="font-bold text-[15px]">{label}</p>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={id}
          className="sr-only peer" 
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <div 
          onClick={() => setChecked(!checked)}
          className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
        ></div>
      </div>
    </div>
  );
};
