import React, { useState } from 'react';
import { Icon } from './Icon';

interface CreateUserProps {
  onBack: () => void;
}

export const CreateUser: React.FC<CreateUserProps> = ({ onBack }) => {
  const [gender, setGender] = useState('masculino');

  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col items-center font-display">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl relative">
        <header className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-gray-200 dark:border-white/10">
          <button 
            onClick={onBack}
            className="text-gray-900 dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight ml-2">Cadastrar Novo Aluno</h2>
        </header>
        <main className="flex-1 overflow-y-auto pb-32">
          <div className="px-4 pt-6">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Dados Pessoais</h3>
            <div className="space-y-4">
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Nome Completo</label>
                <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Digite o nome completo" type="text"/>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Telefone</label>
                <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="(00) 00000-0000" type="tel"/>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Data de Nascimento</label>
                <div className="relative">
                  <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="DD/MM/AAAA" type="text"/>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <Icon name="calendar_today" />
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Peso (kg)</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="0.0" type="number"/>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Altura (cm)</label>
                  <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="000" type="number"/>
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-[#1c1c1c] my-6"></div>
          <div className="px-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Configuração de Treino</h3>
            <div className="space-y-6">
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Gênero / Programa</label>
                <div className="flex bg-white dark:bg-[#282828] rounded-lg p-1 border border-gray-300 dark:border-[#3a3a3a] gap-1">
                  <button 
                    onClick={() => setGender('masculino')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${gender === 'masculino' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-[#f0f0f0] hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    Masculino
                  </button>
                  <button 
                    onClick={() => setGender('feminino')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${gender === 'feminino' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-[#f0f0f0] hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    Feminino
                  </button>
                  <button 
                     onClick={() => setGender('personalizado')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${gender === 'personalizado' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-[#f0f0f0] hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    Personalizado
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Status Inicial</label>
                <div className="relative">
                  <select className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 p-4 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all">
                    <option value="gratis">Teste Grátis</option>
                    <option value="ativo">Plano Ativo</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <Icon name="expand_more" />
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Cupom de Promoção</label>
                <div className="relative">
                  <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase" placeholder="Ex: VERÃO2024" type="text"/>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <Icon name="sell" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-[#1c1c1c] my-6"></div>
          <div className="px-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Credenciais de Acesso</h3>
            <div className="space-y-4">
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Usuário</label>
                <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Digite o nome de usuário" type="text"/>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Senha</label>
                <input className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Digite a senha" type="password"/>
              </div>
            </div>
          </div>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-[#3a3a3a] z-20">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg tracking-wider text-base transition-colors shadow-lg shadow-primary/20">
            CADASTRAR ALUNO
          </button>
        </footer>
      </div>
    </div>
  );
};