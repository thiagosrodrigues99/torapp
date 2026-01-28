import React, { useState } from 'react';
import { Icon } from './Icon';
import { BottomNavigation } from './BottomNavigation';
import { supabase } from '../lib/supabase';
import { WorkoutCard } from './WorkoutCard';

interface UserDashboardProps {
  onEditProfile: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  currentTab: string;
  onSeeAllMedals: () => void;
  onStartWorkout: () => void;
  onRunClick: () => void;
  onRecipesClick: () => void;
  onPersonalTrainerClick: () => void;
  onStartChallenge: () => void;
  onHomeWorkoutClick: () => void;
}

interface Medal {
  id: string;
  title: string;
  icon: string;
  points_required: number;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onEditProfile,
  onLogout,
  onNavigate,
  currentTab,
  onSeeAllMedals,
  onStartWorkout,
  onRunClick,
  onRecipesClick,
  onPersonalTrainerClick,
  onStartChallenge,
  onHomeWorkoutClick
}) => {
  const [activePlan, setActivePlan] = useState<{ name: string; category: string } | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [userData, setUserData] = useState({
    fullName: 'Usuário',
    points: 0,
    avatarUrl: ''
  });
  const [medals, setMedals] = useState<Medal[]>([]);
  const [earnedMedalIds, setEarnedMedalIds] = useState<string[]>([]);

  React.useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('assigned_plan_id, gender, coupon, full_name, points, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      setUserData({
        fullName: profile.full_name || 'Usuário',
        points: profile.points || 0,
        avatarUrl: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'Alun@')}&background=DC003C&color=fff`
      });

      if (profile.coupon) {
        setActiveCoupon(profile.coupon);
      }

      let planId = profile.assigned_plan_id;

      // If no assigned plan, look for default plan based on gender
      if (!planId && profile.gender) {
        const category = profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1);
        const { data: defaultPlan } = await supabase
          .from('workout_plans')
          .select('id')
          .eq('category', category)
          .eq('type', 'default')
          .maybeSingle();

        if (defaultPlan) {
          planId = defaultPlan.id;
        }
      }

      if (planId) {
        const { data: plan, error: planError } = await supabase
          .from('workout_plans')
          .select('id, name, category')
          .eq('id', planId)
          .single();

        if (planError) throw planError;
        setActivePlan(plan);
      }

      // Fetch all medals
      const { data: allMedals } = await supabase
        .from('medals')
        .select('*')
        .order('points_required', { ascending: true });

      if (allMedals) setMedals(allMedals);

      // Fetch earned medals
      const { data: earned } = await supabase
        .from('user_medals')
        .select('medal_id')
        .eq('user_id', session.user.id);

      if (earned) {
        setEarnedMedalIds(earned.map(e => e.medal_id));
      }

    } catch (err) {
      console.error('Error fetching user plan:', err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const [showCheckout, setShowCheckout] = useState(false);
  const [pixData, setPixData] = useState<{ paymentId: string; qrCodeText: string; qrCodeBase64?: string; amount: number } | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    const code = couponInput.trim().toUpperCase();

    try {
      setApplyingCoupon(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Verify if coupon exists (is an influencer)
      const { data: influencer, error: infError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'influencer')
        .eq('coupon', code)
        .maybeSingle();

      if (infError) throw infError;
      if (!influencer) {
        alert('Cupom não encontrado ou inválido.');
        return;
      }

      // 2. Check if user already paid for THIS influencer's workout
      const { data: existingPayment } = await supabase
        .from('financial_transactions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('influencer_id', influencer.id)
        .eq('type', 'payment')
        .maybeSingle();

      if (existingPayment) {
        // Already paid, just activate
        await activateUserCoupon(session.user.id, code);
        return;
      }

      // 3. Not paid, open checkout
      setSelectedInfluencer(influencer);
      setShowCheckout(true);

    } catch (err) {
      console.error('Error applying coupon:', err);
      alert('Erro ao processar cupom.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const activateUserCoupon = async (userId: string, coupon: string, influencerId?: string, amount?: number) => {
    try {
      setApplyingCoupon(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          coupon: coupon,
          status: 'Ativo'
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // If this was a new payment, record it
      if (influencerId && amount) {
        await supabase.from('financial_transactions').insert({
          user_id: userId,
          influencer_id: influencerId,
          amount: amount,
          type: 'payment',
          description: `Adesão via Cupom: ${coupon}`
        });
      }

      setActiveCoupon(coupon);
      setCouponInput('');
      setShowCheckout(false);
      setPixData(null);
      alert('Parabéns! Seu acesso foi ativado com sucesso. Aproveite seus treinos! 🚀');
      fetchUserPlan();
    } catch (err) {
      console.error('Error activating coupon:', err);
      alert('Erro ao ativar acesso. Entre em contato com o suporte.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const generatePix = async () => {
    if (!selectedInfluencer) return;

    try {
      setApplyingCoupon(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const keysStr = localStorage.getItem('torapp_mercadopago_keys');
      if (!keysStr) {
        // Fallback simulation if no key configured
        alert('Configurações do Mercado Pago não encontradas no Admin. Simulando PIX para testes...');
        setPixData({
          paymentId: 'simulated',
          qrCodeText: '00020126580014BR.GOV.BCB.PIX0136...FAKE_PIX_QR_CODE...',
          amount: selectedInfluencer.workout_price || 79.90
        });
        return;
      }

      const keys = JSON.parse(keysStr);
      const price = selectedInfluencer.workout_price || 79.90;

      const response = await fetch('/mp-api/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys.accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `pay-${session.user.id}-${Date.now()}`
        },
        body: JSON.stringify({
          transaction_amount: price,
          description: `Treino TorApp - ${selectedInfluencer.full_name}`,
          payment_method_id: 'pix',
          payer: {
            email: session.user.email,
            first_name: userData.fullName.split(' ')[0],
            last_name: userData.fullName.split(' ').slice(1).join(' ') || 'User'
          }
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao gerar PIX');
      }

      const payment = await response.json();
      setPixData({
        paymentId: payment.id.toString(),
        qrCodeText: payment.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
        amount: price
      });

    } catch (err) {
      console.error('Error generating PIX:', err);
      alert('Não foi possível gerar o PIX. Tente novamente ou use outro cupom.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!pixData?.paymentId) return;

    try {
      setApplyingCoupon(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const keysStr = localStorage.getItem('torapp_mercadopago_keys');
      if (!keysStr) {
        if (pixData.paymentId === 'simulated') {
          await activateUserCoupon(session.user.id, selectedInfluencer.coupon, selectedInfluencer.id, pixData.amount);
          return;
        }
        alert('Configurações do Mercado Pago não encontradas.');
        return;
      }

      const keys = JSON.parse(keysStr);
      const response = await fetch(`/mp-api/v1/payments/${pixData.paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keys.accessToken}`
        }
      });

      if (!response.ok) throw new Error('Erro ao consultar status do pagamento');

      const payment = await response.json();

      if (payment.status === 'approved') {
        await activateUserCoupon(session.user.id, selectedInfluencer.coupon, selectedInfluencer.id, pixData.amount);
      } else if (payment.status === 'pending') {
        alert('O pagamento ainda está pendente. Por favor, complete o pagamento no seu banco e aguarde alguns segundos.');
      } else {
        alert(`Status do pagamento: ${payment.status}. Se você já pagou, entre em contato com o suporte.`);
      }

    } catch (err) {
      console.error('Error checking payment:', err);
      alert('Erro ao verificar pagamento. Tente novamente em alguns instantes.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCopyCoupon = () => {
    if (activeCoupon) {
      navigator.clipboard.writeText(activeCoupon);
      alert('Cupom copiado para a área de transferência!');
    }
  };


  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-40 font-display">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button
            onClick={onLogout}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-dark/10 dark:bg-surface-dark hover:bg-primary/20 transition-colors"
            title="Sair"
          >
            <Icon name="logout" className="text-primary" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Dashboard</h2>
          <div className="flex items-center justify-end">
            <button onClick={onEditProfile} className="text-primary text-sm font-bold leading-normal tracking-wide">Editar Perfil</button>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20 border-2 border-primary"
              style={{ backgroundImage: `url("${userData.avatarUrl}")` }}
            ></div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface-dark">
              PRO
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold leading-tight">{userData.fullName}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Icon name="stars" className="text-primary text-sm" fill />
              <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-medium">
                {userData.points.toLocaleString('pt-BR')} Pontos
              </p>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${activePlan ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                {activePlan ? 'Plano Ativo' : 'Sem Plano'}
              </span>
            </div>
          </div>
        </div>

        {/* Invite Friend */}
        <button className="flex items-center justify-between bg-card-nutrition hover:bg-[#323232] border border-white/5 p-4 rounded-xl shadow-lg transition-all active:scale-[0.98] w-full text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Icon name="person_add" className="text-primary text-2xl" />
            </div>
            <span className="text-[#f0f0f0] font-bold text-sm tracking-widest uppercase">Convidar Amigo</span>
          </div>
          <Icon name="chevron_right" className="text-[#f0f0f0]/30" />
        </button>

        {/* Coupon Input/Display Section */}
        {activeCoupon ? (
          <div className="flex items-center justify-between bg-card-nutrition border border-dashed border-white/20 p-4 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                <Icon name="confirmation_number" className="text-[#f0f0f0]/60 text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Cupom Ativo</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#f0f0f0] font-bold text-base tracking-widest uppercase">{activeCoupon}</p>
                  <button
                    onClick={() => setActiveCoupon(null)}
                    className="text-[10px] text-primary font-bold uppercase hover:underline"
                  >
                    Trocar
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleCopyCoupon}
              className="size-10 flex items-center justify-center rounded-lg bg-white/5 active:bg-white/10 text-white/60 transition-colors"
            >
              <Icon name="content_copy" className="text-xl" />
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-dark p-1 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex gap-1">
            <div className="flex-1 relative flex items-center">
              <div className="absolute left-3 text-slate-400">
                <Icon name="confirmation_number" className="text-xl" />
              </div>
              <input
                type="text"
                placeholder="DIGITE SEU CUPOM"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full bg-transparent h-12 pl-11 pr-4 text-xs font-black tracking-widest uppercase focus:outline-none dark:text-white"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !couponInput.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 rounded-lg h-12 text-xs font-black transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              {applyingCoupon ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'ATIVAR'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Medals */}
      <div>
        <div className="flex items-center justify-between px-4 pb-2 pt-2">
          <h3 className="text-lg font-bold leading-tight tracking-tight">Suas Medalhas</h3>
          <button onClick={onSeeAllMedals} className="text-primary text-xs font-bold">Ver Tudo</button>
        </div>
        <div className="flex w-full overflow-x-auto px-4 py-3 hide-scrollbar">
          <div className="flex flex-row items-start justify-start gap-6">
            {medals.length > 0 ? (
              medals.map((medal) => {
                const isEarned = earnedMedalIds.includes(medal.id) || userData.points >= medal.points_required;

                // Color mapping logic
                let color = "text-slate-500";
                let from = "";
                let to = "";
                let bg = "bg-slate-700";

                if (isEarned) {
                  bg = "";
                  if (medal.title === 'Iniciante') { color = "text-yellow-500"; from = "from-yellow-300"; to = "to-orange-500"; }
                  else if (medal.title === 'Hidratado') { color = "text-blue-400"; from = "from-blue-300"; to = "to-indigo-500"; }
                  else if (medal.title === 'Maratonista') { color = "text-orange-500"; from = "from-orange-300"; to = "to-red-500"; }
                  else if (medal.title === 'Elite') { color = "text-yellow-500"; from = "from-yellow-200"; to = "to-amber-500"; }
                  else { color = "text-primary"; from = "from-primary/50"; to = "to-primary"; }
                }

                return (
                  <MedalItem
                    key={medal.id}
                    icon={medal.icon}
                    label={medal.title}
                    color={color}
                    from={from}
                    to={to}
                    bg={bg}
                    inactive={!isEarned}
                    imageUrl={medal.image_url}
                  />
                );
              })
            ) : (
              <>
                <MedalItem icon="emoji_events" label="7 Dias" color="text-yellow-500" from="from-yellow-300" to="to-orange-500" />
                <MedalItem icon="water_drop" label="Hidratado" color="text-blue-400" from="from-blue-300" to="to-indigo-500" />
                <MedalItem icon="fitness_center" label="Maratonista" color="text-slate-500" bg="bg-slate-700" inactive />
                <MedalItem icon="bolt" label="Elite" color="text-slate-500" bg="bg-slate-700" inactive />
              </>
            )}
          </div>
        </div>
      </div>



      <WorkoutCard
        onStartWorkout={onStartWorkout}
        planName={activePlan?.name}
        category={activePlan?.category}
        loading={loadingPlan}
        progress={0}
      />

      {/* Promo Card - Only show if coupon exists */}
      {activeCoupon && (
        <div className="px-4 mt-8 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold leading-tight tracking-tight">Treino Especial</h3>
            <Icon name="card_membership" className="text-primary text-xl" fill />
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-dark to-primary/20 border border-primary/30 p-5 shadow-xl">
            <div className="absolute top-0 right-0 p-3">
              <span className="text-[10px] bg-primary text-white font-black px-2 py-1 rounded">CUPOM ATIVO</span>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xl font-bold text-white">Full Body Explosive</p>
                <p className="text-xs text-white/60 mt-1">Treino exclusivo desbloqueado</p>
              </div>
            </div>
            <button onClick={onStartChallenge} className="flex items-center justify-center w-full bg-white text-primary rounded-lg h-12 font-bold transition-all active:scale-95 shadow-lg">
              <Icon name="bolt" className="mr-2" />
              INICIAR DESAFIO
            </button>
          </div>
        </div>
      )}

      {/* Menu Cards */}
      <div className="px-4 mt-8 space-y-4">
        <MenuCard
          icon="home_health"
          title="Treino em Casa"
          subtitle="Exercícios para fazer onde estiver"
          buttonText="INICIAR"
          onClick={onHomeWorkoutClick}
        />
        <MenuCard
          icon="directions_run"
          title="Corrida / Caminhada"
          subtitle="Monitore seu percurso"
          buttonText="INICIAR"
          onClick={onRunClick}
        />
        <MenuCard
          icon="restaurant"
          title="Alimentação"
          subtitle="Receitas e dietas saudáveis"
          buttonText="VER RECEITAS"
          onClick={onRecipesClick}
        />
        <MenuCard
          icon="support_agent"
          title="Personal Trainer"
          subtitle="Fale com um especialista"
          buttonText="WHATSAPP"
          onClick={onPersonalTrainerClick}
        />
      </div>



      {/* Logout */}
      <div className="px-4 mt-12 mb-32 flex justify-center">
        <button
          onClick={() => {
            console.log('Botão Sair clicado');
            onLogout();
          }}
          className="flex items-center gap-2 py-3 px-6 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 text-sm font-medium transition-all active:scale-95"
        >
          <Icon name="logout" className="text-xl" />
          <span>Sair da conta</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} onNavigate={onNavigate} />

      {/* Checkout Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-6 right-6 size-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <Icon name="close" />
            </button>

            <div className="p-8 pt-12 flex flex-col items-center text-center">
              <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/5">
                <Icon name="shopping_basket" className="text-4xl" />
              </div>

              {!pixData ? (
                <>
                  <h3 className="text-2xl font-black text-white uppercase italic leading-tight mb-2">Checkout TorApp</h3>
                  <p className="text-sm text-slate-400 mb-8 px-4 font-medium leading-relaxed italic">
                    Você está prestes a desbloquear o treino de <span className="text-white font-bold">{selectedInfluencer?.full_name}</span>.
                  </p>

                  <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Valor do Investimento</p>
                    <p className="text-4xl font-black text-white italic">
                      {(selectedInfluencer?.workout_price || 79.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                  <button
                    onClick={generatePix}
                    disabled={applyingCoupon}
                    className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs italic flex items-center justify-center gap-3"
                  >
                    {applyingCoupon ? <Icon name="sync" className="animate-spin" /> : <Icon name="bolt" />}
                    {applyingCoupon ? 'Processando...' : 'Pagar com PIX'}
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <h3 className="text-xl font-black text-white uppercase italic leading-tight mb-6">Escaneie o QR Code</h3>

                  <div className="bg-white p-4 rounded-3xl mb-6 shadow-xl w-64 h-64 mx-auto flex items-center justify-center">
                    {pixData.qrCodeBase64 ? (
                      <img
                        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                        alt="QR Code PIX"
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(pixData.qrCodeText)}`}
                        alt="QR Code PIX"
                        className="w-full h-full"
                      />
                    )}
                  </div>

                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Clique no código abaixo para copiar</p>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.qrCodeText);
                      alert('Código PIX Copia e Cola copiado!');
                    }}
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[9px] text-slate-400 break-all leading-relaxed mb-8 hover:bg-black/60 transition-colors"
                  >
                    {pixData.qrCodeText}
                  </button>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={checkPaymentStatus}
                      disabled={applyingCoupon}
                      className="w-full h-14 bg-emerald-500 text-white font-black rounded-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest text-xs italic flex items-center justify-center gap-2"
                    >
                      {applyingCoupon ? <Icon name="sync" className="animate-spin" /> : <Icon name="check_circle" />}
                      {applyingCoupon ? 'Verificando...' : 'Já Realizei o Pagamento'}
                    </button>
                    <button
                      onClick={() => setPixData(null)}
                      className="w-full h-12 bg-transparent text-slate-500 font-bold hover:text-white transition-colors uppercase tracking-widest text-[10px]"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MedalItem = ({ icon, label, color, from, to, bg, inactive, imageUrl }: { icon: string; label: string; color: string; from?: string; to?: string; bg?: string; inactive?: boolean; key?: string; imageUrl?: string }) => (
  <div className={`flex flex-col items-center gap-2 w-16 text-center ${inactive ? 'grayscale-filter' : ''}`}>
    <div className={`w-16 h-16 ${bg ? bg : `bg-gradient-to-br ${from} ${to}`} p-0.5 rounded-full overflow-hidden shadow-lg`}>
      <div className="w-full h-full bg-center bg-no-repeat aspect-square bg-cover rounded-full border-2 border-white/20 flex items-center justify-center bg-surface-dark overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-contain" alt={label} />
        ) : (
          <Icon name={icon} className={`${color} text-3xl`} fill={!inactive} />
        )}
      </div>
    </div>
    <p className={`text-[11px] font-medium leading-tight ${inactive ? 'text-slate-500' : ''}`}>{label}</p>
  </div>
);

const MenuCard = ({ icon, title, subtitle, buttonText, onClick }: { icon: string; title: string; subtitle: string; buttonText: string; onClick: () => void }) => (
  <div className="relative overflow-hidden rounded-xl bg-card-nutrition border-2 border-primary/40 p-5 shadow-xl flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <Icon name={icon} className="text-3xl" />
      </div>
      <div>
        <p className="text-lg font-bold text-white leading-tight">{title}</p>
        <p className="text-xs text-white/60">{subtitle}</p>
      </div>
    </div>
    <button onClick={onClick} className="bg-primary hover:bg-primary/90 text-white px-5 rounded-lg h-10 text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/40 uppercase">
      {buttonText}
    </button>
  </div>
);
