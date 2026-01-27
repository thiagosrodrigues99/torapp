import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  category: string;
}

interface UserProfile {
  id: string;
  full_name: string;
}

interface WorkoutExercise {
  id?: string;
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
}

interface CustomWorkoutManagementProps {
  onBack: () => void;
}

export const CustomWorkoutManagement: React.FC<CustomWorkoutManagementProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState('12-15');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [vips, setVips] = useState<UserProfile[]>([]);
  const [selectedVipId, setSelectedVipId] = useState<string>('');
  const [planId, setPlanId] = useState<string | null>(null);

  React.useEffect(() => {
    fetchVips();
  }, []);

  React.useEffect(() => {
    if (selectedVipId) {
      fetchUserPlan(selectedVipId);
    }
  }, [selectedVipId]);

  const fetchVips = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .limit(20);
      if (data) {
        setVips(data);
        if (data.length > 0) setSelectedVipId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching VIPs:', error);
    }
  };

  const fetchUserPlan = async (userId: string) => {
    setLoading(true);
    try {
      // First find if user has a custom plan
      const { data: planData, error: planError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('type', 'custom')
        .single();

      // Note: In a real app we might link plan to user more explicitly
      // For now we use the general custom plan or filter by creator if needed
      // Here we'll just use the default custom plan ID
      if (planData) {
        setPlanId(planData.id);
        const { data: exercisesData } = await supabase
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

        if (exercisesData) setWorkoutExercises(exercisesData as any);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
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
      await supabase.from('workout_plan_exercises').insert(inserts);
      alert('Treino personalizado atualizado!');
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-[#333333] p-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Gestão de Treino Personalizado</h1>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark">
          <Icon name="more_vert" className="text-white" />
        </button>
      </header>

      <main className="max-w-xl mx-auto pb-10">
        <section className="px-4 pt-6 pb-2">
          <div className="bg-surface-dark/50 border border-primary/20 p-4 rounded-xl">
            <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-3">Filtro de Usuário VIP</h3>
            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium leading-normal pb-2">Selecionar Aluno para Consultoria</p>
              <div className="relative">
                <select
                  value={selectedVipId}
                  onChange={(e) => setSelectedVipId(e.target.value)}
                  className="appearance-none flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-surface-dark h-14 px-[15px] text-base font-normal leading-normal"
                >
                  {vips.map(v => (
                    <option key={v.id} value={v.id}>{v.full_name}</option>
                  ))}
                  {vips.length === 0 && <option value="">Nenhum aluno encontrado</option>}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Icon name="expand_more" />
                </div>
              </div>
            </label>
            <p className="text-gray-400 text-xs mt-2 italic">A seleção define qual plano exclusivo será editado abaixo.</p>
          </div>
        </section>

        <section className="px-4 pt-6">
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
            <Icon name="add_circle" className="text-primary" />
            Adicionar Novo Exercício
          </h2>
          <div className="space-y-4 bg-surface-dark p-5 rounded-xl border border-[#333333]">
            <div>
              <label className="text-white text-sm font-medium mb-1.5 block">Buscar no Banco de Dados</label>
              <div className="relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-background-dark h-14 pl-12 pr-4 text-base font-normal"
                  placeholder="BUSCAR NO BANCO DE DADOS"
                  type="text"
                />

                {searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-card-dark rounded-xl shadow-xl border border-white/10 overflow-hidden">
                    {searchResults.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          setSelectedExercise(ex);
                          setSearchTerm(ex.name);
                          setSearchResults([]);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex items-center justify-between"
                      >
                        <span className="font-bold">{ex.name}</span>
                        <span className="text-[10px] text-primary uppercase font-black">{ex.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedExercise && (
              <div className="bg-background-dark/50 border border-primary/30 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                <div className="size-12 rounded-lg bg-surface-dark flex items-center justify-center border border-[#333333]">
                  <Icon name="fitness_center" className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-tight">{selectedExercise.name}</p>
                  <p className="text-primary text-[10px] uppercase font-black tracking-widest">{selectedExercise.category}</p>
                </div>
                <button onClick={() => setSelectedExercise(null)} className="ml-auto text-gray-500 hover:text-white">
                  <Icon name="close" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">Séries</label>
                <input
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value))}
                  className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-background-dark h-14 px-4 text-base font-normal"
                  placeholder="Ex: 4"
                  type="number"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">Repetições</label>
                <input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-background-dark h-14 px-4 text-base font-normal"
                  placeholder="Ex: 12-15"
                  type="text"
                />
              </div>
            </div>

            <button
              onClick={addExercise}
              disabled={!selectedExercise}
              className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-base transition-transform active:scale-95 shadow-lg shadow-primary/20 mt-2 disabled:opacity-50"
            >
              CADASTRAR EXERCÍCIO
            </button>
          </div>
        </section>

        <section className="px-4 pt-10">
          <div className="flex items-center justify-between mb-4 gap-4">
            <h2 className="text-white text-xl font-bold leading-tight tracking-tight whitespace-nowrap">Exercícios Cadastrados</h2>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="relative">
                <select className="appearance-none text-[11px] font-bold bg-surface-dark border border-[#333333] text-white rounded-lg h-8 py-0 pl-2 pr-8 focus:ring-1 focus:ring-primary">
                  <option value="todos">FILTRAR: TODOS</option>
                  <option value="peitoral">PEITORAL</option>
                  <option value="biceps">BÍCEPS</option>
                  <option value="pernas">PERNAS</option>
                  <option value="costas">COSTAS</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Icon name="expand_more" className="text-sm" />
                </div>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/20 whitespace-nowrap font-black uppercase tracking-widest">{workoutExercises.length} TOTAIS</span>
            </div>
          </div>

          <div className="space-y-3">
            {loading && workoutExercises.length === 0 ? (
              <div className="py-10 text-center uppercase text-[10px] font-black tracking-widest text-slate-500 animate-pulse">Carregando Planilha...</div>
            ) : workoutExercises.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest text-slate-500 italic">Vazia</div>
            ) : (
              workoutExercises.map((we, index) => (
                <CustomWorkoutItem
                  key={index}
                  title={we.exercise.name}
                  category={we.exercise.category}
                  series={we.sets.toString()}
                  reps={we.reps}
                  onRemove={() => removeExercise(index)}
                />
              ))
            )}
          </div>
        </section>

        <section className="px-4 py-8">
          <button
            onClick={saveWorkout}
            disabled={loading}
            className="w-full bg-transparent border-2 border-primary text-primary h-14 rounded-lg font-bold text-base hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Icon name="save" />
            {loading ? 'SALVANDO...' : 'SALVAR PLANO EXCLUSIVO'}
          </button>
          <p className="text-center text-gray-500 text-xs mt-4">As alterações serão aplicadas instantaneamente para o aluno <span className="text-white font-bold">{vips.find(v => v.id === selectedVipId)?.full_name || 'Joaquim Silva'}</span>.</p>
        </section>
      </main>
    </div>
  );
};

interface CustomWorkoutItemProps {
  title: string;
  category: string;
  series: string;
  reps: string;
  imageUrl?: string;
  onRemove: () => void;
}

const CustomWorkoutItem: React.FC<CustomWorkoutItemProps> = ({ title, category, series, reps, imageUrl, onRemove }) => (
  <div className="flex items-center gap-4 bg-surface-dark border border-[#333333] p-3 rounded-xl">
    <div className="size-20 rounded-lg overflow-hidden bg-background-dark flex-shrink-0 relative">
      {imageUrl ? (
        <img alt={title} className="w-full h-full object-cover opacity-80" src={imageUrl} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Icon name="image" className="text-gray-600 text-3xl" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon name="play_circle" className="text-white/50 text-xl" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-bold text-base truncate">{title}</h4>
      <p className="text-gray-400 text-xs uppercase tracking-wide">{category}</p>
      <div className="flex gap-3 mt-1.5">
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          <Icon name="reorder" className="text-sm" /> {series} Séries
        </div>
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          <Icon name="repeat" className="text-sm" /> {reps} Reps
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <button className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#333333]">
        <Icon name="edit" className="text-[20px]" />
      </button>
      <button
        onClick={onRemove}
        className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10"
      >
        <Icon name="delete" className="text-[20px]" />
      </button>
    </div>
  </div>
);
