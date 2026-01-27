import React, { useState } from 'react';
import { Icon } from './Icon';

interface MercadoPagoConfigProps {
  onBack: () => void;
}

export const MercadoPagoConfig: React.FC<MercadoPagoConfigProps> = ({ onBack }) => {
  const [isSandbox, setIsSandbox] = useState(true);

  return (
    <div className="bg-background-dark text-gray-94 min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center p-4 max-w-lg mx-auto gap-4">
          <button 
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back_ios_new" className="text-white" />
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight text-white">Configurações Mercado Pago</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 w-full flex-grow">
        <form className="flex flex-col gap-6 h-full" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center gap-4 mb-2">
            <div className="size-14 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-cover" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASeH3IunWaZM1nK9ymjvFD17EbS2JJHaNNoSo6_baNplxhF32mZ7ZjlYF_62_8K4rvToqPJICS19GiJWf2jGNRzuI4S8p1a27lvpaE5acfgZnMcfEwTa09WBbPK47m0l9IkbT9n16eL5rDi6SuiMIdaAMcNVsKPdzWXgMaou6xEwOhlR1VQAJ7Nfsecp6WnkXU91dBvmnAtdutsppe4I4CiOLtvOQVfUEiPtvrjJAS_89A0mpw3POtF51cfkJqa9ChEF1M8sXTwGWt")' }}
              ></div>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Credenciais de Integração</h2>
              <p className="text-xs text-slate-400">Configure suas chaves de API para processar pagamentos.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Public Key</label>
              <input 
                className="w-full h-12 px-4 rounded-lg bg-card-dark border border-white/10 text-gray-94 placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="APP_USR-..." 
                type="text" 
                defaultValue="APP_USR-78291029-2819-4b21-8291"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Access Token</label>
              <input 
                className="w-full h-12 px-4 rounded-lg bg-card-dark border border-white/10 text-gray-94 placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="APP_USR-..." 
                type="password" 
                defaultValue="APP_USR-92810293847561029384756102938475"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Client ID</label>
              <input 
                className="w-full h-12 px-4 rounded-lg bg-card-dark border border-white/10 text-gray-94 placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="8271..." 
                type="text" 
                defaultValue="8271029384"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-card-dark border border-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Modo Sandbox</p>
              <p className="text-xs text-slate-400">Ambiente de teste para transações</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isSandbox}
                onChange={() => setIsSandbox(!isSandbox)}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-card-dark border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="link" className="text-slate-400 text-sm" />
              <h3 className="text-sm font-semibold text-white">Webhook URL</h3>
            </div>
            <div className="flex gap-2">
              <input 
                className="flex-1 h-10 px-3 rounded-lg bg-background-dark border border-white/5 text-[10px] text-slate-400 focus:outline-none" 
                readOnly 
                type="text" 
                value="https://api.seusistema.com/webhooks/mercadopago"
              />
              <button 
                className="size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" 
                type="button"
                onClick={() => navigator.clipboard.writeText('https://api.seusistema.com/webhooks/mercadopago')}
              >
                <Icon name="content_copy" className="text-sm" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Configure esta URL no painel do desenvolvedor.</p>
          </div>

          <div className="mt-auto pt-6">
            <button 
              className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest text-sm" 
              type="submit"
              onClick={onBack}
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
