import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface EditInfluencerProps {
  influencerId: string;
  onBack: () => void;
}

export const EditInfluencer: React.FC<EditInfluencerProps> = ({ influencerId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    phone: '',
    coupon: '',
    status: 'Ativo'
  });

  useEffect(() => {
    fetchInfluencer();
  }, [influencerId]);

  const fetchInfluencer = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', influencerId)
        .single();

      if (error) throw error;

      setProfile({
        full_name: data.full_name || '',
        username: data.username || '',
        phone: data.phone || '',
        coupon: data.coupon || '',
        status: data.status || 'Ativo'
      });
    } catch (err) {
      console.error('Error fetching influencer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          coupon: profile.coupon.toUpperCase(),
          status: profile.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', influencerId);

      if (error) throw error;
      alert('Influenciador atualizado com sucesso!');
      onBack();
    } catch (err) {
      console.error('Error saving influencer:', err);
      alert('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = profile.status === 'Ativo' ? 'Inativo' : 'Ativo';
    if (!confirm(`Deseja realmente ${newStatus === 'Ativo' ? 'ativar' : 'desativar'} este influenciador?`)) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', influencerId);

      if (error) throw error;
      setProfile({ ...profile, status: newStatus });
      alert(`Influenciador ${newStatus === 'Ativo' ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="bg-background-dark text-gray-94 min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <h2 className="text-xl font-bold tracking-tight uppercase italic text-white">Editar Influenciador</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-4">
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
      <main className="flex-1 p-8 w-full max-w-5xl mx-auto space-y-8">
        <form className="space-y-8" onSubmit={handleSave}>
          <section className="bg-card-dark/30 p-8 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Dados Pessoais</label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Nome Completo</label>
                <input
                  className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none"
                  placeholder="Ex: Bruno Siqueira"
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">WhatsApp</label>
                <input
                  className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none"
                  placeholder="(00) 00000-0000"
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>
          </section>
          <section className="bg-card-dark/30 p-8 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Configurações de Parceiro</label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Cupom Ativo</label>
                <input
                  className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-primary font-black uppercase focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none"
                  placeholder="CUPOM10"
                  type="text"
                  value={profile.coupon}
                  onChange={(e) => setProfile({ ...profile, coupon: e.target.value })}
                />
              </div>
              <div className="md:col-span-6">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Status da Parceria</label>
                <div className="flex bg-card-dark rounded-lg p-1 border border-white/5 gap-1">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, status: 'Ativo' })}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${profile.status === 'Ativo' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-slate-500 hover:bg-white/5'}`}
                  >
                    Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, status: 'Inativo' })}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${profile.status === 'Inativo' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:bg-white/5'}`}
                  >
                    Inativo
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-card-dark/30 p-8 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Acesso ao Painel</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Usuário (E-mail interno)</label>
                <input
                  className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed w-full outline-none"
                  value={`${profile.username}@tor.app`}
                  disabled
                  type="text"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Status da Conta</label>
                <div className="flex items-center gap-2 h-[46px] px-4 bg-card-dark border border-white/5 rounded-lg">
                  <div className={`size-2 rounded-full ${profile.status === 'Ativo' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-white font-bold uppercase">{profile.status}</span>
                </div>
              </div>
            </div>
          </section>
          <div className="pt-4 flex flex-col gap-4">
            <button
              className="w-full bg-primary hover:bg-[#b50031] text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              onClick={handleToggleStatus}
              className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${profile.status === 'Ativo' ? 'bg-transparent hover:bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500 text-white'
                }`}
              type="button"
              disabled={saving}
            >
              {profile.status === 'Ativo' ? 'Desativar Influenciador' : 'Ativar Influenciador'}
            </button>
          </div>
        </form>
        <div className="text-center py-10">
          <h1 className="text-xl font-black text-white uppercase tracking-tight italic mb-2 opacity-50">Painel Administrativo</h1>
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-bold">Gestão de Dados do Parceiro</p>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
      </div>
    </div>
  );
};