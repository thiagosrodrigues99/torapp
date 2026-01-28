import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface SupabaseConfigProps {
  onBack: () => void;
}

export const SupabaseConfig: React.FC<SupabaseConfigProps> = ({ onBack }) => {
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [usageStats, setUsageStats] = useState({
    totalRows: 0,
    estimatedSizeMB: 5.0,
    planLimitMB: 500,
  });

  // Real values from environment (via standard vite import.meta.env)
  const realUrl = import.meta.env.VITE_SUPABASE_URL || 'Não configurado';
  const realAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'Não configurado';
  const isOk = realUrl !== 'Não configurado' && realAnonKey !== 'Não configurado';

  useEffect(() => {
    if (isOk) {
      calculateUsage();
    }
  }, [isOk]);

  const calculateUsage = async () => {
    try {
      setLoadingUsage(true);

      // Count main tables
      const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: paymentsCount } = await supabase.from('influencer_payments').select('*', { count: 'exact', head: true });
      const { count: recipesCount } = await supabase.from('recipes').select('*', { count: 'exact', head: true });
      const { count: exercisesCount } = await supabase.from('exercise_bank').select('*', { count: 'exact', head: true });

      const totalRows = (profilesCount || 0) + (paymentsCount || 0) + (recipesCount || 0) + (exercisesCount || 0);

      // Estimation logic: 5MB base + calculated KB per row type
      // profiles (~1KB), payments (0.5KB), recipes (10KB due to large text), exercises (5KB)
      const estimatedKB = 5120 +
        ((profilesCount || 0) * 1) +
        ((paymentsCount || 0) * 0.5) +
        ((recipesCount || 0) * 10) +
        ((exercisesCount || 0) * 5);

      setUsageStats({
        totalRows,
        estimatedSizeMB: parseFloat((estimatedKB / 1024).toFixed(2)),
        planLimitMB: 500, // Supabase Free Tier limit
      });
    } catch (err) {
      console.error('Error calculating DB usage:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const usagePercentage = Math.min((usageStats.estimatedSizeMB / usageStats.planLimitMB) * 100, 100);

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
        {/* Status Card */}
        <div className="mb-6 rounded-2xl bg-white dark:bg-card-dark p-6 border border-slate-200 dark:border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-xl ${isOk ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} flex items-center justify-center`}>
                <Icon name={isOk ? "verified" : "error"} className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Serviços Ativos</p>
                <h3 className={`text-lg font-black uppercase italic ${isOk ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isOk ? 'Banco Online' : 'Desconectado'}
                </h3>
              </div>
            </div>
            <button
              onClick={() => calculateUsage()}
              className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center text-primary transition-all active:rotate-180"
            >
              <Icon name="sync" />
            </button>
          </div>

          {/* Usage Monitoring */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="storage" className="text-primary text-sm" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacidade de Dados</span>
              </div>
              <span className="text-[10px] font-black text-white">{usageStats.estimatedSizeMB} MB / {usageStats.planLimitMB} MB</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${usagePercentage > 90 ? 'bg-red-500' : 'bg-primary shadow-[0_0_10px_rgba(255,46,91,0.5)]'}`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 px-1">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Registros Totais</span>
                <span className="text-sm font-black text-white">{loadingUsage ? '...' : usageStats.totalRows.toLocaleString()}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Uso Estimado</span>
                <span className="text-sm font-black text-emerald-400">{usageStats.estimatedSizeMB} MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Project Endpoint</label>
              <div className="flex w-full items-stretch rounded-xl h-14 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm transition-all focus-within:border-primary/50">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <Icon name="cloud" className="text-xl" />
                </div>
                <input
                  readOnly
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-sm font-bold text-white px-4"
                  value={realUrl}
                  type="text"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Public API Key (Anon)</label>
              <div className="flex w-full items-stretch rounded-xl h-14 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm transition-all focus-within:border-primary/50">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <Icon name="vpn_key" className="text-xl" />
                </div>
                <input
                  readOnly
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-sm font-bold text-white px-4 tracking-wider"
                  type={showAnonKey ? "text" : "password"}
                  value={realAnonKey}
                />
                <button
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="flex items-center justify-center px-4 text-slate-400 hover:text-white transition-colors"
                >
                  <Icon name={showAnonKey ? "visibility_off" : "visibility"} className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4">
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Icon name="info" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-white mb-1">Nota de Segurança</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Sua instância está operando no modo de segurança. As chaves de acesso são geridas pelo servidor e as métricas de storage são estimadas com base no volume de registros atuais.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={onBack}
              className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs italic"
            >
              Voltar ao Painel
            </button>
          </div>
        </div>

        <div className="mt-12 mb-8 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">TorApp Systems • 2026</span>
          </div>
          <a
            className="inline-flex items-center gap-2 text-xs text-primary hover:text-white transition-all font-black uppercase tracking-widest"
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dashboard Externo
            <Icon name="open_in_new" className="text-lg" />
          </a>
        </div>
      </main>
    </div>
  );
};
