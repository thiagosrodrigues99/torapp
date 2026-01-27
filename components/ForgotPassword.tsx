import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface ForgotPasswordProps {
    onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [tempPassword, setTempPassword] = useState('123456');

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => {
        if (step === 1) onBack();
        else setStep(prev => prev - 1);
    };

    const handleConfirmBirthDate = async () => {
        setLoading(true);
        // Simulação de validação e geração de senha temporária
        // Na vida real, isso chamaria uma Edge Function ou API segura
        setTimeout(() => {
            setTempPassword(Math.floor(100000 + Math.random() * 900000).toString());
            setStep(4);
            setLoading(false);
        }, 1500);
    };

    // Etapa 01 - Telefone
    if (step === 1) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col font-display antialiased">
                <header className="flex items-center p-4 pb-2 justify-between">
                    <button onClick={handlePrev} className="text-white flex size-12 shrink-0 items-center cursor-pointer">
                        <Icon name="arrow_back_ios" className="text-2xl" />
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Esqueci a Senha</h2>
                </header>

                <div className="flex w-full flex-row items-center justify-center gap-3 py-6">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="h-2 w-2 rounded-full bg-white/20"></div>
                    <div className="h-2 w-2 rounded-full bg-white/20"></div>
                    <div className="h-2 w-2 rounded-full bg-white/20"></div>
                </div>

                <main className="flex-1 px-4">
                    <h2 className="text-primary tracking-light text-[28px] font-extrabold leading-tight pt-4">Etapa 01</h2>
                    <p className="text-white/80 text-base font-normal leading-normal pb-6 pt-2">
                        Informe seu número de telefone para iniciar a recuperação. Enviaremos um código de verificação via SMS.
                    </p>

                    <div className="flex flex-col gap-2">
                        <p className="text-white text-sm font-semibold uppercase tracking-wider opacity-70">Telefone</p>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 font-medium">+55</span>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/10 bg-white/5 h-16 pl-14 pr-4 text-lg font-medium transition-all"
                                placeholder="(00) 00000-0000"
                                type="tel"
                            />
                        </div>
                    </div>
                </main>

                <div className="p-4 mb-6">
                    <button
                        onClick={handleNext}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                    >
                        PRÓXIMO
                        <Icon name="arrow_forward" />
                    </button>
                    <div className="mt-4 text-center">
                        <button className="text-slate-400 text-sm font-medium hover:text-white transition-colors">
                            Tentar recuperar por e-mail
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Etapa 02 - Usuário
    if (step === 2) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col font-display">
                <header className="flex items-center p-4 pb-2 justify-between">
                    <button onClick={handlePrev} className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
                        <Icon name="arrow_back_ios" className="text-[24px]" />
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Esqueci a Senha</h2>
                </header>

                <main className="flex-1 flex flex-col px-4">
                    <div className="flex w-full flex-row items-center justify-center gap-3 py-6">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/30"></div>
                        <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/30"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/30"></div>
                    </div>

                    <p className="text-primary text-sm font-bold uppercase tracking-wider pt-4">Etapa 02 de 04</p>
                    <h1 className="text-white tracking-tight text-3xl font-bold leading-tight pb-2 pt-1">Identifique seu usuário</h1>
                    <p className="text-white/60 text-base font-normal leading-normal pb-8">
                        Informe o nome de usuário ou e-mail vinculado à sua conta para prosseguirmos com a recuperação.
                    </p>

                    <div className="flex flex-col gap-2">
                        <p className="text-white/90 text-sm font-medium ml-1">Nome de Usuário ou E-mail</p>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/10 bg-white/5 h-14 px-4 text-base transition-all"
                            placeholder="Digite seu usuário ou e-mail"
                            type="text"
                        />
                    </div>

                    <div className="flex-1 text-center flex flex-col justify-center">
                        <div className="fixed top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="fixed bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                    </div>

                    <div className="py-8 w-full">
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-lg shadow-primary/20"
                        >
                            PRÓXIMO
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Etapa 03 - Nascimento
    if (step === 3) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col font-display">
                <header className="flex items-center p-4 pb-2 sticky top-0 z-10">
                    <button onClick={handlePrev} className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
                        <Icon name="arrow_back_ios" className="text-2xl" />
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Esqueci a Senha</h2>
                </header>

                <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex gap-6 justify-between">
                            <p className="text-white text-base font-medium">Etapa 03</p>
                            <p className="text-white/60 text-sm">3/4</p>
                        </div>
                        <div className="rounded-full bg-white/10 overflow-hidden h-2">
                            <div className="h-full rounded-full bg-primary" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    <div className="pt-4 px-4">
                        <h3 className="text-white tracking-tight text-2xl font-extrabold pb-2">Etapa 03</h3>
                        <p className="text-white/70 text-base font-normal pb-6 pt-1">
                            Confirme sua data de nascimento para segurança
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 px-4 py-3">
                        <label className="flex flex-col w-full">
                            <p className="text-white text-sm font-semibold pb-2 uppercase tracking-wider">Data de Nascimento</p>
                            <div className="flex w-full items-stretch rounded-lg shadow-sm">
                                <input
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full rounded-l-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/10 bg-[#1e1e1e] h-14 placeholder:text-white/30 p-[15px] border-r-0 text-lg font-medium"
                                    placeholder="DD/MM/AAAA"
                                    type="text"
                                />
                                <div className="text-white/40 flex border border-white/10 bg-[#1e1e1e] items-center justify-center pr-[15px] rounded-r-lg border-l-0">
                                    <Icon name="calendar_today" />
                                </div>
                            </div>
                            <p className="text-white/40 text-xs mt-2 italic px-1">Usaremos isso apenas para validar sua identidade.</p>
                        </label>
                    </div>

                    <div className="flex-1"></div>

                    <div className="p-4 pb-8">
                        <button
                            onClick={handleConfirmBirthDate}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'CONFIRMANDO...' : 'CONFIRMAR'}
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Etapa 04 - Mostrar Senha
    if (step === 4) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-100 min-h-screen flex flex-col font-display">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center justify-start">
                        {/* Sem back na última etapa para forçar o login */}
                    </div>
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold flex-1 text-center">Recuperação de Senha</h2>
                </div>

                <div className="flex flex-col gap-3 p-4">
                    <div className="flex gap-6 justify-between">
                        <p className="text-gray-900 dark:text-white text-base font-medium uppercase tracking-wider">Etapa 04</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">4 de 4</p>
                    </div>
                    <div className="rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden h-2">
                        <div className="h-full rounded-full bg-primary" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center px-6">
                    <h1 className="text-gray-900 dark:text-white tracking-tight text-[32px] font-extrabold pb-2 pt-8">Sua Senha</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base font-normal pb-8 pt-1 text-center">Sua nova senha de acesso foi gerada com sucesso.</p>

                    <div className="w-full max-w-sm bg-white dark:bg-[#1f1f1f] rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col items-center gap-6">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-widest">Sua senha é:</p>
                        <div className="flex justify-center gap-2">
                            {tempPassword.split('').map((char, i) => (
                                <div key={i} className="flex h-14 w-11 items-center justify-center border-b-2 border-primary text-2xl font-bold text-gray-900 dark:text-white">
                                    {char}
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 flex items-center gap-2 text-primary font-bold text-sm hover:opacity-80 transition-opacity">
                            <Icon name="content_copy" className="text-lg" />
                            COPIAR SENHA
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20 max-w-sm">
                        <Icon name="info" className="text-primary" />
                        <p className="text-xs text-gray-600 dark:text-gray-300">Por segurança, recomendamos que você altere esta senha temporária logo após o primeiro login.</p>
                    </div>
                </div>

                <div className="p-6 mt-auto">
                    <button
                        onClick={onBack}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary/20 uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        Voltar para Login
                        <Icon name="login" />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
