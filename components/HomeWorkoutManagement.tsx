import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  category: string;
}

interface WorkoutExercise {
  id?: string;
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
}

interface HomeWorkoutManagementProps {
  onBack: () => void;
}

export const HomeWorkoutManagement: React.FC<HomeWorkoutManagementProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('15-20');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  React.useEffect(() => {
    fetchPlanAndExercises();
  }, []);

  const fetchPlanAndExercises = async () => {
    setLoading(true);
    try {
      const { data: planData, error: planError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('category', 'Casa')
        .eq('type', 'default')
        .single();

      if (planError) throw planError;
      setPlanId(planData.id);

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_plan_exercises')
        .select(`
          id,
          exercise_id,
          sets,
          reps,
          exercise:exercise_bank(id, name, category)
        `)
        .eq('plan_id', planData.id)
        .order('order_index', { ascending: true });

      if (exercisesError) throw exercisesError;
      setWorkoutExercises(exercisesData as any);
    } catch (error) {
      console.error('Error fetching home workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('exercise_bank')
      .select('*')
      .ilike('name', `%${val}%`)
      .limit(5);

    if (data) setSearchResults(data);
  };

  const addExercise = () => {
    if (!selectedExercise) return;
    const newEx: WorkoutExercise = {
      exercise_id: selectedExercise.id,
      exercise: selectedExercise,
      sets,
      reps
    };
    setWorkoutExercises([...workoutExercises, newEx]);
    setSelectedExercise(null);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeExercise = (index: number) => {
    const nl = [...workoutExercises];
    nl.splice(index, 1);
    setWorkoutExercises(nl);
  };

  const saveWorkout = async () => {
    if (!planId) return;
    setLoading(true);
    try {
      await supabase.from('workout_plan_exercises').delete().eq('plan_id', planId);
      const inserts = workoutExercises.map((we, index) => ({
        plan_id: planId,
        exercise_id: we.exercise_id,
        sets: we.sets,
        reps: we.reps,
        order_index: index
      }));
      const { error } = await supabase.from('workout_plan_exercises').insert(inserts);
      if (error) throw error;
      alert('Treino em casa atualizado!');
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-40 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto">
          <button
            onClick={onBack}
            className="text-gray-900 dark:text-white flex size-10 items-center justify-start hover:opacity-70 transition-opacity"
          >
            <Icon name="arrow_back_ios" />
          </button>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Gestão de Treino em Casa
          </h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Seleção de Exercícios</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Busque exercícios para fazer em casa.</p>
        </div>

        <section className="px-4 py-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-5 border border-gray-200 dark:border-white/5">
            <div className="relative">
              <label className="block mb-2">
                <span className="text-gray-700 dark:text-white text-sm font-semibold uppercase">Buscar no banco de dados</span>
                <div className="relative mt-1">
                  <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3]"
                    placeholder="Ex: Flexão, Agachamento..."
                    type="text"
                  />
                </div>
              </label>

              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-white/10 overflow-hidden">
                  {searchResults.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setSelectedExercise(ex);
                        setSearchTerm(ex.name);
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 text-sm flex items-center justify-between"
                    >
                      <span className="font-bold">{ex.name}</span>
                      <span className="text-[10px] text-primary uppercase font-black">{ex.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedExercise && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3 animate-fade-in">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <Icon name="home_work" className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 dark:text-white font-bold text-sm">{selectedExercise.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-white uppercase inline-block mt-0.5 tracking-wider">{selectedExercise.category}</span>
                </div>
                <button onClick={() => setSelectedExercise(null)} className="text-slate-400">
                  <Icon name="close" />
                </button>
              </div>
            )}

            <div className="flex gap-4">
              <label className="flex-1">
                <span className="text-gray-700 dark:text-white text-sm font-semibold">Séries</span>
                <input
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                  placeholder="3"
                  type="number"
                />
              </label>
              <label className="flex-1">
                <span className="text-gray-700 dark:text-white text-sm font-semibold">Repetições</span>
                <input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                  placeholder="15-20"
                  type="text"
                />
              </label>
            </div>

            <button
              onClick={addExercise}
              disabled={!selectedExercise}
              className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wider mt-2 disabled:opacity-50"
            >
              ADICIONAR EXERCÍCIO
            </button>
          </div>
        </section>

        <section className="mt-6 px-4 pb-10 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold">Exercícios Cadastrados</h3>
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 dark:bg-surface-dark text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">{workoutExercises.length} Exercícios</span>
            </div>
          </div>

          <div className="space-y-3">
            {loading && workoutExercises.length === 0 ? (
              <div className="py-10 text-center uppercase text-[10px] font-black tracking-widest text-slate-500 animate-pulse">Carregando...</div>
            ) : workoutExercises.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest text-slate-500 italic">Vazio</div>
            ) : (
              workoutExercises.map((we, index) => (
                <WorkoutListItem
                  key={index}
                  title={we.exercise.name}
                  category={we.exercise.category}
                  reps={`${we.sets}x ${we.reps} reps`}
                  onRemove={() => removeExercise(index)}
                />
              ))
            )}
          </div>

          <div className="mt-12 mb-8">
            <button
              onClick={saveWorkout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-xl shadow-xl shadow-primary/30 transition-all active:scale-[0.97] uppercase tracking-widest text-lg border-2 border-primary disabled:opacity-50"
            >
              {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            </button>
            <p className="text-center text-gray-500 text-[10px] mt-3 uppercase font-bold tracking-tighter opacity-50">Confirme para atualizar a planilha de treino em casa</p>
          </div>
        </section>
      </main>
    </div>
  );
};

const WorkoutListItem: React.FC<{ title: string; category: string; reps: string; onRemove: () => void }> = ({ title, category, reps, onRemove }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-200 dark:border-white/5">
    <div className="w-16 h-16 bg-gray-100 dark:bg-[#3a272c] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/10">
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Icon name="play_circle" className="text-primary/40" />
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-gray-900 dark:text-white font-bold text-base">{title}</h4>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">{category}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{reps}</span>
      </div>
    </div>
    <button
      onClick={onRemove}
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <Icon name="delete_outline" />
    </button>
  </div>
);