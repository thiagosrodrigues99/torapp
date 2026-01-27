import React, { useState } from 'react';
import { Icon } from './Icon';
import { BottomNavigation } from './BottomNavigation';

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
  onStartChallenge
}) => {
  const [waterAmount, setWaterAmount] = useState(1500); // Meta inicial de 1.5L
  const [showGoalModal, setShowGoalModal] = useState(false);
  const waterGoal = 3000; // Meta de 3L

  const handleAddWater = () => {
    setWaterAmount(prev => {
      const next = Math.min(waterGoal, prev + 250);
      if (next >= waterGoal && prev < waterGoal) {
        setShowGoalModal(true);
      }
      return next;
    });
  };

  const waterPercentage = Math.round((waterAmount / waterGoal) * 100);
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
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20 border-2 border-primary" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANeNZUVtKlRv1f-VdcwLmwm7M1Zw5MoMCBFHJQeYT9TsedZcAd0wuMwA1ayOMkTF-9pZUm52hTp5fBsJgGlaRNOpyg8L_C-OTX_wMyt9GVEohDytdScroGXZMByO47XaCMx09Fi8TqBlzCRaoZhapP2arcPz_hljo_4cvKYg4GDFIPrwVGxecMUxRi_OXlWWP7Q5_bEqPvEoIo8gS4QgEln4God8y6sYvTobnSkHi-lWvFo68wAbWlWJN5OpAQHtJQZdza47DysKPt")' }}></div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface-dark">
              PRO
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-xl font-bold leading-tight">João Silva</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Icon name="stars" className="text-primary text-sm" fill />
              <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-medium">1.250 Pontos</p>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                Plano Ativo
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

        {/* Coupon Active */}
        <div className="flex items-center justify-between bg-card-nutrition border border-dashed border-white/20 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
              <Icon name="confirmation_number" className="text-[#f0f0f0]/60 text-xl" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Cupom Ativo</p>
              <p className="text-[#f0f0f0] font-bold text-base tracking-widest">FIT2024</p>
            </div>
          </div>
          <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 active:bg-white/10 text-white/60">
            <Icon name="content_copy" className="text-xl" />
          </button>
        </div>
      </div>

      {/* Medals */}
      <div>
        <div className="flex items-center justify-between px-4 pb-2 pt-2">
          <h3 className="text-lg font-bold leading-tight tracking-tight">Suas Medalhas</h3>
          <button onClick={onSeeAllMedals} className="text-primary text-xs font-bold">Ver Tudo</button>
        </div>
        <div className="flex w-full overflow-x-auto px-4 py-3 hide-scrollbar">
          <div className="flex flex-row items-start justify-start gap-6">
            <MedalItem icon="emoji_events" label="7 Dias" color="text-yellow-500" from="from-yellow-300" to="to-orange-500" />
            <MedalItem icon="water_drop" label="Hidratado" color="text-blue-400" from="from-blue-300" to="to-indigo-500" />
            <MedalItem icon="fitness_center" label="Maratonista" color="text-slate-500" bg="bg-slate-700" inactive />
            <MedalItem icon="bolt" label="Elite" color="text-slate-500" bg="bg-slate-700" inactive />
          </div>
        </div>
      </div>

      {/* Hydration */}
      <div className="p-4">
        <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-surface-dark p-5 shadow-sm border border-slate-100 dark:border-white/5">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="opacity" className="text-blue-500 text-lg" />
                <p className="text-base font-bold leading-tight">Meta de Água</p>
              </div>
              <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal">{(waterAmount / 1000).toFixed(1)}L de {(waterGoal / 1000).toFixed(1)}L</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-4">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${waterPercentage}%` }}></div>
              </div>
              <button
                onClick={handleAddWater}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-blue-500/10 text-blue-500 gap-2 text-sm font-bold w-full active:scale-95 transition-transform"
              >
                <Icon name="add" className="text-lg" />
                <span className="truncate">Adicionar 250ml</span>
              </button>
            </div>
          </div>
          <div className="w-32 bg-center bg-no-repeat aspect-square bg-contain flex items-center justify-center bg-blue-500/5 rounded-xl border border-blue-500/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBShVvjEur9hZfcEE6wYioT09LPrsOSl7N4kMYfZOGpjisXXsOJWkoQN-KquVEh6Z6kW7EzGnxAj1VdQFX0WO4_LdheQOanQUtMbz4ltXicTH3_wLttf5-bYcCTwNHLzcSRajTLe9n9FTB04Jv2_p-iPuRTqwcrOBMmaiHp7JHg2eHqG0mmgSEgJWcr__IzSm9HOITmRZqGIbuDdp8VTGEZEJ9hoUpAD-_00MZbc6GGplzj-PGidcYxPD-goHcgklpXSCzAN7h81KlU")' }}></div>
        </div>
      </div>

      {/* Workout Card */}
      <div className="px-4 mt-2">
        <h3 className="text-lg font-bold leading-tight tracking-tight mb-4">Meu Treino</h3>
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xl font-bold">Ficha A: Iniciante</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">Pernas</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">Glúteos</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-primary font-bold text-lg">40%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Concluído</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-6">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <button onClick={onStartWorkout} className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 font-bold transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Icon name="play_arrow" className="mr-2" />
            INICIAR TREINO
          </button>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="px-4 mt-8 space-y-4">
        <MenuCard
          icon="home_health"
          title="Treino em Casa"
          subtitle="Exercícios para fazer onde estiver"
          buttonText="INICIAR"
          onClick={onStartWorkout}
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

      {/* Promo Card */}
      <div className="px-4 mt-8 mb-4">
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

      {/* Hydration Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl border border-primary/20 animate-in zoom-in-95 duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative size-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                <Icon name="emoji_events" className="text-white text-5xl animate-bounce" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mb-2">Meta Batida!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
              Parabéns! Você atingiu sua meta de hidratação diária de <span className="text-primary font-bold">3.0L</span>. Seu corpo agradece!
            </p>

            <button
              onClick={() => setShowGoalModal(false)}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              CONTINUAR
            </button>

            <div className="mt-4 flex items-center gap-1.5 opacity-50">
              <Icon name="stars" className="text-primary text-xs" fill />
              <p className="text-[10px] font-bold uppercase tracking-widest">+50 PONTOS GANHOS</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MedalItem = ({ icon, label, color, from, to, bg, inactive }: { icon: string; label: string; color: string; from?: string; to?: string; bg?: string; inactive?: boolean }) => (
  <div className={`flex flex-col items-center gap-2 w-16 text-center ${inactive ? 'grayscale-filter' : ''}`}>
    <div className={`w-16 h-16 ${bg ? bg : `bg-gradient-to-br ${from} ${to}`} p-0.5 rounded-full`}>
      <div className="w-full h-full bg-center bg-no-repeat aspect-square bg-cover rounded-full border-2 border-white/20 flex items-center justify-center bg-surface-dark">
        <Icon name={icon} className={`${color} text-3xl`} fill={!inactive} />
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