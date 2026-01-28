import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface WorkoutSelectionProps {
  onBack: () => void;
  onStart: (groups: string[]) => void;
}

interface MuscleGroup {
  id: string;
  label: string;
  icon: string;
  colSpan?: boolean;
}

const iconMap: Record<string, string> = {
  'Peito': 'fitness_center',
  'Costas': 'reorder',
  'Pernas': 'directions_walk',
  'Glúteos': 'accessibility_new',
  'Abdominais': 'grid_view',
  'Braços': 'sports_martial_arts',
  'Ombros': 'vertical_align_top',
};

export const WorkoutSelection: React.FC<WorkoutSelectionProps> = ({ onBack, onStart }) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMuscleGroups();
  }, []);

  const fetchMuscleGroups = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('assigned_plan_id, gender')
        .eq('id', session.user.id)
        .single();

      let planId = profile?.assigned_plan_id;

      // Gender fallback for default plan if no assigned plan
      if (!planId && profile?.gender) {
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

      let uniqueCategories: string[] = [];

      if (planId) {
        // Fetch categories from the specific plan
        const { data, error } = await supabase
          .from('workout_plan_exercises')
          .select('exercise:exercise_bank(category)')
          .eq('plan_id', planId);

        if (error) throw error;
        if (data) {
          uniqueCategories = [...new Set(data.map((item: any) => item.exercise?.category).filter(Boolean))];
        }
      }

      const formattedGroups: MuscleGroup[] = uniqueCategories.map(cat => ({
        id: cat,
        label: cat,
        icon: iconMap[cat] || 'fitness_center',
        colSpan: cat === 'Ombros'
      }));
      setMuscleGroups(formattedGroups);
    } catch (err) {
      console.error('Error fetching muscle groups:', err);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-400">Buscando grupos...</p>
          </div>
        ) : muscleGroups.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {muscleGroups.map((group) => {
              const isSelected = selectedGroups.includes(group.id);
              return (
                <button
                  key={group.id}
                  onClick={() => toggleGroup(group.id)}
                  className={`flex flex-col items-center justify-center p-6 bg-card-dark rounded-2xl border-2 transition-all ${isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-white/10'
                    } ${group.colSpan ? 'col-span-2' : ''}`}
                >
                  <div className={`size-12 rounded-full flex items-center justify-center mb-3 ${isSelected ? 'bg-primary/10' : 'bg-white/5'
                    }`}>
                    <Icon
                      name={group.icon}
                      className={`text-3xl ${isSelected ? 'text-primary' : 'text-slate-400'}`}
                    />
                  </div>
                  <span className="font-bold text-white text-center text-sm">{group.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Icon name="event_busy" className="text-slate-500 text-4xl" />
            </div>
            <p className="text-slate-400 font-medium max-w-[250px]">
              Você ainda não tem um plano de treino cadastrado.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-6 py-4 bg-background-dark/90 backdrop-blur-xl border-t border-white/5">
          <button
            onClick={() => onStart(selectedGroups)}
            disabled={selectedGroups.length === 0}
            className={`w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-black text-base tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-primary/25 ${selectedGroups.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
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