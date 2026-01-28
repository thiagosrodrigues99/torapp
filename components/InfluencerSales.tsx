import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Sale {
  id: string;
  user_name: string;
  created_at: string;
  status: string;
  amount: number;
  commission: number;
}

interface InfluencerSalesProps {
  influencerId: string;
  onBack: () => void;
}

export const InfluencerSales: React.FC<InfluencerSalesProps> = ({ influencerId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [influencer, setInfluencer] = useState({ full_name: '', coupon: '', commission_per_user: 35 });
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingCommission: 0,
    conversionRate: 0,
    totalUsers: 0,
    trialUsers: 0,
    paidUsers: 0
  });

  useEffect(() => {
    fetchInfluencerData();
  }, [influencerId]);

  const fetchInfluencerData = async () => {
    try {
      setLoading(true);

      const { data: influencerData, error: influencerError } = await supabase
        .from('profiles')
        .select('full_name, coupon, commission_per_user')
        .eq('id', influencerId)
        .single();

      if (influencerError) throw influencerError;
      setInfluencer({
        full_name: influencerData.full_name || '',
        coupon: influencerData.coupon || '',
        commission_per_user: influencerData.commission_per_user || 35
      });

      // Get all users with this coupon (these are the "sales")
      const { data: usersWithCoupon, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, created_at, status, role')
        .eq('coupon', influencerData.coupon)
        .neq('role', 'influencer')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Calculate stats
      const users = usersWithCoupon || [];
      const paidUsers = users.filter(u => u.status === 'Ativo');
      const trialUsers = users.filter(u => u.status === 'Teste Grátis');

      const SUBSCRIPTION_VALUE = 49.90; // Valor da assinatura
      const COMMISSION_PER_USER = influencerData.commission_per_user || 35; // Comissão por usuário pago

      const totalSales = paidUsers.length * SUBSCRIPTION_VALUE;
      const pendingCommission = paidUsers.length * COMMISSION_PER_USER;
      const conversionRate = users.length > 0 ? (paidUsers.length / users.length * 100) : 0;

      setStats({
        totalSales,
        pendingCommission,
        conversionRate,
        totalUsers: users.length,
        trialUsers: trialUsers.length,
        paidUsers: paidUsers.length
      });

      // Map users to sales format
      const salesData: Sale[] = users.map(user => ({
        id: user.id,
        user_name: user.full_name || 'Usuário',
        created_at: user.created_at,
        status: user.status === 'Ativo' ? 'Pago' : user.status === 'Teste Grátis' ? 'Teste' : 'Pendente',
        amount: user.status === 'Ativo' ? SUBSCRIPTION_VALUE : 0,
        commission: user.status === 'Ativo' ? COMMISSION_PER_USER : 0
      }));

      setSales(salesData);
    } catch (err) {
      console.error('Error fetching influencer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
          <p className="text-slate-500 text-sm">Carregando dados de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight uppercase italic text-white leading-none">{influencer.full_name}</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded border border-primary/20 uppercase">{influencer.coupon}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Vendas do Influenciador</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors relative">
                <Icon name="notifications" className="text-2xl" />
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
              </button>
              <button className="flex items-center gap-3 px-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold uppercase leading-none">Administrador</p>
                  <p className="text-[9px] text-slate-500 uppercase">Acesso Total</p>
                </div>
                <Icon name="account_circle" className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-8 w-full max-w-[1600px] mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Icon name="payments" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total de Vendas (R$)</p>
              <p className="text-3xl font-black text-white mt-1">{formatCurrency(stats.totalSales)}</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="account_balance_wallet" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comissão a Pagar (R$)</p>
              <p className="text-3xl font-black text-white mt-1">{formatCurrency(stats.pendingCommission)}</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Icon name="query_stats" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversão (%)</p>
              <p className="text-3xl font-black text-white mt-1">{stats.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="person_add" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuários Cadastrados</p>
              <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Icon name="timer" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuários em Teste Grátis</p>
              <p className="text-3xl font-black text-white mt-1">{stats.trialUsers}</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Icon name="verified_user" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuários Pagos</p>
              <p className="text-3xl font-black text-white mt-1">{stats.paidUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Relatório de Transações</h3>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl pointer-events-none">
                  <Icon name="calendar_month" />
                </span>
                <select className="bg-[#1a1a1a] border-white/5 rounded-lg pl-10 pr-10 py-2 text-xs focus:ring-primary focus:border-primary w-48 text-[#f0f0f0] cursor-pointer hover:bg-[#222] transition-colors appearance-none">
                  <option defaultValue="jan-2026">Janeiro 2026</option>
                  <option value="dez-2025">Dezembro 2025</option>
                  <option value="nov-2025">Novembro 2025</option>
                  <option value="out-2025">Outubro 2025</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Valor da Venda</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Comissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                      Nenhuma venda encontrada para este influenciador.
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-300">{formatDate(sale.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-slate-800 flex items-center justify-center">
                            <Icon name="person" className="text-sm text-slate-500" />
                          </div>
                          <p className="text-sm font-medium text-white">{sale.user_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">
                          {sale.amount > 0 ? formatCurrency(sale.amount) : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${sale.status === 'Pago'
                          ? 'bg-green-500/10 text-green-500'
                          : sale.status === 'Teste'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                          <span className={`size-1.5 rounded-full ${sale.status === 'Pago'
                            ? 'bg-green-500'
                            : sale.status === 'Teste'
                              ? 'bg-amber-500'
                              : 'bg-yellow-500'
                            }`}></span>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-primary">
                          {sale.commission > 0 ? formatCurrency(sale.commission) : '-'}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Total: {sales.length} transações
            </p>
          </div>
        </div>
        <div className="text-center py-6">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2">Painel Administrativo</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">© 2026 Fitness Platform • Performance de Influenciador</p>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
      </div>
    </div>
  );
};