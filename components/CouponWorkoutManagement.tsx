import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  category: string;
  gif_url?: string;
}

interface WorkoutExercise {
  id?: string;
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
}

interface Coupon {
  coupon: string;
  full_name: string;
  plan_id: string | null;
}

interface CouponWorkoutManagementProps {
  onBack: () => void;
}

export const CouponWorkoutManagement: React.FC<CouponWorkoutManagementProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState('12');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (selectedCoupon) {
      fetchPlanAndExercises();
    }
  }, [selectedCoupon]);

  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      // Get all influencers with coupons
      const { data: influencers, error } = await supabase
        .from('profiles')
        .select('coupon, full_name')
        .eq('role', 'influencer')
        .not('coupon', 'is', null);

      if (error) throw error;

      // Get coupon_workout_plans to check for existing plans
      const { data: couponPlans } = await supabase
        .from('coupon_workout_plans')
        .select('coupon, plan_id');

      const couponPlanMap = new Map((couponPlans || []).map(cp => [cp.coupon, cp.plan_id]));

      const formattedCoupons: Coupon[] = (influencers || []).map(inf => ({
        coupon: inf.coupon,
        full_name: inf.full_name || 'Influenciador',
        plan_id: couponPlanMap.get(inf.coupon) || null
      }));

      setCoupons(formattedCoupons);

      // Select first coupon by default
      if (formattedCoupons.length > 0) {
        setSelectedCoupon(formattedCoupons[0].coupon);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchPlanAndExercises = async () => {
    setLoading(true);
    setWorkoutExercises([]);
    setPlanId(null);

    try {
      // Check if coupon has a dedicated plan
      const { data: couponPlan } = await supabase
        .from('coupon_workout_plans')
        .select('plan_id')
        .eq('coupon', selectedCoupon)
        .single();

      let currentPlanId = couponPlan?.plan_id;

      // If no plan exists for this coupon, create one
      if (!currentPlanId) {
        const { data: newPlan, error: createError } = await supabase
          .from('workout_plans')
          .insert({
            name: `Treino ${selectedCoupon.toUpperCase()}`,
            description: `Plano de treino exclusivo para cupom ${selectedCoupon.toUpperCase()}`,
            category: 'Cupom',
            type: 'coupon'
          })
          .select()
          .single();

        if (createError) throw createError;
        currentPlanId = newPlan.id;

        // Link coupon to new plan
        await supabase
          .from('coupon_workout_plans')
          .upsert({ coupon: selectedCoupon, plan_id: currentPlanId });
      }

      setPlanId(currentPlanId);

      // Fetch exercises for this plan
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_plan_exercises')
        .select(`
          id,
          exercise_id,
          sets,
          reps,
          exercise:exercise_bank(id, name, category, gif_url)
        `)
        .eq('plan_id', currentPlanId)
        .order('order_index', { ascending: true });

      if (exercisesError) throw exercisesError;

      const formatted = (exercisesData || []).map(e => ({
        id: e.id,
        exercise_id: e.exercise_id,
        exercise: Array.isArray(e.exercise) ? e.exercise[0] : e.exercise,
        sets: e.sets,
        reps: e.reps
      }));

      setWorkoutExercises(formatted);
    } catch (error) {
      console.error('Error fetching coupon workout data:', error);
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
      .select('id, name, category, gif_url')
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

  const saveWorkout = async () => {
    if (!planId) {
      alert('Nenhum plano selecionado.');
      return;
    }

    setSaving(true);
    try {
      // Delete existing exercises
      await supabase.from('workout_plan_exercises').delete().eq('plan_id', planId);

      // Insert new exercises
      if (workoutExercises.length > 0) {
        const inserts = workoutExercises.map((we, index) => ({
          plan_id: planId,
          exercise_id: we.exercise_id,
          sets: we.sets,
          reps: we.reps,
          order_index: index
        }));

        const { error } = await supabase.from('workout_plan_exercises').insert(inserts);
        if (error) throw error;
      }

      alert('Treino do cupom atualizado com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeExercise = (index: number) => {
    const nl = [...workoutExercises];
    nl.splice(index, 1);
    setWorkoutExercises(nl);
  };

  const selectedCouponData = coupons.find(c => c.coupon === selectedCoupon);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-border-dark p-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <h1 className="text-white text-lg font-bold leading-tight tracking-tight">Gestão de Treino por Cupom</h1>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark">
          <Icon name="more_vert" className="text-white" />
        </button>
      </header>

      <main className="max-w-xl mx-auto pb-10">
        <section className="px-4 pt-6 pb-2">
          <div className="bg-surface-dark/50 border border-primary/20 p-4 rounded-xl">
            <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-3">Filtro de Campanha</h3>
            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium leading-normal pb-2">Selecionar Cupom de Influenciador</p>
              <div className="relative">
                {loadingCoupons ? (
                  <div className="flex w-full min-w-0 flex-1 rounded-lg text-white border border-[#333333] bg-surface-dark h-14 px-[15px] items-center">
                    <div className="animate-spin size-5 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
                    <span className="text-slate-500">Carregando cupons...</span>
                  </div>
                ) : coupons.length === 0 ? (
                  <div className="flex w-full min-w-0 flex-1 rounded-lg text-slate-500 border border-[#333333] bg-surface-dark h-14 px-[15px] items-center italic">
                    Nenhum influenciador com cupom encontrado
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedCoupon}
                      onChange={(e) => setSelectedCoupon(e.target.value)}
                      className="appearance-none flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#333333] bg-surface-dark h-14 px-[15px] text-base font-normal leading-normal"
                    >
                      {coupons.map(c => (
                        <option key={c.coupon} value={c.coupon}>
                          {c.coupon.toUpperCase()} - {c.full_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Icon name="expand_more" />
                    </div>
                  </>
                )}
              </div>
            </label>
            {selectedCouponData && (
              <div className="mt-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded border border-primary/20 uppercase">
                  {selectedCouponData.coupon}
                </span>
                <span className="text-gray-400 text-xs">
                  {workoutExercises.length} exercícios cadastrados
                </span>
              </div>
            )}
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
                <div className="size-12 rounded-lg bg-surface-dark flex items-center justify-center border border-[#333333] overflow-hidden">
                  {selectedExercise.gif_url ? (
                    <img src={selectedExercise.gif_url} alt={selectedExercise.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="fitness_center" className="text-primary" />
                  )}
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
                  onChange={(e) => setSets(parseInt(e.target.value) || 0)}
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
              onClick={addExerciseToList}
              disabled={!selectedExercise}
              className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-base transition-transform active:scale-95 shadow-lg shadow-primary/20 mt-2 disabled:opacity-50"
            >
              ADICIONAR AO TREINO
            </button>
          </div>
        </section>

        <section className="px-4 pt-10">
          <div className="flex items-center justify-between mb-4 gap-4">
            <h2 className="text-white text-xl font-bold leading-tight tracking-tight whitespace-nowrap">Exercícios do Treino</h2>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/20 whitespace-nowrap uppercase tracking-widest font-black leading-none">
              {workoutExercises.length} EXERCÍCIOS
            </span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-10 text-center uppercase text-[10px] font-black tracking-widest text-slate-500 flex flex-col items-center gap-2">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full"></div>
                Carregando Exercícios...
              </div>
            ) : workoutExercises.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest text-slate-500 italic">
                Nenhum exercício cadastrado para este cupom
              </div>
            ) : (
              workoutExercises.map((we, index) => (
                <CouponWorkoutItem
                  key={index}
                  title={we.exercise?.name || 'Exercício'}
                  category={we.exercise?.category || 'Sem categoria'}
                  series={we.sets.toString()}
                  reps={we.reps}
                  imageUrl={we.exercise?.gif_url}
                  onRemove={() => removeExercise(index)}
                />
              ))
            )}
          </div>
        </section>

        <section className="px-4 py-8">
          <button
            onClick={saveWorkout}
            disabled={saving || !planId}
            className="w-full bg-primary text-white h-14 rounded-lg font-bold text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            <Icon name="save" />
            {saving ? 'SALVANDO...' : 'SALVAR PLANO DE TREINO'}
          </button>
          {selectedCoupon && (
            <p className="text-center text-gray-500 text-xs mt-4">
              As alterações serão aplicadas instantaneamente para usuários do cupom{' '}
              <span className="text-primary font-bold">{selectedCoupon.toUpperCase()}</span>.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

interface CouponWorkoutItemProps {
  title: string;
  category: string;
  series: string;
  reps: string;
  imageUrl?: string;
  onRemove: () => void;
}

const CouponWorkoutItem: React.FC<CouponWorkoutItemProps> = ({ title, category, series, reps, imageUrl, onRemove }) => (
  <div className="flex items-center gap-4 bg-surface-dark border border-[#333333] p-3 rounded-xl">
    <div className="size-20 rounded-lg overflow-hidden bg-background-dark flex-shrink-0 relative">
      {imageUrl ? (
        <img alt={title} className="w-full h-full object-cover" src={imageUrl} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Icon name="fitness_center" className="text-gray-600 text-3xl" />
        </div>
      )}
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
    <button
      onClick={onRemove}
      className="size-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
    >
      <Icon name="delete" className="text-xl" />
    </button>
  </div>
);
