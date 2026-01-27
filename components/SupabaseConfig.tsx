import React, { useState } from 'react';
import { Icon } from './Icon';

interface SupabaseConfigProps {
  onBack: () => void;
}

export const SupabaseConfig: React.FC<SupabaseConfigProps> = ({ onBack }) => {
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center p-4 max-w-lg mx-auto gap-4">
          <button 
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-lg font-bold leading-tight">Configurações Supabase</h1>
        </div>
      </header>

      <main className="flex-grow max-w-lg mx-auto px-4 py-6 w-full">
        <div className="mb-6 rounded-xl bg-white dark:bg-card-dark p-4 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Icon name="database" className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status da Conexão</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="size-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Conectado</span>
                </div>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tighter">Reiniciar</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Project URL</label>
              <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <Icon name="link" className="text-xl" />
                </div>
                <input 
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4" 
                  placeholder="https://xyz.supabase.co" 
                  type="text" 
                  defaultValue="https://app-project-id.supabase.co"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">API Key (anon/public)</label>
              <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <Icon name="key" className="text-xl" />
                </div>
                <input 
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4" 
                  type={showAnonKey ? "text" : "password"} 
                  defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                />
                <button 
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="flex items-center justify-center px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Icon name={showAnonKey ? "visibility_off" : "visibility"} className="text-xl" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Service Role Key (secret)</label>
              <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <Icon name="admin_panel_settings" className="text-xl" />
                </div>
                <input 
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4" 
                  type={showSecretKey ? "text" : "password"} 
                  defaultValue="secret_service_role_token_here"
                />
                <button 
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="flex items-center justify-center px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Icon name={showSecretKey ? "visibility_off" : "visibility"} className="text-xl" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed px-1 font-medium">
                Esta chave tem acesso total ao banco de dados e deve ser mantida em segurança. Nunca a exponha no lado do cliente.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold transition-all active:scale-95 uppercase tracking-widest text-xs">
              <Icon name="sync_alt" className="text-xl" />
              Testar Conexão
            </button>
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              <Icon name="save" className="text-xl" />
              Salvar
            </button>
          </div>
        </div>

        <div className="mt-12 mb-8 text-center">
          <a className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium" href="#">
            Como obter as chaves do projeto?
            <Icon name="open_in_new" className="text-base" />
          </a>
        </div>
      </main>
    </div>
  );
};
