import React, { useState, useEffect, useRef } from 'react';
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
  planId?: string;
}

export const WorkoutExecution: React.FC<WorkoutExecutionProps> = ({ onBack, onFinish, selectedGroups, planId }) => {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedSets, setCompletedSets] = useState<boolean[]>([]);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      let activePlanId = planId;

      if (!activePlanId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('assigned_plan_id, gender')
          .eq('id', session.user.id)
          .single();

        activePlanId = profile?.assigned_plan_id || '';

        // Gender fallback
        if (!activePlanId && profile?.gender) {
          const category = profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1);
          const { data: defaultPlan } = await supabase
            .from('workout_plans')
            .select('id')
            .eq('category', category)
            .eq('type', 'default')
            .maybeSingle();

          if (defaultPlan) {
            activePlanId = defaultPlan.id;
          }
        }
      }

      if (activePlanId) {
        console.log('DEBUG: Plan ID:', activePlanId);
        let query = supabase
          .from('workout_plan_exercises')
          .select(`
            id,
            sets,
            reps,
            exercise:exercise_bank!inner(*)
          `)
          .eq('plan_id', activePlanId);

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
    const wasDone = newSets[index];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);

    // If it was just completed, start rest timer
    if (!wasDone) {
      startRestTimer();
    }
  };

  const startRestTimer = () => {
    setShowRestTimer(true);
    setTimeLeft(45);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setShowRestTimer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    setShowRestTimer(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNext = () => {
    stopRestTimer();
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

      <main className="flex-1 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
        {/* Janela de Mídia Premium */}
        <div className="relative w-full aspect-square sm:aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,10,126,0.1)] flex items-center justify-center">
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
                    className="w-full h-full object-cover"
                  />
                );
              }
              return (
                <div
                  key={mediaUrl}
                  className="w-full h-full bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url("${mediaUrl}")` }}
                  role="img"
                  aria-label={currentExercise.exercise.name}
                />
              );
            })()
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-slate-300 dark:text-slate-700">
              <Icon name="play_circle" className="text-7xl" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Visualização Indisponível</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/20 backdrop-blur-md text-primary text-[8px] font-black px-2 py-0.5 rounded border border-primary/30 uppercase tracking-widest">{currentExercise?.exercise?.category}</span>
            </div>
            <h1 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-tight drop-shadow-2xl">
              {currentExercise?.exercise?.name || 'Carregando...'}
            </h1>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-3xl flex items-center gap-4">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="repeat" className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Séries</span>
              <span className="text-lg font-black italic leading-none">{currentExercise?.sets || 0}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-3xl flex items-center gap-4">
            <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Icon name="history" className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Reps</span>
              <span className="text-lg font-black italic leading-none">{currentExercise?.reps || '0'}</span>
            </div>
          </div>
        </div>

        {/* Set Tracker - Enhanced for Mobile */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Controle de Séries</h3>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
              <p className="text-[9px] font-black text-primary uppercase">{completedSets.filter(s => s).length}/{currentExercise.sets} Concluídas</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {completedSets.map((done, idx) => (
              <button
                key={idx}
                onClick={() => toggleSet(idx)}
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${done
                  ? 'bg-primary border-primary text-white shadow-[0_10px_20px_rgba(255,10,126,0.3)] scale-100 active:scale-90'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 scale-100 active:scale-95'
                  }`}
              >
                <span className={`text-base font-black italic relative z-10 ${done ? 'text-white' : 'text-slate-400'}`}>{idx + 1}</span>
                {done && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Icon name="check" className="text-4xl" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Rest Timer Overlay */}
        {showRestTimer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-surface-dark w-full max-w-xs rounded-[3rem] p-8 border border-white/10 shadow-3xl text-center relative overflow-hidden">
              <div className="absolute -top-24 -left-24 size-48 bg-primary/20 blur-[60px] rounded-full"></div>

              <div className="relative z-10">
                <div className="size-24 rounded-full border-4 border-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                    style={{ animationDuration: '3s' }}
                  ></div>
                  <Icon name="timer" className="text-4xl text-primary animate-pulse" />
                </div>

                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Hora do Descanso</h4>
                <div className="text-6xl font-black italic text-white mb-8 tabular-nums">
                  {timeLeft}<span className="text-2xl text-primary ml-1">s</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setTimeLeft(prev => prev + 15)}
                    className="h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    +15 Segundos
                  </button>
                  <button
                    onClick={stopRestTimer}
                    className="h-14 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Pular Descanso
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-amber-500/5 rounded-3xl p-6 border border-amber-500/10">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-500">
              <Icon name="tips_and_updates" className="text-2xl" fill />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2 italic">Atenção à Técnica</h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                Foque na cadência do movimento. 2 segundos para descer, uma breve pausa e 1 segundo para subir de forma explosiva.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Bottom Action Bar */}
      <div className="fixed bottom-10 left-0 right-0 px-6 z-50">
        <div className="relative max-w-lg mx-auto flex gap-4">
          <button
            onClick={onBack}
            className="size-16 flex items-center justify-center rounded-2xl bg-surface-dark/80 backdrop-blur-xl border border-white/10 active:scale-95 transition-all shadow-xl"
          >
            <Icon name="close" className="text-slate-400 text-2xl" />
          </button>
          <button
            onClick={handleNext}
            className="flex-1 h-16 flex items-center justify-center rounded-3xl bg-primary shadow-[0_15px_30px_rgba(255,10,126,0.3)] active:scale-[0.98] transition-all text-white font-black group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 uppercase tracking-[0.2em] text-sm mr-2 italic">
              {currentIndex === exercises.length - 1 ? 'Finalizar Treino' : 'Próximo Exercício'}
            </span>
            <Icon name={currentIndex === exercises.length - 1 ? 'sports_score' : 'arrow_forward'} className="relative z-10 text-2xl group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
