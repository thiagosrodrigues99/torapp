import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface CheckoutManagementProps {
    onBack: () => void;
}

export const CheckoutManagement: React.FC<CheckoutManagementProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        title: 'Acesso VIP TorApp • Plano Mensal',
        description: 'Comece hoje sua jornada fitness. Acesso total a treinos personalizados, banco de exercícios, receitas e monitoramento de desempenho.',
        price: 79.90
    });

    // Load saved settings
    useEffect(() => {
        const saved = localStorage.getItem('torapp_checkout_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        setLoading(true);
        localStorage.setItem('torapp_checkout_settings', JSON.stringify(settings));

        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            alert('Configurações do Checkout salvas com sucesso!');
        }, 800);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center p-4 max-w-lg mx-auto gap-4">
                    <button
                        onClick={onBack}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <Icon name="arrow_back" />
                    </button>
                    <h1 className="text-lg font-bold leading-tight uppercase italic">Configurar Checkout</h1>
                </div>
            </header>

            <main className="flex-grow max-w-lg mx-auto px-4 py-8 w-full">
                <div className="space-y-8">
                    {/* Preview Card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Icon name="shopping_cart" className="text-6xl" />
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Preview do Checkout</p>
                        <h2 className="text-xl font-black text-white uppercase italic leading-tight mb-2">
                            {settings.title || 'Título do Checkout'}
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6 italic">
                            {settings.description || 'Descrição informativa do seu plano de treinos...'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-white">
                                {settings.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                Pagamento Único
                            </span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Título do Plano</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                                        <Icon name="title" />
                                    </div>
                                    <input
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-card-dark border border-white/10 text-white placeholder:text-slate-600 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                        placeholder="Ex: Plano TorApp VIP"
                                        type="text"
                                        value={settings.title}
                                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Descrição Detalhada</label>
                                <div className="relative group">
                                    <div className="absolute top-4 left-4 pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                                        <Icon name="description" />
                                    </div>
                                    <textarea
                                        className="w-full min-h-[120px] pl-12 pr-4 py-4 rounded-xl bg-card-dark border border-white/10 text-white placeholder:text-slate-600 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                                        placeholder="Descreva o que seu aluno recebe com este plano..."
                                        value={settings.description}
                                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Preço Padrão (R$)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                                        <Icon name="sell" />
                                    </div>
                                    <input
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-card-dark border border-white/10 text-white placeholder:text-slate-600 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                        placeholder="79.90"
                                        type="number"
                                        step="0.01"
                                        value={settings.price}
                                        onChange={(e) => setSettings({ ...settings, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <p className="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium italic">
                                    * Este é o preço base para usuários comuns. Influenciadores podem ter preços customizados.
                                </p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs italic flex items-center justify-center gap-3"
                            >
                                {loading ? <Icon name="sync" className="animate-spin" /> : <Icon name="save" />}
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="p-8 text-center border-t border-slate-200 dark:border-white/5 mt-auto">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">Checkout Engine • TorApp v2.0</p>
            </footer>
        </div>
    );
};
