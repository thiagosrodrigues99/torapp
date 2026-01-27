import React from 'react';
import { Icon } from './Icon';

interface PromoCardProps {
  onStartChallenge?: () => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({ onStartChallenge }) => {
  return (
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
        <button 
          onClick={onStartChallenge}
          className="flex items-center justify-center w-full bg-white text-primary rounded-lg h-12 font-bold transition-all active:scale-95 shadow-lg"
        >
          <Icon name="bolt" className="mr-2" />
          INICIAR DESAFIO
        </button>
      </div>
    </div>
  );
};