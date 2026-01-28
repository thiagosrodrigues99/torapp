import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface FinanceManagementProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  user_name: string;
  amount: number;
  type: 'payment' | 'commission_payout';
  description: string;
  created_at: string;
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState('2026-01');
  const [stats, setStats] = useState({
    netProfit: 0,
    trialUsers: 0,
    paidUsers: 0,
    grossRevenue: 0,
    totalCommissions: 0,
    conversionRate: 0
  });
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(6).fill(0));

  useEffect(() => {
    fetchFinanceData();
  }, [currentPeriod]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);

      // 1. Fetch all profiles to calculate current status
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) throw profileError;

      const users = (profiles || []).filter(p => p.role === 'user');
      const influencers = (profiles || []).filter(p => p.role === 'influencer');

      const paidUsers = users.filter(u => u.status === 'Ativo').length;
      const trialUsers = users.filter(u => u.status !== 'Ativo').length; // Simplification: non-active are trials

      const PLAN_PRICE = 79.90;
      const grossRevenue = paidUsers * PLAN_PRICE;

      // Calculate commissions
      let totalCommissions = 0;
      users.filter(u => u.status === 'Ativo' && u.coupon).forEach(u => {
        const influencer = influencers.find(inf => inf.coupon === u.coupon);
        const commBase = influencer?.commission_per_user || 35.00;
        totalCommissions += commBase;
      });

      const conversionRate = users.length > 0 ? (paidUsers / users.length) * 100 : 0;

      setStats({
        paidUsers,
        trialUsers,
        grossRevenue,
        totalCommissions,
        netProfit: grossRevenue - totalCommissions,
        conversionRate
      });

      // 2. Fetch Transactions
      const { data: transData } = await supabase
        .from('financial_transactions')
        .select('*, profiles:user_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (transData && transData.length > 0) {
        setTransactions(transData.map(t => ({
          id: t.id,
          user_name: t.profiles?.full_name || 'Sistema',
          amount: t.amount,
          type: t.type as any,
          description: t.description || 'Transação',
          created_at: t.created_at
        })));
      } else {
        // Mock some transactions if empty
        setTransactions([
          { id: '1', user_name: 'Ricardo Almeida', amount: 129.90, type: 'payment', description: 'Assinatura Premium', created_at: new Date().toISOString() },
          { id: '2', user_name: 'Influencer Ana', amount: 35.00, type: 'commission_payout', description: 'Comissão ref. Ricardo', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', user_name: 'Carla Souza', amount: 89.90, type: 'payment', description: 'Mensalidade Ativa', created_at: new Date(Date.now() - 7200000).toISOString() }
        ]);
      }

      // 3. Mock Chart Data
      // Use a fixed base if grossRevenue is tiny or 0 to show bars
      const baseVal = Math.max(grossRevenue, 5000);
      const periodFactor = currentPeriod === '2026-01' ? 1 : 0.85;
      const viewFactor = viewMode === 'weekly' ? 0.25 : 1;

      const rawTrend = [30, 45, 40, 65, 55, 85];
      setMonthlyData(rawTrend.map(v => (v * baseVal * periodFactor * viewFactor) / 100));

      if (currentPeriod !== '2026-01' || grossRevenue === 0) {
        setTransactions([
          { id: 'sim-1', user_name: 'Marta Silva', amount: 79.90, type: 'payment', description: 'Assinatura', created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 'sim-2', user_name: 'Influencer Leo', amount: 35.00, type: 'commission_payout', description: 'Comissão ref. Marta', created_at: new Date(Date.now() - 186400000).toISOString() },
          { id: 'sim-3', user_name: 'Ana Paula', amount: 129.90, type: 'payment', description: 'Plano Anual', created_at: new Date(Date.now() - 286400000).toISOString() }
        ]);
      }

    } catch (err) {
      console.error('Error fetching finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] min-h-screen text-slate-100 font-manrope">
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex items-center bg-[#141414]/80 backdrop-blur-md px-4 md:px-8 py-6 justify-between border-b border-gray-800">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={onBack}
              className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Painel Financeiro</h1>
              <p className="text-slate-400 text-xs hidden sm:block">Controle de receitas e comissões</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <select
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
                className="appearance-none bg-[#1e1e1e] border border-gray-800 rounded-xl px-4 pl-10 h-11 text-sm font-bold text-white focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-white/5"
              >
                <option value="2026-01">Janeiro 2026</option>
                <option value="2025-12">Dezembro 2025</option>
                <option value="2025-11">Novembro 2025</option>
                <option value="2025-10">Outubro 2025</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                <Icon name="calendar_today" className="text-sm" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Icon name="expand_more" />
              </div>
            </div>
            <div className="size-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold hidden sm:flex">AD</div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-primary rounded-2xl p-6 shadow-xl shadow-primary/10 relative overflow-hidden flex flex-col justify-between h-40">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Icon name="account_balance" className="text-8xl" />
              </div>
              <div className="relative z-10">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Lucro Líquido</p>
                <h3 className="text-2xl font-black mt-1">
                  {stats.netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
              </div>
              <div className="relative z-10 flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase">
                <Icon name="trending_up" className="text-sm" />
                <span>Lucro real atual</span>
              </div>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Teste Grátis</p>
                  <Icon name="group" className="text-primary text-xl" />
                </div>
                <h3 className="text-3xl font-black text-white">{stats.trialUsers}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase">
                <span>Leads potenciais</span>
              </div>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Ativos Pagos</p>
                  <Icon name="verified" className="text-emerald-500 text-xl" />
                </div>
                <h3 className="text-3xl font-black text-white">{stats.paidUsers}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
                <Icon name="arrow_upward" className="text-sm" />
                <span>Conversão {stats.conversionRate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Faturado Bruto</p>
                  <Icon name="payments" className="text-amber-500 text-xl" />
                </div>
                <h3 className="text-2xl font-black text-slate-100">
                  {stats.grossRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase">
                <Icon name="history" className="text-sm" />
                <span>Total acumulado</span>
              </div>
            </div>

            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Comissões</p>
                  <Icon name="send_money" className="text-primary text-xl" />
                </div>
                <h3 className="text-2xl font-black text-slate-100">
                  {stats.totalCommissions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase">
                <Icon name="outbound" className="text-sm" />
                <span>Repasses pendentes</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Crescimento de Receita</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Previsão financeira semestral</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('weekly')}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'weekly' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-800 text-slate-400'}`}
                  >
                    Semanal
                  </button>
                  <button
                    onClick={() => setViewMode('monthly')}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'monthly' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-800 text-slate-400'}`}
                  >
                    Mensal
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between h-80 gap-2 sm:gap-6 px-4">
                {monthlyData.map((value, i) => {
                  const months = viewMode === 'monthly' ? ['AGO', 'SET', 'OUT', 'NOV', 'DEZ', 'JAN'] : ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
                  const maxVal = Math.max(...monthlyData, 1);
                  const height = `${(value / maxVal) * 90}%`;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div
                        className={`w-full ${i === 5 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'} rounded-t-xl transition-all duration-500 relative cursor-pointer`}
                        style={{ height }}
                      >
                        {i === 5 && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-background-dark font-black text-[10px] px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
                            {viewMode === 'monthly' ? 'JAN' : 'SAB'}: {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-black tracking-widest ${i === 5 ? 'text-primary' : 'text-slate-500'}`}>{months[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List Area */}
            <div className="lg:col-span-4 bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight">Extrato</h3>
                <button className="text-primary hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors">Ver todos</button>
              </div>
              <div className="space-y-4">
                {transactions.map((t, i) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-[#141414]/50 border border-gray-800/50 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl ${t.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                        <Icon name={t.type === 'payment' ? "add_circle" : "account_balance_wallet"} className="text-xl" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-black uppercase text-white truncate group-hover:text-primary transition-colors">{t.user_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{t.description}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-black ${t.type === 'payment' ? 'text-emerald-500' : 'text-primary'}`}>
                      {t.type === 'payment' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="p-8 text-center border-t border-gray-800 mt-auto">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">© 2026 Admin Panel • TorApp Financial Unit</p>
        </footer>
      </div>
    </div>
  );
};