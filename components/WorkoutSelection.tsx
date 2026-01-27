import React, { useState } from 'react';
import { Icon } from './Icon';

interface WorkoutSelectionProps {
  onBack: () => void;
  onStart: () => void;
}

interface MuscleGroup {
  id: string;
  label: string;
  icon: string;
  colSpan?: boolean;
}

const muscleGroups: MuscleGroup[] = [
  { id: 'chest', label: 'Peito', icon: 'fitness_center' },
  { id: 'back', label: 'Costas', icon: 'reorder' },
  { id: 'legs', label: 'Pernas', icon: 'directions_walk' },
  { id: 'glutes', label: 'Glúteos', icon: 'accessibility_new' },
  { id: 'abs', label: 'Abdominais', icon: 'grid_view' },
  { id: 'arms', label: 'Braços', icon: 'sports_martial_arts' },
  { id: 'shoulders', label: 'Ombros', icon: 'vertical_align_top', colSpan: true },
];

export const WorkoutSelection: React.FC<WorkoutSelectionProps> = ({ onBack, onStart }) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['chest', 'legs']);

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-background-dark min-h-screen pb-40 text-white">
      <div className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2">
          <button 
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-dark"
          >
            <Icon name="chevron_left" className="text-white" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center mr-10">Novo Treino</h2>
        </div>
      </div>

      <div className="px-6 pt-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Selecione os Grupos</h1>
        <p className="text-slate-400 mt-1 text-sm">Etapa de personalização</p>
      </div>

      <div className="px-6 mt-8">
        <div className="grid grid-cols-2 gap-4">
          {muscleGroups.map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            return (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                className={`flex flex-col items-center justify-center p-6 bg-card-dark rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-transparent hover:border-white/10'
                } ${group.colSpan ? 'col-span-2' : ''}`}
              >
                <div className={`size-12 rounded-full flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-primary/10' : 'bg-white/5'
                }`}>
                  <Icon 
                    name={group.icon} 
                    className={`text-3xl ${isSelected ? 'text-primary' : 'text-slate-400'}`} 
                  />
                </div>
                <span className="font-bold text-white">{group.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-6 py-4 bg-background-dark/90 backdrop-blur-xl border-t border-white/5">
          <button 
            onClick={onStart}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-black text-base tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-primary/25"
          >
            INICIAR TREINO
          </button>
        </div>
        <div className="bg-background-dark border-t border-white/5 pb-8 pt-2">
          <div className="flex items-center justify-around px-2">
            <button 
                onClick={onBack}
                className="flex flex-col items-center gap-1 flex-1 text-primary"
            >
              <Icon name="home" fill />
              <span className="text-[10px] font-bold">Início</span>
            </button>
            <button className="flex flex-col items-center gap-1 flex-1 text-slate-500">
              <Icon name="calendar_month" />
              <span className="text-[10px] font-medium">Agenda</span>
            </button>
            <button className="flex flex-col items-center gap-1 flex-1 text-slate-500">
              <Icon name="groups" />
              <span className="text-[10px] font-medium">Comunidade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};