import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface InfluencerDashboardProps {
  onLogout: () => void;
  onEditProfile: () => void;
}

export const InfluencerDashboard: React.FC<InfluencerDashboardProps> = ({ onLogout, onEditProfile }) => {
  const [coupon, setCoupon] = useState<string>('---');
  const [stats, setStats] = useState({
    total: 0,
    trial: 0,
    paid: 0,
    expired: 0
  });
  const [commission, setCommission] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastPayment, setLastPayment] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}`;
  });
  const [allUsersData, setAllUsersData] = useState<any[]>([]);
  const [influencerProfile, setInfluencerProfile] = useState<any>(null);
  const [allPaymentsData, setAllPaymentsData] = useState<any[]>([]);

  useEffect(() => {
    fetchInfluencerData();
  }, []);

  useEffect(() => {
    if (allUsersData.length > 0 || influencerProfile) {
      updateFilteredStats();
    }
  }, [selectedPeriod, allUsersData, influencerProfile]);

  const fetchInfluencerData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get influencer profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile?.coupon) {
        setInfluencerProfile(profile);
        setCoupon(profile.coupon);

        // Get users linked to this coupon
        const { data: users } = await supabase
          .from('profiles')
          .select('id, status, role, created_at')
          .eq('coupon', profile.coupon)
          .eq('role', 'user');

        setAllUsersData(users || []);

        // Get payments history
        const { data: payments } = await supabase
          .from('influencer_payments')
          .select('*')
          .eq('influencer_id', session.user.id)
          .order('created_at', { ascending: false });

        setAllPaymentsData(payments || []);

        if (payments && payments.length > 0) {
          setLastPayment(payments[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching influencer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilteredStats = () => {
    if (!influencerProfile) return;

    let filteredUsers = allUsersData;

    if (selectedPeriod !== 'all') {
      const [year, month] = selectedPeriod.split('-').map(Number);
      filteredUsers = allUsersData.filter(u => {
        const d = new Date(u.created_at);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }

    const statsUpdate = {
      total: filteredUsers.length,
      trial: filteredUsers.filter(u => u.status === 'Teste Grátis').length,
      paid: filteredUsers.filter(u => u.status === 'Ativo').length,
      expired: filteredUsers.filter(u => u.status === 'Expirado').length
    };
    setStats(statsUpdate);

    // Calculate commission for the filtered period
    const commissionPerUser = influencerProfile.commission_value || influencerProfile.commission_per_user || 35;
    const periodEarned = statsUpdate.paid * commissionPerUser;

    // Se for "Todo o período", subtraímos o que já foi pago. 
    // Se for um mês específico, mostramos quanto ele GANHOU naquele mês.
    if (selectedPeriod === 'all') {
      const totalPaid = allPaymentsData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setCommission(Math.max(0, periodEarned - totalPaid));
    } else {
      setCommission(periodEarned);
    }

    // Growth calculation (always relative to selected or current month)
    const now = new Date();
    const [targetYear, targetMonth] = selectedPeriod === 'all'
      ? [now.getFullYear(), now.getMonth()]
      : selectedPeriod.split('-').map(Number);

    const targetMonthUsers = allUsersData.filter(u => {
      const d = new Date(u.created_at);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }).length;

    const prevMonthDate = new Date(targetYear, targetMonth - 1, 1);
    const prevMonthUsers = allUsersData.filter(u => {
      const d = new Date(u.created_at);
      return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear();
    }).length;

    let growthPct = 0;
    if (prevMonthUsers > 0) {
      growthPct = ((targetMonthUsers - prevMonthUsers) / prevMonthUsers) * 100;
    } else if (targetMonthUsers > 0) {
      growthPct = 100;
    }
    setGrowth(growthPct);
  };


  const generatePeriodOptions = () => {
    const options = [];
    options.push(<option key="all" value="all">Todo o Período</option>);

    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      options.push(<option key={value} value={value}>{label.charAt(0).toUpperCase() + label.slice(1)}</option>);
    }
    return options;
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(coupon);
    alert('Cupom copiado!');
  };
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-[#332226]">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Icon name="fitness_center" className="text-primary" />
            <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Painel do Influenciador</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onEditProfile} className="text-primary text-sm font-bold hover:underline">Editar Perfil</button>
            <div className="text-primary">
              <Icon name="notifications" />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto min-h-[calc(100vh-65px)] flex flex-col">
        <div className="px-4 py-4">
          <div className="flex flex-col w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#bc9aa3] mb-2 px-1">Meu Cupom</p>
            <div className="flex items-center justify-between bg-[#282828] border border-[#f0f0f0] rounded-xl py-3 px-4 shadow-sm">
              <span className="text-sm font-bold tracking-widest text-white uppercase">{coupon}</span>
              <button
                onClick={handleCopyCoupon}
                className="flex items-center text-[#f0f0f0] active:scale-90 transition-transform hover:text-white"
              >
                <Icon name="content_copy" className="text-xl" />
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-0 mb-4">
          <label className="flex flex-col w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#bc9aa3] mb-2 px-1">Filtrar por Período</p>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none w-full rounded-xl border border-slate-200 dark:border-[#332226] bg-white dark:bg-surface-dark py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
              >
                {generatePeriodOptions()}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                <Icon name="expand_more" />
              </div>
            </div>
          </label>
        </div>
        <div className="px-4 mb-6">
          <div className="flex flex-1 gap-3 rounded-xl border border-slate-200 dark:border-[#332226] bg-white dark:bg-surface-dark p-4 flex-col shadow-sm">
            <Icon name="check_circle" className="text-emerald-500" />
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-500 dark:text-[#bc9aa3] text-xs font-semibold uppercase tracking-wider">Vendas Realizadas</h2>
              <p className="text-2xl font-bold leading-tight text-emerald-500">{stats.paid}</p>
            </div>
          </div>
        </div>
        <div className="px-4 mb-6">
          <div className="relative overflow-hidden flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-primary p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                {selectedPeriod === 'all' ? 'Comissão Pendente' : 'Comissão do Mês'}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-white/70 text-lg font-medium">R$</span>
                <h2 className="text-white text-4xl font-black tracking-tighter">
                  {commission.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <p className="text-white/80 text-sm font-medium">
                  {selectedPeriod === 'all' ? 'Status Geral' : 'Performance'}
                </p>
                <div className="flex items-center gap-1 text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">
                  <Icon name={growth >= 0 ? "trending_up" : "trending_down"} className="text-sm" />
                  <span>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 mb-4 flex-grow">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-slate-500 dark:text-[#bc9aa3] text-xs font-semibold uppercase tracking-wider">Status do Pagamento</h3>
            <span className="text-[10px] text-slate-400">ID: #882910</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#332226] bg-white dark:bg-surface-dark p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full ${lastPayment ? 'bg-emerald-500/10' : 'bg-amber-500/10'} flex items-center justify-center`}>
                  <Icon name="payments" className={lastPayment ? 'text-emerald-500' : 'text-amber-500'} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-[#bc9aa3]">Último Pagamento</p>
                  <p className={`text-sm font-bold ${lastPayment ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {lastPayment ? 'CONCLUÍDO' : 'NENHUMA TRANSFERÊNCIA'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-[#bc9aa3]">Data</p>
                <p className="text-sm font-semibold">
                  {lastPayment ? new Date(lastPayment.created_at).toLocaleDateString('pt-BR') : '--/--/----'}
                </p>
              </div>
            </div>
            {lastPayment && (
              <button className="w-full flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-4 bg-primary text-white text-sm font-bold leading-normal transition-transform active:scale-95 shadow-md shadow-primary/20 hover:bg-primary/90">
                <Icon name="receipt_long" className="text-lg" />
                <span className="truncate">VER COMPROVANTE</span>
              </button>
            )}
            {!lastPayment && (
              <div className="text-center py-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest italic">Aguardando seu primeiro ciclo</p>
              </div>
            )}
          </div>
          <div className="mt-6 p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 flex items-start gap-3">
            <Icon name="info" className="text-primary text-sm mt-0.5" />
            <p className="text-xs leading-relaxed text-slate-600 dark:text-[#bc9aa3]">
              Próximo ciclo de faturamento encerra em <span className="font-bold text-primary">
                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </span>. Os pagamentos são realizados em até 5 dias úteis.
            </p>
          </div>
        </div>
        <div className="px-4 pb-12 mt-4">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 mx-auto text-[#f0f0f0]/60 hover:text-[#f0f0f0] transition-colors py-2 px-4 rounded-lg active:scale-95"
          >
            <Icon name="logout" className="text-xl" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </main>
    </div>
  );
};