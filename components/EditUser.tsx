import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface EditUserProps {
  user: {
    id: string;
    full_name: string;
    phone: string;
    gender: string;
    coupon: string;
    status: string;
    trial_days?: string;
    assigned_plan_id?: string;
  };
  onBack: () => void;
}

interface WorkoutPlan {
  id: string;
  name: string;
  category: string;
}

export const EditUser: React.FC<EditUserProps> = ({ user, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user.full_name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [gender, setGender] = useState(user.gender || 'masculino');
  const [status, setStatus] = useState(user.status || 'Ativo');
  const [trialDays, setTrialDays] = useState(user.trial_days || '');
  const [coupon, setCoupon] = useState(user.coupon || '');
  const [assignedPlanId, setAssignedPlanId] = useState(user.assigned_plan_id || '');
  const [availablePlans, setAvailablePlans] = useState<WorkoutPlan[]>([]);

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from('workout_plans')
      .select('id, name, category')
      .order('category', { ascending: true });
    if (data) setAvailablePlans(data);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          gender: gender,
          status: status,
          trial_days: trialDays,
          coupon: coupon,
          assigned_plan_id: assignedPlanId || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Aluno atualizado com sucesso!');
      onBack();
    } catch (error: any) {
      alert('Erro ao atualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center p-4 justify-between w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center size-10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow_back" className="text-white" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-[#f0f0f0] uppercase italic">Editar Aluno</h1>
          </div>
          <div className="flex gap-2">
            <div className="size-10 rounded-lg overflow-hidden border border-white/10">
              <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhGng9xzRyM8Qy6Mpdqo0RlfYeiGW2GwP3990lmt4X6-0hnSUT38SP9vC2GXyExjmdx1-2wzMeR0JlFXOCWQR6o7COgrzwHNj1J9vl-EDz8C0ae1WfGtHmRx8ZlGL2j3UvSgs5SQr81YI549gKY7-9cl_2QP6cinm4s4DxIG3DSDZsiCGx751iJ6aLDl3ChmV2fa8192PyOoZv7gZlH-iqxz1DB_gUxHirDIxNYgNymHNIG0-6EeCikSfjOtjWXAKNWAhbU9XYjzJt" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
              <Icon name="person" className="text-primary" />
              <h2 className="text-lg font-bold uppercase tracking-tight italic">Informações Pessoais</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="nome">Nome Completo</label>
                <input
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  id="nome"
                  name="nome"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="telefone">Telefone</label>
                <input
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  id="telefone"
                  name="telefone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="status">Status</label>
                <div className="relative">
                  <select
                    className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Teste Grátis">TESTE GRÁTIS</option>
                    <option value="Ativo">PLANO ATIVO</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Icon name="expand_more" />
                  </span>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="dias">Dias Restantes (Trial)</label>
                <input
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  id="dias"
                  name="dias"
                  type="text"
                  value={trialDays}
                  onChange={(e) => setTrialDays(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
              <Icon name="fitness_center" className="text-primary" />
              <h2 className="text-lg font-bold uppercase tracking-tight italic">Configuração de Treino</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Gênero</label>
                <div className="flex p-1 bg-card-dark rounded-xl border border-white/10">
                  <label className="flex-1 mb-0 cursor-pointer">
                    <input
                      checked={gender === 'masculino'}
                      onChange={() => setGender('masculino')}
                      className="hidden peer"
                      name="genero"
                      type="radio"
                      value="masculino"
                    />
                    <div className="text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all peer-checked:bg-primary peer-checked:text-white text-slate-400 hover:text-white">
                      Masculino
                    </div>
                  </label>
                  <label className="flex-1 mb-0 cursor-pointer">
                    <input
                      checked={gender === 'feminino'}
                      onChange={() => setGender('feminino')}
                      className="hidden peer"
                      name="genero"
                      type="radio"
                      value="feminino"
                    />
                    <div className="text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all peer-checked:bg-primary peer-checked:text-white text-slate-400 hover:text-white">
                      Feminino
                    </div>
                  </label>
                  <label className="flex-1 mb-0 cursor-pointer">
                    <input
                      checked={gender === 'personalizado'}
                      onChange={() => setGender('personalizado')}
                      className="hidden peer"
                      name="genero"
                      type="radio"
                      value="personalizado"
                    />
                    <div className="text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all peer-checked:bg-primary peer-checked:text-white text-slate-400 hover:text-white">
                      Personalizado
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Vincular Plano de Treino</label>
                <div className="relative">
                  <select
                    className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    value={assignedPlanId}
                    onChange={(e) => setAssignedPlanId(e.target.value)}
                  >
                    <option value="">Selecione um plano...</option>
                    {availablePlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.category.toUpperCase()} - {plan.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Icon name="expand_more" />
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
              <Icon name="confirmation_number" className="text-primary" />
              <h2 className="text-lg font-bold uppercase tracking-tight italic">Cupom</h2>
            </div>
            <div className="max-w-md">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="cupom">Código de Desconto</label>
              <input
                className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] font-mono uppercase tracking-wider focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                id="cupom"
                name="cupom"
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
          </section>
          <div className="pt-8 pb-12">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-sm transition-all tracking-widest uppercase shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </main>
      <div className="h-8 w-full bg-transparent"></div>
    </div>
  );
};
