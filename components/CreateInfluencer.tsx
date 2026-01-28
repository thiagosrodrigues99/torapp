import React, { useState } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface CreateInfluencerProps {
    onBack: () => void;
}

export const CreateInfluencer: React.FC<CreateInfluencerProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [coupon, setCoupon] = useState('');
    const [workoutPrice, setWorkoutPrice] = useState('79.90');
    const [commissionValue, setCommissionValue] = useState('35.00');
    const [pixKey, setPixKey] = useState('');

    const handleCreate = async () => {
        if (!fullName || !username || !password || !coupon) {
            alert('Nome, usuário, senha e cupom são obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            // Usamos o padrão de e-mail interno para o auth
            const internalEmail = `${username.toLowerCase().trim()}@tor.app`;

            const { data, error } = await supabase.auth.signUp({
                email: internalEmail,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        username: username,
                        phone: phone,
                        role: 'influencer',
                        status: 'Ativo',
                        coupon: coupon.toUpperCase(),
                        workout_price: parseFloat(workoutPrice),
                        commission_value: parseFloat(commissionValue),
                        commission_per_user: parseFloat(commissionValue), // Mantendo compatibilidade com campo antigo se existir
                        pix_key: pixKey
                    }
                }
            });

            if (error) throw error;

            alert('Influenciador cadastrado com sucesso!');
            onBack();
        } catch (error: any) {
            alert('Erro ao cadastrar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight ml-2">Cadastrar Influenciador</h2>
                </header>
                <main className="flex-1 overflow-y-auto pb-32">
                    <div className="px-4 pt-6">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Dados do Parceiro</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Nome Completo</label>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="Nome do Influenciador"
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Telefone</label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Cupom de Identificação</label>
                                <div className="relative">
                                    <input
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase font-bold tracking-widest"
                                        placeholder="Ex: BRUNO10"
                                        type="text"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                                        <Icon name="sell" />
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 px-1">Este cupom será usado para rastrear as vendas e calcular as comissões deste influenciador.</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Chave Pix para Recebimento</label>
                                <input
                                    value={pixKey}
                                    onChange={(e) => setPixKey(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="E-mail, CPF ou Telefone"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-[#1c1c1c] my-6"></div>

                    <div className="px-4">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Financeiro da Parceria</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Valor do Treino (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">R$</span>
                                    <input
                                        value={workoutPrice}
                                        onChange={(e) => setWorkoutPrice(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold"
                                        placeholder="79.90"
                                        type="number"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Comissão (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-bold">R$</span>
                                    <input
                                        value={commissionValue}
                                        onChange={(e) => setCommissionValue(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold"
                                        placeholder="35.00"
                                        type="number"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-4 bg-gray-100 dark:bg-[#1c1c1c] my-6"></div>
                    <div className="px-4">
                        <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Credenciais de Acesso</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Usuário (Login)</label>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="usuario.influencer"
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-700 dark:text-gray-300 text-sm font-medium pb-2">Senha Provisória</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#282828] text-gray-900 dark:text-[#f0f0f0] h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="Digite a senha"
                                    type="password"
                                />
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-[#3a3a3a] z-20">
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg tracking-wider text-base transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'CADASTRANDO...' : 'CADASTRAR INFLUENCIADOR'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
