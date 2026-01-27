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

interface FemaleWorkoutManagementProps {
  onBack: () => void;
}

export const FemaleWorkoutManagement: React.FC<FemaleWorkoutManagementProps> = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState('12-15');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const [muscleFilter, setMuscleFilter] = useState('all');

  React.useEffect(() => {
    fetchPlanAndExercises();
  }, []);

  const fetchPlanAndExercises = async () => {
    setLoading(true);
    try {
      const { data: planData, error: planError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('category', 'Feminino')
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
      console.error('Error fetching female workout data:', error);
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

  const addExerciseToList = () => {
    if (!selectedExercise) return;
    const newEntry: WorkoutExercise = {
      exercise_id: selectedExercise.id,
      exercise: selectedExercise,
      sets,
      reps
    };
    setWorkoutExercises([...workoutExercises, newEntry]);
    setSelectedExercise(null);
    setSearchTerm('');
    setSearchResults([]);
  };

  const createNewExerciseInBank = async () => {
    if (!newExerciseName || !newExerciseCategory) return;
    try {
      const { data, error } = await supabase
        .from('exercise_bank')
        .insert([{ name: newExerciseName, category: newExerciseCategory }])
        .select()
        .single();

      if (error) throw error;
      setSelectedExercise(data);
      setSearchTerm(data.name);
      setIsModalOpen(false);
      setNewExerciseName('');
      setNewExerciseCategory('');
    } catch (error: any) {
      alert('Erro ao criar exercício: ' + error.message);
    }
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
      alert('Treino feminino atualizado!');
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeExercise = (index: number) => {
    const nl = [...workoutExercises];
    nl.splice(index, 1);
    setWorkoutExercises(nl);
  };

  const filteredExercises = muscleFilter === 'all'
    ? workoutExercises
    : workoutExercises.filter(we => we.exercise.category.toLowerCase() === muscleFilter.toLowerCase());

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display relative">
      <header className="sticky top-0 z-40 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto">
          <button
            onClick={onBack}
            className="text-gray-900 dark:text-white flex size-10 items-center justify-start hover:opacity-70 transition-opacity"
          >
            <Icon name="arrow_back_ios" />
          </button>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Gestão de Treino Feminino
          </h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Adicionar Novo Exercício</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Busque exercícios no banco de dados para adicionar à planilha.</p>
        </div>

        <section className="px-4 py-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-5 border border-gray-200 dark:border-white/5">
            <div>
              <label className="block mb-2">
                <span className="text-gray-700 dark:text-white text-sm font-semibold uppercase tracking-wider">Buscar no Banco de Dados</span>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3] font-bold"
                      placeholder="EX: AGACHAMENTO SUMÔ..."
                      type="text"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-white/10 overflow-hidden">
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
                            <span className="font-bold text-slate-900 dark:text-white">{ex.name}</span>
                            <span className="text-[10px] text-primary uppercase font-black">{ex.category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20"
                    title="Novo Exercício"
                  >
                    <Icon name="add" className="text-2xl" />
                  </button>
                </div>
              </label>
            </div>

            {selectedExercise && (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 flex items-center justify-between animate-fade-in">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Selecionado</p>
                  <h4 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{selectedExercise.name}</h4>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{selectedExercise.category}</span>
                </div>
                <Icon name="check_circle" className="text-green-500" />
              </div>
            )}

            <div className="flex gap-4">
              <label className="flex-1">
                <span className="text-gray-700 dark:text-white text-sm font-semibold">Séries</span>
                <input
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                  placeholder="4"
                  type="number"
                />
              </label>
              <label className="flex-1">
                <span className="text-gray-700 dark:text-white text-sm font-semibold">Repetições</span>
                <input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50"
                  placeholder="12-15"
                  type="text"
                />
              </label>
            </div>

            <button
              onClick={addExerciseToList}
              disabled={!selectedExercise}
              className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wider mt-4 disabled:opacity-50 disabled:grayscale"
            >
              Adicionar Exercício
            </button>
          </div>
        </section>

        <section className="mt-6 px-4 pb-10 flex-1">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold">Exercícios Cadastrados</h3>
              <span className="bg-gray-200 dark:bg-surface-dark text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium border border-gray-300 dark:border-white/10">3 Exercícios</span>
            </div>
            <div className="relative">
              <select
                value={muscleFilter}
                onChange={(e) => setMuscleFilter(e.target.value)}
                className="appearance-none w-full rounded-lg border-none bg-white dark:bg-surface-dark text-gray-900 dark:text-[#f0f0f0] h-10 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/50 shadow-sm border border-gray-200 dark:border-white/10 pr-10"
              >
                <option value="all">Todos os grupos musculares</option>
                <option value="gluteos">Glúteos</option>
                <option value="posteriores">Posteriores</option>
                <option value="quadriceps">Quadríceps</option>
                <option value="peitoral">Peitoral</option>
                <option value="costas">Costas</option>
                <option value="membros superiores">Membros Superiores</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Icon name="expand_more" />
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {loading && workoutExercises.length === 0 ? (
              <div className="py-10 text-center uppercase text-[10px] font-black tracking-widest text-slate-500 animate-pulse">Carregando Planilha...</div>
            ) : filteredExercises.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest text-slate-500 italic">Vazio</div>
            ) : (
              filteredExercises.map((we, index) => (
                <RegisteredWorkoutItem
                  key={index}
                  title={we.exercise.name}
                  category={we.exercise.category}
                  reps={`${we.sets}x ${we.reps} reps`}
                  onRemove={() => removeExercise(index)}
                />
              ))
            )}
          </div>

          <div className="sticky bottom-4 pt-4">
            <button
              onClick={saveWorkout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/40 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-lg disabled:opacity-50"
            >
              {loading ? 'SALVANDO...' : 'Salvar Alterações'}
            </button>
          </div>
        </section>
      </main>

      {/* Modal cadastrar novo músculo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/10 overflow-hidden">
            <h3 className="text-white text-xl font-bold mb-4">Cadastrar Novo Exercício</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">
                  <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Nome do Exercício</span>
                  <input
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-none bg-[#3a272c] text-white h-12 px-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-500"
                    placeholder="Ex: Stiff com Halteres"
                    type="text"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Grupo Muscular</span>
                  <input
                    value={newExerciseCategory}
                    onChange={(e) => setNewExerciseCategory(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-none bg-[#3a272c] text-white h-12 px-4 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-500"
                    placeholder="Ex: Posteriores"
                    type="text"
                  />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg text-center cursor-pointer transition-colors uppercase text-sm"
                >
                  CANCELAR
                </button>
                <button
                  onClick={createNewExerciseInBank}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm"
                  type="button"
                >
                  SALVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RegisteredWorkoutItem: React.FC<{ title: string; category: string; reps: string; onRemove: () => void }> = ({ title, category, reps, onRemove }) => (
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
      className="text-gray-400 hover:text-red-500 transition-colors p-2"
    >
      <Icon name="delete_outline" />
    </button>
  </div>
);
