import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLoginSuccess: (role: 'user' | 'admin' | 'influencer') => void;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onRegisterClick, onForgotPasswordClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert username input to the internal format if it doesn't look like an email
      let emailToUse = username.trim();
      if (!emailToUse.includes('@')) {
        emailToUse = `${emailToUse.toLowerCase()}@tor.app`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password,
      });

      if (error) {
        alert('Erro ao entrar: ' + error.message);
        return;
      }

      if (data.user) {
        // O App.tsx cuidará da mudança de estado via onAuthStateChange
      }
    } catch (error: any) {
      alert('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen flex flex-col overflow-x-hidden relative">
      <div className="flex items-center p-4 justify-between sticky top-0 z-10 bg-background-light dark:bg-background-dark">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 cursor-pointer transition-colors">
          <Icon name="arrow_back_ios_new" className="text-slate-900 dark:text-white" />
        </div>
        <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight tracking-tight flex-1 text-center pr-10">Entrar</h2>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 pb-12 max-w-md mx-auto w-full justify-between relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-[0_0_20px_rgba(220,0,60,0.3)]">
            <Icon name="bolt" className="text-white text-[48px]" />
          </div>
          <h1 className="text-primary text-4xl font-extrabold tracking-tighter mb-2">BEM-VINDO</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Por favor, insira seus dados para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-gray-94 text-sm font-semibold pl-1">Usuário</label>
            <div className="relative">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-14 bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-94/10 rounded-xl px-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Digite seu nome de usuário"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-gray-94 text-sm font-semibold pl-1">Senha de 6 dígitos</label>
            <div className="relative flex items-center">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-94/10 rounded-xl px-4 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                type={showPassword ? "text" : "password"}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 dark:text-gray-400 cursor-pointer hover:text-primary dark:hover:text-white transition-colors"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-gray-500 font-medium pl-1">Apenas números</p>
          </div>

          <div className="flex justify-end pr-1">
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-slate-500 dark:text-gray-94 hover:text-primary text-sm font-semibold transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
            <button
              type="button"
              onClick={onRegisterClick}
              className="w-full h-14 bg-transparent border-2 border-slate-200 dark:border-gray-94/20 hover:border-primary/40 text-slate-700 dark:text-gray-94 font-bold text-lg rounded-xl active:scale-[0.98] transition-all"
            >
              CRIAR CONTA
            </button>
          </div>
        </form>

        <div className="mt-12 text-center space-y-10">
          <div>
            <p className="text-slate-500 dark:text-gray-94/60 text-sm font-medium">
              Não tem uma conta?
              <button onClick={onRegisterClick} className="text-primary font-bold hover:underline underline-offset-4 ml-1">Cadastre-se</button>
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-4 px-2">
            <a className="flex-1 max-w-[140px] bg-black border border-gray-94/10 rounded-lg py-2 px-3 flex items-center gap-2 hover:bg-zinc-800 transition-colors group" href="#">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] uppercase font-bold text-gray-400">Download on the</span>
                <span className="text-[13px] font-bold text-white">App Store</span>
              </div>
            </a>
            <a className="flex-1 max-w-[140px] bg-black border border-gray-94/10 rounded-lg py-2 px-3 flex items-center gap-2 hover:bg-zinc-800 transition-colors group" href="#">
              <svg className="w-6 h-6" viewBox="0 0 512 512">
                <path d="M103.196 21.93L258.906 177.64l44.314-44.314L141.054 10.32c-15.545-13.76-37.859-13.76-53.404 0-2.484 2.198-4.321 4.793-5.508 7.61l21.054 4.0z" fill="#00e5ff"></path>
                <path d="M103.196 490.07l21.054 4.0c1.187 2.817 3.024 5.412 5.508 7.61 15.545 13.76 37.859 13.76 53.404 0L303.22 378.674l-44.314-44.314L103.196 490.07z" fill="#ff3d00"></path>
                <path d="M103.196 21.93v468.14l155.71-155.71L103.196 21.93z" fill="#ffc107"></path>
                <path d="M258.906 334.36l152.04-152.04c15.545-13.76 15.545-36.1 0-49.86l-107.726 107.726-44.314 44.314 44.314 44.314 107.726 107.726c15.545-13.76 15.545-36.1 0-49.86l-152.04-152.04z" fill="#4caf50"></path>
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] uppercase font-bold text-gray-400">Get it on</span>
                <span className="text-[13px] font-bold text-white whitespace-nowrap">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};