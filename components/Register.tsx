import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onBack: () => void;
  onComplete: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState('masculino');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 dígitos.');
      return;
    }

    setLoading(true);

    try {
      // Convert username to a dummy email for Supabase compliance
      const internalEmail = `${username.toLowerCase().trim()}@tor.app`;

      const { data, error } = await supabase.auth.signUp({
        email: internalEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
            phone: phone,
            role: 'user',
          }
        }
      });

      if (error) {
        alert('Erro ao cadastrar: ' + error.message);
        return;
      }

      if (data.user) {
        alert('Cadastro realizado com sucesso!');
        onComplete();
      }
    } catch (error: any) {
      alert('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Dados Pessoais
  if (step === 1) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col font-manrope">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
          <button onClick={onBack} className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
            <Icon name="arrow_back_ios" className="text-[24px] text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Criar Conta</h2>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between">
            <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Etapa 01</p>
            <p className="text-slate-500 dark:text-white/60 text-sm font-normal leading-normal">1 de 3</p>
          </div>
          <div className="rounded-full bg-slate-200 dark:bg-input-bg h-2 w-full overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '33%' }}></div>
          </div>
        </div>

        <div className="px-4 pt-6">
          <h1 className="text-slate-900 dark:text-white tracking-light text-[32px] font-extrabold leading-tight text-left">Dados Pessoais</h1>
          <p className="text-slate-500 dark:text-white/60 text-base font-normal leading-normal mt-2">Vamos começar com o básico para personalizar seu treino.</p>
        </div>

        <form className="flex flex-col gap-4 p-4 mt-4 flex-grow" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 uppercase tracking-wider">Nome Completo</p>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-input-border/20 bg-white dark:bg-input-bg h-14 placeholder:text-slate-400 dark:placeholder:text-white/40 px-4 text-base font-normal"
              placeholder="Digite seu nome completo"
              type="text"
              required
            />
          </label>

          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 uppercase tracking-wider">Usuário</p>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-input-border/20 bg-white dark:bg-input-bg h-14 placeholder:text-slate-400 dark:placeholder:text-white/40 px-4 text-base font-normal"
              placeholder="Escolha um nome de usuário"
              type="text"
              required
            />
          </label>

          <div className="mt-auto mb-6 pt-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              PRÓXIMO
              <Icon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 2: Gênero
  if (step === 2) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex justify-center items-start font-manrope">
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
          <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
            <button onClick={handlePrev} className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
              <Icon name="arrow_back_ios" className="text-2xl" />
            </button>
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Criar Conta</h2>
          </div>

          <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
            <div className="h-2 w-8 rounded-full bg-primary/30"></div>
            <div className="h-2 w-8 rounded-full bg-primary"></div>
            <div className="h-2 w-8 rounded-full bg-primary/30"></div>
          </div>

          <div className="px-4 pt-5 pb-2">
            <h3 className="text-gray-900 dark:text-white tracking-tight text-2xl font-extrabold leading-tight">Etapa 02</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gênero</p>
          </div>

          <div className="flex flex-col gap-8 px-4 py-8 flex-1">
            <div className="flex gap-3">
              <div className="flex-1">
                <button
                  onClick={() => setGender('masculino')}
                  className={`flex items-center justify-center w-full h-14 border rounded-xl font-bold transition-colors ${gender === 'masculino' ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-input-bg border-transparent text-slate-700 dark:text-white'}`}
                > Masculino </button>
              </div>
              <div className="flex-1">
                <button
                  onClick={() => setGender('feminino')}
                  className={`flex items-center justify-center w-full h-14 border rounded-xl font-bold transition-colors ${gender === 'feminino' ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-input-bg border-transparent text-slate-700 dark:text-white'}`}
                > Feminino </button>
              </div>
            </div>

            <label className="flex flex-col w-full mt-4">
              <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 uppercase tracking-wider">Telefone</p>
              <input
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 11) {
                    let formatted = value;
                    if (value.length > 2) {
                      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    }
                    if (value.length > 7) {
                      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                    }
                    setPhone(formatted);
                  }
                }}
                className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-input-border/20 bg-white dark:bg-input-bg h-14 placeholder:text-slate-400 dark:placeholder:text-white/40 px-4 text-base font-normal"
                placeholder="(00) 00000-0000"
                type="tel"
                maxLength={15}
                required
              />
            </label>
          </div>

          <div className="flex flex-col px-4 py-8 mt-auto mb-4">
            <button
              onClick={handleNext}
              className="w-full bg-primary text-white h-14 rounded-xl font-bold uppercase tracking-widest"
            > PRÓXIMO </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Senha
  if (step === 3) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col font-manrope">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
          <button onClick={handlePrev} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
            <Icon name="arrow_back_ios" />
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Criar Conta</h2>
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-3 py-5 bg-background-light dark:bg-background-dark">
          <div className="h-2 w-8 rounded-full bg-primary/30"></div>
          <div className="h-2 w-8 rounded-full bg-primary/30"></div>
          <div className="h-2 w-8 rounded-full bg-primary"></div>
        </div>

        <div className="px-4 pt-5 pb-2">
          <h3 className="text-slate-900 dark:text-white tracking-light text-3xl font-extrabold leading-tight">Etapa 03</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Defina sua senha</p>
        </div>

        <div className="flex-1 flex flex-col px-4 gap-4 mt-6">
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-white text-base font-semibold pb-2">Senha</p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input w-full rounded-lg bg-white dark:bg-surface-dark border border-slate-300 dark:border-none h-14 px-4 text-slate-900 dark:text-white tracking-widest"
              placeholder="••••••"
              type="password"
              maxLength={6}
            />
          </label>
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-white text-base font-semibold pb-2">Confirmar Senha</p>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input w-full rounded-lg bg-white dark:bg-surface-dark border border-slate-300 dark:border-none h-14 px-4 text-slate-900 dark:text-white tracking-widest"
              placeholder="••••••"
              type="password"
              maxLength={6}
            />
          </label>
        </div>

        <div className="p-4 pb-10">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-primary text-white font-bold h-14 rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};