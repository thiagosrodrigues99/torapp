import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface CommissionPaymentProps {
  influencerId: string;
  onBack: () => void;
}

export const CommissionPayment: React.FC<CommissionPaymentProps> = ({ influencerId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [influencer, setInfluencer] = useState({
    id: '',
    full_name: '',
    username: '',
    avatar_url: '',
    pix_key: '',
    pending_amount: 0
  });

  useEffect(() => {
    fetchInfluencerData();
  }, [influencerId]);

  const fetchInfluencerData = async () => {
    try {
      setLoading(true);
      // 1. Fetch influencer profile
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', influencerId)
        .single();

      if (profError) throw profError;

      // 2. Calculate earnings
      const { data: allUsers, error: userError } = await supabase
        .from('profiles')
        .select('coupon, status')
        .eq('coupon', profile.coupon)
        .eq('role', 'user')
        .eq('status', 'Ativo');

      if (userError) throw userError;

      const commissionSetting = profile.commission_value || profile.commission_per_user || 35;
      const totalEarned = (allUsers?.length || 0) * commissionSetting;

      // 3. Subtract payments
      const { data: payments, error: payError } = await supabase
        .from('influencer_payments')
        .select('amount')
        .eq('influencer_id', influencerId);

      if (payError) throw payError;

      const paidAmount = (payments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      setInfluencer({
        id: profile.id,
        full_name: profile.full_name || 'Influenciador',
        username: profile.username || '',
        avatar_url: profile.avatar_url || '',
        pix_key: profile.pix_key || 'Não cadastrada',
        pending_amount: Math.max(0, totalEarned - paidAmount)
      });
    } catch (err) {
      console.error('Error fetching data for payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (influencer.pending_amount <= 0) {
      alert('Não há comissão pendente para pagar.');
      return;
    }

    const confirm = window.confirm(`Deseja marcar o valor de R$ ${influencer.pending_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} como pago?`);
    if (!confirm) return;

    try {
      setPaying(true);
      const { error } = await supabase
        .from('influencer_payments')
        .insert({
          influencer_id: influencer.id,
          amount: influencer.pending_amount,
          status: 'Concluído'
        });

      if (error) throw error;

      alert('Comissão marcada como paga com sucesso!');
      onBack();
    } catch (err: any) {
      console.error('Error marking as paid:', err);
      alert('Erro ao registrar pagamento: ' + err.message);
    } finally {
      setPaying(false);
    }
  };

  const copyPix = () => {
    if (influencer.pix_key === 'Não cadastrada') return;
    navigator.clipboard.writeText(influencer.pix_key);
    alert('Chave Pix copiada!');
  };

  if (loading) {
    return (
      <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <h2 className="text-lg font-bold tracking-tight uppercase italic text-white leading-tight">
              Pagar Comissão - {influencer.full_name}
            </h2>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-8 w-full max-w-2xl mx-auto space-y-6">
        <div className="bg-card-dark p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className={`text-[10px] font-black uppercase tracking-widest ${influencer.pending_amount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
              {influencer.pending_amount > 0 ? 'Pendente' : 'Em Dia'}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Valor Total a Pagar</p>
          <h1 className="text-5xl font-black text-primary tracking-tighter">
            {influencer.pending_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h1>
        </div>
        <div className="bg-card-dark p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="size-12 rounded-full bg-slate-700 overflow-hidden ring-2 ring-primary/20 flex items-center justify-center">
              {influencer.avatar_url ? (
                <img alt="Avatar" className="w-full h-full object-cover" src={influencer.avatar_url} />
              ) : (
                <Icon name="person" className="text-2xl text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wide">{influencer.full_name}</p>
              {influencer.username && <p className="text-xs text-slate-500">@{influencer.username}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Chave Pix para Pagamento</label>
              <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="font-mono text-sm text-slate-200">{influencer.pix_key}</span>
                <button
                  onClick={copyPix}
                  disabled={influencer.pix_key === 'Não cadastrada'}
                  className="text-primary hover:text-white transition-colors disabled:opacity-30"
                >
                  <Icon name="content_copy" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-2xl border border-white/5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Upload de Comprovante</label>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group">
            <div className="size-14 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
              <Icon name="cloud_upload" className="text-3xl font-light" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white uppercase tracking-wide">Arraste o comprovante aqui</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1">Funcionalidade de anexo em breve</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleMarkAsPaid}
            disabled={paying || influencer.pending_amount <= 0}
            className="w-full bg-primary hover:bg-[#b50031] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
          >
            {paying ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                <Icon name="check_circle" />
                Marcar como Pago
              </>
            )}
          </button>
        </div>
        <div className="text-center py-6">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-bold">O saldo pendente será zerado após a confirmação do pagamento</p>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-xl bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};
