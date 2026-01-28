import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';
import { CommissionPayment } from './CommissionPayment';
import { InfluencerSales } from './InfluencerSales';
import { EditInfluencer } from './EditInfluencer';
import { CreateInfluencer } from './CreateInfluencer';

interface Influencer {
  id: string;
  full_name: string;
  username: string;
  coupon: string;
  status: string;
  phone: string;
  avatar_url?: string;
  commission_per_user: number;
  commission_pending: number;
}

interface InfluencersManagementProps {
  onBack: () => void;
}

export const InfluencersManagement: React.FC<InfluencersManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'payment' | 'sales' | 'edit' | 'create'>('list');
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalCount: 0,
    totalSales: 0,
    pendingCommissions: 0
  });

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);

      // 1. Fetch all influencers
      const { data: influencerProfiles, error: infError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'influencer');

      if (infError) throw infError;

      // 2. Fetch all users to calculate commissions and sales
      const { data: allUsers, error: userError } = await supabase
        .from('profiles')
        .select('coupon, status')
        .eq('role', 'user');

      if (userError) throw userError;

      const formattedInfluencers: Influencer[] = (influencerProfiles || []).map(inf => {
        const referredUsers = (allUsers || []).filter(u => u.coupon === inf.coupon);
        const paidUsers = referredUsers.filter(u => u.status === 'Ativo').length;
        const commissionValue = inf.commission_per_user || 35;

        return {
          id: inf.id,
          full_name: inf.full_name || 'Sem Nome',
          username: inf.username || inf.full_name?.toLowerCase().replace(/\s/g, '') || 'influencer',
          coupon: inf.coupon || '---',
          status: inf.status || 'Ativo',
          phone: inf.phone || '---',
          avatar_url: inf.avatar_url,
          commission_per_user: commissionValue,
          commission_pending: paidUsers * commissionValue
        };
      });

      setInfluencers(formattedInfluencers);

      // Calculate global stats
      const totalSalesCount = (allUsers || []).filter(u =>
        u.status === 'Ativo' &&
        formattedInfluencers.some(inf => inf.coupon === u.coupon)
      ).length;

      setStats({
        totalCount: formattedInfluencers.length,
        totalSales: totalSalesCount * 79.90, // Example plan price R$ 79,90
        pendingCommissions: formattedInfluencers.reduce((acc, curr) => acc + curr.commission_pending, 0)
      });

    } catch (err) {
      console.error('Error fetching influencers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInfluencers = influencers.filter(inf =>
    inf.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.coupon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'payment') {
    return <CommissionPayment onBack={() => setView('list')} />;
  }

  if (view === 'sales' && selectedInfluencerId) {
    return <InfluencerSales influencerId={selectedInfluencerId} onBack={() => setView('list')} />;
  }

  if (view === 'edit' && selectedInfluencerId) {
    return <EditInfluencer influencerId={selectedInfluencerId} onBack={() => { setView('list'); fetchInfluencers(); }} />;
  }

  if (view === 'create') {
    return (
      <CreateInfluencer
        onBack={() => {
          setView('list');
          fetchInfluencers();
        }}
      />
    );
  }

  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" className="text-xl" />
            </button>
            <h2 className="text-lg lg:text-xl font-bold tracking-tight uppercase italic text-white leading-tight">Gestão de Comissões e Perfil</h2>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
            <button
              onClick={() => setView('create')}
              className="bg-primary hover:bg-[#b50031] text-white p-2.5 lg:px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Icon name="add_circle" className="text-lg" />
              <span className="hidden sm:inline">Cadastrar Influenciador</span>
            </button>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors relative">
                <Icon name="notifications" className="text-2xl" />
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
              </button>
              <button className="flex items-center gap-3 px-1 lg:px-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold uppercase leading-none">Administrador</p>
                  <p className="text-[9px] text-slate-500 uppercase">Acesso Total</p>
                </div>
                <Icon name="account_circle" className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8 w-full max-w-[1600px] mx-auto space-y-6 lg:space-y-8">

        {/* FILTER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card-dark/50 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="calendar_month" />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Período de Análise</h3>
              <p className="text-sm font-bold text-white">Janeiro 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <select className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-xs font-bold text-[#f0f0f0] focus:ring-primary focus:border-primary cursor-pointer w-full md:w-48 transition-all hover:bg-white/5">
                <option value="2026-01">Janeiro 2026</option>
                <option value="2025-12">Dezembro 2025</option>
                <option value="2025-11">Novembro 2025</option>
                <option value="2025-10">Outubro 2025</option>
                <option value="2025-09">Setembro 2025</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xl">
                <Icon name="expand_more" />
              </span>
            </div>
            <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5">
              <Icon name="filter_list" />
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="groups" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Influenciadores</p>
              <p className="text-3xl font-black text-white mt-1">{stats.totalCount}</p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Icon name="payments" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vendas por Cupom (R$)</p>
              <p className="text-3xl font-black text-white mt-1">
                {stats.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5 flex items-center gap-5">
            <div className="size-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Icon name="account_balance_wallet" className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comissões Pendentes</p>
              <p className="text-3xl font-black text-white mt-1">
                {stats.pendingCommissions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <h3 className="text-sm font-black uppercase tracking-widest">Base de Parceiros</h3>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  <Icon name="search" />
                </span>
                <input
                  className="bg-[#1a1a1a] border-white/5 rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-primary focus:border-primary w-full text-white placeholder:text-slate-500 outline-none"
                  placeholder="Buscar influenciador..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Influenciador</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Cupom</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">Status Cupom</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Telefone</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">R$/Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Comissão Pendente</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Carregando influenciadores...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredInfluencers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 italic">
                      Nenhum influenciador encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredInfluencers.map((inf) => (
                    <tr key={inf.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-primary/20 flex-shrink-0 flex items-center justify-center">
                            {inf.avatar_url ? (
                              <img alt="Avatar" className="w-full h-full object-cover" src={inf.avatar_url} />
                            ) : (
                              <Icon name="person" className="text-xl text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{inf.full_name}</p>
                            <p className="text-[10px] text-slate-500">@{inf.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary text-[11px] font-black px-3 py-1 rounded-md uppercase">{inf.coupon}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={inf.status === 'Ativo'} readOnly className="sr-only peer" type="checkbox" />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-300">{inf.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-500/10 text-green-500 text-sm font-black px-3 py-1 rounded-md">
                          {inf.commission_per_user.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm font-black text-white">
                          {inf.commission_pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${inf.commission_pending > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                          } uppercase`}>
                          <span className={`size-1.5 rounded-full ${inf.commission_pending > 0 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                          {inf.commission_pending > 0 ? 'Pendente' : 'Em Dia'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInfluencerId(inf.id);
                              setView('edit');
                            }}
                            className="p-2 text-white hover:text-primary transition-colors flex items-center justify-center rounded-lg hover:bg-white/5 border border-white/5"
                            title="Editar Perfil"
                          >
                            <Icon name="edit" className="text-lg" />
                          </button>
                          <button
                            onClick={() => setView('payment')}
                            className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg transition-colors shadow-lg ${inf.commission_pending > 0
                              ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                              : 'bg-white/5 text-slate-500 cursor-not-allowed'
                              }`}
                            disabled={inf.commission_pending === 0}
                          >
                            {inf.commission_pending > 0 ? 'Pagar' : 'Pago'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInfluencerId(inf.id);
                              setView('sales');
                            }}
                            className="px-3 py-2 text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                          >
                            Vendas
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Total: {filteredInfluencers.length} influenciadores encontrados
            </p>
          </div>
        </div>

        <div className="text-center py-6">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2">Painel Administrativo</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">© 2026 Fitness Platform • Gestão de Dados</p>
        </div>
      </main>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
      </div>
    </div>
  );
};