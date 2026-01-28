import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  category: string;
  gif_url?: string;
  thumbnail_url?: string;
  video_url?: string;
}

interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
}

interface WorkoutExecutionProps {
  onBack: () => void;
  onFinish: () => void;
  selectedGroups?: string[];
}

export const WorkoutExecution: React.FC<WorkoutExecutionProps> = ({ onBack, onFinish, selectedGroups }) => {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedSets, setCompletedSets] = useState<boolean[]>([]);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  useEffect(() => {
    fetchWorkoutExercises();
  }, []);

  useEffect(() => {
    if (exercises[currentIndex]) {
      setCompletedSets(new Array(exercises[currentIndex].sets).fill(false));
    }
  }, [currentIndex, exercises]);

  const fetchWorkoutExercises = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('assigned_plan_id, gender')
        .eq('id', session.user.id)
        .single();

      let planId = profile?.assigned_plan_id;

      // Gender fallback
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

      if (planId) {
        console.log('DEBUG: Plan ID:', planId);
        let query = supabase
          .from('workout_plan_exercises')
          .select(`
            id,
            sets,
            reps,
            exercise:exercise_bank!inner(*)
          `)
          .eq('plan_id', planId);

        if (selectedGroups && selectedGroups.length > 0) {
          console.log('DEBUG: Selected groups:', selectedGroups);
          query = query.in('exercise_bank.category', selectedGroups);
        }

        const { data, error } = await query.order('order_index', { ascending: true });

        if (error) {
          console.error('DEBUG: Query error:', error);
          throw error;
        }

        console.log('DEBUG: Raw data from Supabase:', data);

        // Formatar para garantir que o exercício seja um objeto e as propriedades existam
        const formattedExercises = (data as any[] || []).map(item => {
          const exerciseData = Array.isArray(item.exercise) ? item.exercise[0] : item.exercise;
          return {
            ...item,
            exercise: exerciseData || { name: 'Exercício sem dados', category: 'N/A' }
          };
        });

        console.log('DEBUG: Formatted exercises:', formattedExercises);
        setExercises(formattedExercises);
      }
    } catch (err) {
      console.error('Error fetching workout:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = exercises[currentIndex];
  const totalExercises = exercises.length;
  const exercisesProgress = totalExercises > 0 ? Math.round((completedExercises.length / totalExercises) * 100) : 0;

  const toggleSet = (index: number) => {
    const newSets = [...completedSets];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);
  };

  const handleNext = () => {
    if (!completedExercises.includes(currentIndex)) {
      setCompletedExercises([...completedExercises, currentIndex]);
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinish();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-r-transparent"></div>
          <Icon name="fitness_center" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-xl" />
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-8 text-center">
        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Icon name="sentiment_dissatisfied" className="text-primary text-5xl" />
        </div>
        <h2 className="text-slate-900 dark:text-white text-2xl font-black uppercase italic mb-2 tracking-tight">Nenhum Treino</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs font-medium">Você ainda não tem exercícios cadastrados no seu plano atual.</p>
        <button onClick={onBack} className="w-full max-w-xs bg-primary text-white h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30">VOLTAR</button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display pb-32">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center p-4 justify-between h-16">
          <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
            <Icon name="arrow_back_ios_new" className="text-xl" />
          </button>
          <div className="flex flex-col items-center text-center px-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic leading-none mb-1">Execução</h2>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none truncate max-w-[200px]">
              {currentExercise?.exercise?.category}
            </p>
          </div>
          <div className="size-10 flex items-center justify-center">
            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md">{currentIndex + 1}/{totalExercises}</span>
          </div>
        </div>

        {/* Improved Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{completedExercises.length} de {totalExercises} concluídos</p>
            <p className="text-[10px] font-black uppercase text-primary italic">{exercisesProgress}%</p>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${exercisesProgress}%` }}></div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Janela de Mídia - GIF/Vídeo */}
        <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-2xl flex items-center justify-center">
          {(currentExercise?.exercise?.gif_url || currentExercise?.exercise?.thumbnail_url) ? (
            (() => {
              const mediaUrl = currentExercise.exercise.gif_url || currentExercise.exercise.thumbnail_url || '';
              if (mediaUrl.toLowerCase().match(/\.(mp4|webm|ogg)$/)) {
                return (
                  <video
                    key={mediaUrl}
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                );
              }
              return (
                <div
                  key={mediaUrl}
                  className="w-full h-full bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url("${mediaUrl}")` }}
                  role="img"
                  aria-label={currentExercise.exercise.name}
                />
              );
            })()
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-slate-300 dark:text-slate-700">
              <Icon name="play_circle" className="text-7xl" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Mídia não disponível</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-white text-2xl font-black uppercase italic tracking-tight leading-tight mb-1 drop-shadow-md">
              {currentExercise?.exercise?.name || 'Carregando...'}
            </h1>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1.5 text-white/80">
                <Icon name="repeat" className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-widest">{currentExercise?.sets || 0} Séries</span>
              </div>
              <div className="w-px h-3 bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-white/80">
                <Icon name="history" className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-widest">{currentExercise?.reps || '0'} Reps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Set Tracker */}
        <div className="mt-8 mb-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] dark:text-white/50">Marcar Séries</h3>
            <p className="text-[10px] font-bold text-primary uppercase">{completedSets.filter(s => s).length} de {currentExercise.sets} feitas</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {completedSets.map((done, idx) => (
              <button
                key={idx}
                onClick={() => toggleSet(idx)}
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all duration-300 ${done
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 active:scale-95'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 active:scale-95'
                  }`}
              >
                <span className={`text-lg font-black italic ${done ? 'text-white' : 'text-slate-400'}`}>{idx + 1}</span>
                {done && <Icon name="check" className="text-xs mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial Card */}
        <div className="mt-4 bg-slate-100 dark:bg-surface-dark/40 rounded-[1.5rem] p-5 border border-slate-200 dark:border-white/5">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Icon name="lightbulb" className="text-primary text-xl" fill />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1.5 italic">Dica Pro</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Realize o movimento de forma controlada. Expire no esforço e mantenha o abdômen contraído em todas as repetições.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent pointer-events-none"></div>
        <div className="relative max-w-lg mx-auto flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 active:scale-95 transition-all"
          >
            <Icon name="stop_circle" className="text-slate-400 mr-2" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Pausar</span>
          </button>
          <button
            onClick={handleNext}
            className="flex-[2] h-16 flex items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/40 active:scale-95 transition-all text-white font-black"
          >
            <span className="uppercase tracking-[0.2em] text-sm mr-2 italic">
              {currentIndex === exercises.length - 1 ? 'Finalizar' : 'Próximo'}
            </span>
            <Icon name={currentIndex === exercises.length - 1 ? 'check_circle' : 'arrow_forward'} className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
