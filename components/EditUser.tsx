import React, { useState } from 'react';
import { Icon } from './Icon';

interface EditUserProps {
  onBack: () => void;
}

export const EditUser: React.FC<EditUserProps> = ({ onBack }) => {
  const [trainingType, setTrainingType] = useState('masculino');

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
              <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhGng9xzRyM8Qy6Mpdqo0RlfYeiGW2GwP3990lmt4X6-0hnSUT38SP9vC2GXyExjmdx1-2wzMeR0JlFXOCWQR6o7COgrzwHNj1J9vl-EDz8C0ae1WfGtHmRx8ZlGL2j3UvSgs5SQr81YI549gKY7-9cl_2QP6cinm4s4DxIG3DSDZsiCGx751iJ6aLDl3ChmV2fa8192PyOoZv7gZlH-iqxz1DB_gUxHirDIxNYgNymHNIG0-6EeCikSfjOtjWXAKNWAhbU9XYjzJt"/>
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
                  defaultValue="Ricardo Oliveira"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="telefone">Telefone</label>
                <input 
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  id="telefone" 
                  name="telefone" 
                  type="text" 
                  defaultValue="(11) 98765-4321"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="nascimento">Data de Nascimento</label>
                <input 
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  id="nascimento" 
                  name="nascimento" 
                  type="date" 
                  defaultValue="1992-05-15"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="peso">Peso (kg)</label>
                <input 
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  id="peso" 
                  name="peso" 
                  step="0.1" 
                  type="number" 
                  defaultValue="82.5"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="altura">Altura (cm)</label>
                <input 
                  className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  id="altura" 
                  name="altura" 
                  type="number" 
                  defaultValue="180"
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
                      checked={trainingType === 'masculino'} 
                      onChange={() => setTrainingType('masculino')}
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
                      checked={trainingType === 'feminino'} 
                      onChange={() => setTrainingType('feminino')}
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
                      checked={trainingType === 'personalizado'} 
                      onChange={() => setTrainingType('personalizado')}
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
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
              <Icon name="verified_user" className="text-primary" />
              <h2 className="text-lg font-bold uppercase tracking-tight italic">Status da Conta</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block" htmlFor="status">Status</label>
                <div className="relative">
                  <select 
                    className="w-full rounded-lg px-4 py-3 bg-card-dark border border-white/10 text-[#f0f0f0] appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                    id="status" 
                    name="status"
                    defaultValue="trial"
                  >
                    <option value="trial">TESTE GRÁTIS</option>
                    <option value="active">PLANO ATIVO</option>
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
                  type="number" 
                  defaultValue="3"
                />
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
                defaultValue="FITNESS10"
              />
            </div>
          </section>
          <div className="pt-8 pb-12">
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-sm transition-all tracking-widest uppercase shadow-lg shadow-primary/20">
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
      <div className="h-8 w-full bg-transparent"></div>
    </div>
  );
};
