import React, { useState } from 'react';
import { Icon } from './Icon';
import { MaleWorkoutManagement } from './MaleWorkoutManagement';
import { FemaleWorkoutManagement } from './FemaleWorkoutManagement';
import { CouponWorkoutManagement } from './CouponWorkoutManagement';
import { CustomWorkoutManagement } from './CustomWorkoutManagement';
import { HomeWorkoutManagement } from './HomeWorkoutManagement';

interface WorkoutManagementProps {
  onBack: () => void;
  onLogout: () => void;
}

type WorkoutManagementView = 'selection' | 'male' | 'female' | 'coupon' | 'custom' | 'home';

export const WorkoutManagement: React.FC<WorkoutManagementProps> = ({ onBack, onLogout }) => {
  const [currentView, setCurrentView] = useState<WorkoutManagementView>('selection');

  if (currentView === 'male') {
    return <MaleWorkoutManagement onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'female') {
    return <FemaleWorkoutManagement onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'coupon') {
    return <CouponWorkoutManagement onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'custom') {
    return <CustomWorkoutManagement onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'home') {
    return <HomeWorkoutManagement onBack={() => setCurrentView('selection')} />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 w-full">
        <div className="flex items-center p-4 justify-between w-full px-6 md:px-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex size-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                <Icon name="fitness_center" />
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight uppercase italic">Gestão de Treinos</h2>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex size-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white transition-colors relative">
              <Icon name="notifications" className="text-2xl" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>
            <div className="h-10 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold uppercase leading-none">Administrador</p>
                <p className="text-[10px] text-slate-500 uppercase">Online</p>
              </div>
              <Icon name="account_circle" className="text-3xl" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 w-full relative">
        <div className="w-full max-w-5xl flex flex-col gap-10 items-center">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black dark:text-white uppercase tracking-tight italic">Seletor de Gestão</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Escolha o tipo de programa para gerenciar</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full">
            <ManagementCard 
              icon="male" 
              title="Treino Masculino" 
              subtitle="Programas Homens" 
              onClick={() => setCurrentView('male')}
            />
            <ManagementCard 
              icon="female" 
              title="Treino Feminino" 
              subtitle="Programas Mulheres" 
              onClick={() => setCurrentView('female')}
            />
            <ManagementCard 
              icon="home_work" 
              title="Treino em Casa" 
              subtitle="Home Fitness" 
              onClick={() => setCurrentView('home')}
            />
            <ManagementCard 
              icon="confirmation_number" 
              title="Treino Cupom" 
              subtitle="Ofertas Especiais" 
              onClick={() => setCurrentView('coupon')}
            />
            <ManagementCard 
              icon="manage_accounts" 
              title="Personalizado" 
              subtitle="Configurações VIP" 
              onClick={() => setCurrentView('custom')}
            />
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-slate-200 dark:border-white/5">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">© 2024 Fitness Platform • Gestão de Treinos</p>
      </footer>
    </div>
  );
};

interface ManagementCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const ManagementCard: React.FC<ManagementCardProps> = ({ icon, title, subtitle, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full aspect-square flex flex-col items-center justify-center gap-4 bg-card-dark hover:bg-[#333333] text-white rounded-[2rem] shadow-2xl transition-all active:scale-95 group border border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Icon name={icon} className="text-8xl text-primary" />
      </div>
      <div className="bg-primary/10 p-5 rounded-2xl group-hover:bg-primary transition-all duration-300 z-10">
        <Icon name={icon} className="text-4xl text-primary group-hover:text-white transition-colors" />
      </div>
      <div className="flex flex-col items-center z-10 px-4 text-center">
        <span className="text-base sm:text-xl font-black tracking-widest uppercase">{title}</span>
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{subtitle}</span>
      </div>
    </button>
  );
};