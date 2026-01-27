import React from 'react';
import { Icon } from './Icon';

interface MenuCardProps {
  icon: string;
  title: string;
  subtitle: string;
  actionText: string;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<MenuCardProps> = ({ icon, title, subtitle, actionText, onClick, className = "" }) => (
  <div className={`px-4 ${className}`}>
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
      <button 
        onClick={onClick}
        className="bg-primary hover:bg-primary/90 text-white px-5 rounded-lg h-10 text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/40 uppercase"
      >
        {actionText}
      </button>
    </div>
  </div>
);

interface MenuCardsProps {
  onRunClick: () => void;
  onPersonalTrainerClick: () => void;
  onRecipesClick: () => void;
}

export const MenuCards: React.FC<MenuCardsProps> = ({ onRunClick, onPersonalTrainerClick, onRecipesClick }) => {
  return (
    <>
      <Card 
        className="mt-8"
        icon="directions_run"
        title="Corrida / Caminhada"
        subtitle="Monitore seu percurso"
        actionText="INICIAR"
        onClick={onRunClick}
      />
      <Card 
        className="mt-4"
        icon="restaurant"
        title="Alimentação"
        subtitle="Receitas e dietas saudáveis"
        actionText="Ver Receitas"
        onClick={onRecipesClick}
      />
      <Card 
        className="mt-4"
        icon="support_agent"
        title="Personal Trainer"
        subtitle="Fale com um especialista"
        actionText="WhatsApp"
        onClick={onPersonalTrainerClick}
      />
    </>
  );
};