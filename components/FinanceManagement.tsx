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
    paidUsers: 0,
    grossRevenue: 0,
    totalCommissions: 0,
    conversionRate: 0
  });
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(6).fill(0));
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    fetchFinanceData();
  }, [currentPeriod]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);

      const [targetYear, targetMonth] = currentPeriod.split('-').map(Number);

      // 1. Fetch all profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) throw profileError;

      const allUsers = (profiles || []).filter(p => p.role === 'user');
      const influencers = (profiles || []).filter(p => p.role === 'influencer');

      // Filter users created in the selected month
      const usersThisMonth = allUsers.filter(u => {
        const d = new Date(u.created_at);
        return d.getMonth() === (targetMonth - 1) && d.getFullYear() === targetYear;
      });

      let grossRevenue = 0;
      let totalCommissions = 0;

      const paidUsers = usersThisMonth.filter(u => {
        if (u.status !== 'Ativo') return false;

        const influencer = influencers.find(inf => inf.coupon === u.coupon);
        const price = influencer?.workout_price || 79.90;
        const comm = influencer?.commission_value || influencer?.commission_per_user || 35.00;

        grossRevenue += price;
        if (u.coupon) {
          totalCommissions += comm;
        }
        return true;
      }).length;

      const conversionRate = usersThisMonth.length > 0 ? (paidUsers / usersThisMonth.length) * 100 : 0;

      // 2. Build Unified Statement (Extrato)
      const combinedTransactions: Transaction[] = [];

      // A. Add active users from this month as payments
      // This ensures the statement shows something even if financial_transactions is not used
      usersThisMonth.forEach(u => {
        if (u.status === 'Ativo') {
          const influencer = influencers.find(inf => inf.coupon === u.coupon);
          const price = influencer?.workout_price || 79.90;

          combinedTransactions.push({
            id: `user-${u.id}`,
            user_name: u.full_name || 'Aluno',
            amount: price,
            type: 'payment',
            description: `Adesão - ${influencer?.coupon || 'Direto'}`,
            created_at: u.created_at
          });
        }
      });

      // B. Add Payouts (influencer_payments) for the period
      const { data: payData } = await supabase
        .from('influencer_payments')
        .select('*, profiles:influencer_id(full_name)')
        .order('created_at', { ascending: false });

      const filterByPeriod = (item: any) => {
        const d = new Date(item.created_at);
        return d.getMonth() === (targetMonth - 1) && d.getFullYear() === targetYear;
      };

      const monthlyPays = (payData || []).filter(filterByPeriod);

      monthlyPays.forEach(p => {
        combinedTransactions.push({
          id: `pay-${p.id}`,
          user_name: p.profiles?.full_name || 'Influenciador',
          amount: p.amount,
          type: 'commission_payout',
          description: 'Pagamento de Comissão',
          created_at: p.created_at
        });
      });

      // C. Also include real financial_transactions if any (avoiding double count if possible)
      const { data: transData } = await supabase
        .from('financial_transactions')
        .select('*, profiles:user_id(full_name)')
        .order('created_at', { ascending: false });

      if (transData) {
        transData.filter(filterByPeriod).forEach(t => {
          // Check if we already added this as a user-based payment to avoid duplication
          if (!combinedTransactions.some(ct => ct.id.includes(t.user_id))) {
            combinedTransactions.push({
              id: t.id,
              user_name: t.profiles?.full_name || 'Sistema',
              amount: t.amount,
              type: t.type as any,
              description: t.description || 'Transação',
              created_at: t.created_at
            });
          }
        });
      }

      setTransactions(combinedTransactions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );

      // Final stats update
      setStats({
        paidUsers,
        grossRevenue,
        totalCommissions: Math.max(0, totalCommissions),
        netProfit: grossRevenue - totalCommissions,
        conversionRate
      });

      // 3. Generate Real Chart Data (last 6 months)
      const now = new Date();
      const chartValues = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = d.getMonth();
        const year = d.getFullYear();

        const monthRevenue = allUsers.filter(u => {
          if (u.status !== 'Ativo') return false;
          const created = new Date(u.created_at);
          return created.getMonth() === month && created.getFullYear() === year;
        }).reduce((acc, u) => {
          const influencer = influencers.find(inf => inf.coupon === u.coupon);
          return acc + (influencer?.workout_price || 79.90);
        }, 0);

        chartValues.push(monthRevenue);
      }
      setMonthlyData(chartValues);

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
              onClick={showAllTransactions ? () => setShowAllTransactions(false) : onBack}
              className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                {showAllTransactions ? 'Histórico de Transações' : 'Painel Financeiro'}
              </h1>
              <p className="text-slate-400 text-xs hidden sm:block">
                {showAllTransactions ? `${transactions.length} registros encontrados` : 'Controle de receitas e comissões'}
              </p>
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
                <option value="2026-02">Fevereiro 2026</option>
                <option value="2026-03">Março 2026</option>
                <option value="2026-04">Abril 2026</option>
                <option value="2026-05">Maio 2026</option>
                <option value="2026-06">Junho 2026</option>
                <option value="2026-07">Julho 2026</option>
                <option value="2026-08">Agosto 2026</option>
                <option value="2026-09">Setembro 2026</option>
                <option value="2026-10">Outubro 2026</option>
                <option value="2026-11">Novembro 2026</option>
                <option value="2026-12">Dezembro 2026</option>
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
          {showAllTransactions ? (
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 bg-[#1a1a1a] flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest">Extrato Completo - {currentPeriod}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{transactions.length} Registros</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141414]">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Data</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Beneficiário/Origem</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Descrição</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(t.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-lg flex items-center justify-center ${t.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                              <Icon name={t.type === 'payment' ? "add_circle" : "account_balance_wallet"} className="text-sm" />
                            </div>
                            <span className="text-sm font-bold text-white">{t.user_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 uppercase font-bold">
                          {t.description}
                        </td>
                        <td className={`px-6 py-4 text-sm font-black text-right ${t.type === 'payment' ? 'text-emerald-500' : 'text-primary'}`}>
                          {t.type === 'payment' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <button
                      onClick={() => setShowAllTransactions(true)}
                      className="text-primary hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-4">
                    {transactions.slice(0, 10).map((t, i) => (
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
            </>
          )}
        </main>

        <footer className="p-8 text-center border-t border-gray-800 mt-auto">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">© 2026 Admin Panel • TorApp Financial Unit</p>
        </footer>
      </div>
    </div>
  );
};