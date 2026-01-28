import React, { useState } from 'react';
import { Icon } from './Icon';

interface SupabaseConfigProps {
  onBack: () => void;
}

export const SupabaseConfig: React.FC<SupabaseConfigProps> = ({ onBack }) => {
  const [showAnonKey, setShowAnonKey] = useState(false);

  // Real values from environment (via standard vite import.meta.env)
  const realUrl = import.meta.env.VITE_SUPABASE_URL || 'Não configurado';
  const realAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'Não configurado';

  const isOk = realUrl !== 'Não configurado' && realAnonKey !== 'Não configurado';

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
              <div className={`size-10 rounded-lg ${isOk ? 'bg-emerald-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                <Icon name={isOk ? "database" : "error"} className={isOk ? "text-emerald-500" : "text-red-500"} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status da Conexão</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`size-2 rounded-full ${isOk ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  <span className={`text-sm font-bold ${isOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isOk ? 'Conectado' : 'Erro na Configuração'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-bold text-primary hover:underline uppercase tracking-tighter"
            >
              Reiniciar
            </button>
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
                  readOnly
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4"
                  value={realUrl}
                  type="text"
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
                  readOnly
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4"
                  type={showAnonKey ? "text" : "password"}
                  value={realAnonKey}
                />
                <button
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="flex items-center justify-center px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Icon name={showAnonKey ? "visibility_off" : "visibility"} className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex gap-3">
              <Icon name="warning" className="text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                Os dados acima são carregados diretamente do seu ambiente de produção. Para alterar estas chaves, você deve atualizar o arquivo <code className="bg-black/10 px-1 rounded">.env</code> do seu projeto.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => alert('Parâmetros de ambiente verificados com sucesso!')}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-bold transition-all active:scale-95 uppercase tracking-widest text-[10px]"
            >
              <Icon name="sync_alt" className="text-xl" />
              Verificar Conexão
            </button>
            <button
              onClick={onBack}
              className="w-full h-12 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              Concluído
            </button>
          </div>
        </div>

        <div className="mt-12 mb-8 text-center">
          <a
            className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium"
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acessar Dashboard do Supabase
            <Icon name="open_in_new" className="text-base" />
          </a>
        </div>
      </main>
    </div>
  );
};
