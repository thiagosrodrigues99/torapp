import React, { useState } from 'react';
import { Icon } from './Icon';
import { WorkoutManagement } from './WorkoutManagement';
import { IntegrationsManagement } from './IntegrationsManagement';
import { UserManagement } from './UserManagement';
import { InfluencersManagement } from './InfluencersManagement';
import { RecipesManagement } from './RecipesManagement';
import { ExerciseBank } from './ExerciseBank';
import { FinanceManagement } from './FinanceManagement';
import { MedalsManagement } from './MedalsManagement';
import { CheckoutManagement } from './CheckoutManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = 'main' | 'workout-management' | 'users' | 'finance' | 'integrations' | 'influencers' | 'recipes' | 'exercises' | 'medals' | 'checkout';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [view, setView] = useState<AdminView>('main');

  if (view === 'workout-management') {
    return <WorkoutManagement onBack={() => setView('main')} onLogout={onLogout} />;
  }

  if (view === 'integrations') {
    return <IntegrationsManagement onBack={() => setView('main')} onLogout={onLogout} />;
  }

  if (view === 'users') {
    return <UserManagement onBack={() => setView('main')} />;
  }

  if (view === 'influencers') {
    return <InfluencersManagement onBack={() => setView('main')} />;
  }

  if (view === 'recipes') {
    return <RecipesManagement onBack={() => setView('main')} />;
  }

  if (view === 'exercises') {
    return <ExerciseBank onBack={() => setView('main')} />;
  }

  if (view === 'finance') {
    return <FinanceManagement onBack={() => setView('main')} />;
  }

  if (view === 'medals') {
    return <MedalsManagement onBack={() => setView('main')} />;
  }

  if (view === 'checkout') {
    return <CheckoutManagement onBack={() => setView('main')} />;
  }

  // Fallback for other unimplemented views
  if (view !== 'main') {
    return (
      <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center text-white font-display p-6">
        <h1 className="text-3xl font-black uppercase italic mb-4">Módulo em Desenvolvimento</h1>
        <p className="text-slate-400 mb-8">O módulo de {view} está sendo preparado.</p>
        <button
          onClick={() => setView('main')}
          className="bg-primary px-8 py-3 rounded-xl font-bold active:scale-95 transition-all"
        >
          VOLTAR AO PAINEL
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 w-full">
        <div className="flex items-center p-4 justify-between w-full px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Icon name="fitness_center" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight uppercase italic">Fitness Admin</h2>
          </div>
          <div className="flex gap-4">
            <button className="flex size-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white transition-colors relative">
              <Icon name="notifications" className="text-2xl" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>
            <div className="h-10 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>
            <button
              onClick={onLogout}
              className="flex size-10 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all active:scale-95"
              title="Sair"
            >
              <Icon name="logout" className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 w-full relative">
        <div className="w-full max-w-6xl flex flex-col gap-12 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            <DashboardCard
              icon="group"
              title="Usuários"
              subtitle="Gestão de Alunos"
              onClick={() => setView('users')}
            />
            <DashboardCard
              icon="payments"
              title="Financeiro"
              subtitle="Controle de Caixa"
              onClick={() => setView('finance')}
            />
            <DashboardCard
              icon="hub"
              title="Integrações"
              subtitle="Conexões Externas"
              onClick={() => setView('integrations')}
            />
            <DashboardCard
              icon="campaign"
              title="Influenciadores"
              subtitle="Marketing & Parcerias"
              onClick={() => setView('influencers')}
            />
            <DashboardCard
              icon="fitness_center"
              title="Gestão de Treinos"
              subtitle="Planilhas e Rotinas"
              onClick={() => setView('workout-management')}
            />
            <DashboardCard
              icon="restaurant"
              title="Gestão de Receitas"
              subtitle="Nutrição e Dietas"
              onClick={() => setView('recipes')}
            />
            <DashboardCard
              icon="exercise"
              title="Exercícios"
              subtitle="Banco de Movimentos"
              onClick={() => setView('exercises')}
            />
            <DashboardCard
              icon="military_tech"
              title="Gestão de Medalhas"
              subtitle="Gamificação e Conquistas"
              onClick={() => setView('medals')}
            />
            <DashboardCard
              icon="shopping_basket"
              title="Checkout"
              subtitle="Oferta & Planos"
              onClick={() => setView('checkout')}
            />
          </div>

          <div className="mt-4 space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-4xl font-black dark:text-white uppercase tracking-tight italic">Painel Administrativo</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-md mx-auto leading-relaxed">
                Selecione um módulo acima para gerenciar os dados da sua plataforma fitness em tempo real.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                onLogout();
              }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 text-sm font-bold transition-all active:scale-95 uppercase tracking-widest cursor-pointer z-10"
            >
              <Icon name="logout" />
              Sair da conta admin
            </button>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-slate-200 dark:border-white/5">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">© 2026 Fitness Platform • Gestão de Dados</p>
      </footer>
    </div>
  );
};

interface DashboardCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-video sm:aspect-square flex flex-col items-center justify-center gap-4 bg-card-dark hover:bg-[#333333] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 group border border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Icon name={icon} className="text-9xl text-primary" />
      </div>
      <div className="bg-primary/10 p-6 rounded-2xl group-hover:bg-primary transition-all duration-300 z-10">
        <Icon name={icon} className="text-5xl text-primary group-hover:text-white transition-colors" />
      </div>
      <div className="flex flex-col items-center z-10 text-center px-4">
        <span className="text-xl font-black tracking-widest uppercase">{title}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">{subtitle}</span>
      </div>
    </button>
  );
};