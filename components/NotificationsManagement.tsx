import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface NotificationsManagementProps {
    onBack: () => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    target_audience: 'all' | 'active' | 'influencers';
    created_at: string;
}

export const NotificationsManagement: React.FC<NotificationsManagementProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info' as const,
        target_audience: 'all' as const
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            alert('Por favor, preencha o título e a mensagem.');
            return;
        }

        try {
            setSending(true);
            const { error } = await supabase
                .from('notifications')
                .insert([{
                    title: formData.title,
                    message: formData.message,
                    type: formData.type,
                    target_audience: formData.target_audience
                }]);

            if (error) throw error;

            alert('Notificação disparada com sucesso para todos os usuários!');
            setFormData({ title: '', message: '', type: 'info', target_audience: 'all' });
            fetchNotifications();
        } catch (err: any) {
            console.error('Error sending notification:', err);
            alert('Erro ao enviar: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    const deleteNotification = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta notificação do histórico?')) return;
        try {
            const { error } = await supabase.from('notifications').delete().eq('id', id);
            if (error) throw error;
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    return (
        <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
            <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
                <div className="flex items-center p-4 justify-between w-full px-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                        >
                            <Icon name="arrow_back" />
                        </button>
                        <h2 className="text-xl font-bold tracking-tight uppercase italic text-white leading-none">Notificações em Massa</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-3 px-2 rounded-lg hover:bg-white/10 text-white transition-colors">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-bold uppercase leading-none">Administrador</p>
                                    <p className="text-[9px] text-slate-500 uppercase">Acesso Total</p>
                                </div>
                                <Icon name="account_circle" className="text-3xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Formulário de Envio */}
                <div className="lg:col-span-5 space-y-8">
                    <section className="bg-card-dark p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Icon name="campaign" className="text-8xl" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                                <Icon name="add_alert" className="text-primary" />
                                Nova Notificação
                            </h3>

                            <form onSubmit={handleSend} className="space-y-5">
                                <div>
                                    <label className="text-[10px] uppercase font-black text-slate-500 mb-1.5 block ml-1">Título da Mensagem</label>
                                    <input
                                        className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all outline-none"
                                        placeholder="Ex: Treino Novo Liberado! 🔥"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-black text-slate-500 mb-1.5 block ml-1">Mensagem (Corpo)</label>
                                    <textarea
                                        className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all outline-none resize-none min-h-[120px]"
                                        placeholder="Digite o texto que o usuário verá..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-500 mb-1.5 block ml-1">Tipo de Alerta</label>
                                        <div className="relative">
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                                className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:ring-2 focus:ring-primary outline-none w-full cursor-pointer"
                                            >
                                                <option value="info">Informação (Azul)</option>
                                                <option value="success">Sucesso (Verde)</option>
                                                <option value="warning">Aviso (Amarelo)</option>
                                                <option value="error">Urgente (Vermelho)</option>
                                            </select>
                                            <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-slate-500 mb-1.5 block ml-1">Público Alvo</label>
                                        <div className="relative">
                                            <select
                                                value={formData.target_audience}
                                                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value as any })}
                                                className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:ring-2 focus:ring-primary outline-none w-full cursor-pointer"
                                            >
                                                <option value="all">Todos os Usuários</option>
                                                <option value="active" disabled>Alunos Ativos (Breve)</option>
                                                <option value="influencers" disabled>Influenciadores (Breve)</option>
                                            </select>
                                            <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-primary hover:bg-[#b50031] text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
                                >
                                    {sending ? (
                                        <div className="animate-spin size-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    ) : (
                                        <>
                                            <Icon name="send" />
                                            Disparar Notificação
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>

                    <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-start gap-4">
                        <Icon name="info" className="text-primary mt-0.5" />
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                            As notificações são armazenadas no sistema e aparecerão para os usuários selecionados assim que eles abrirem o aplicativo ou navegarem entre as telas.
                        </p>
                    </div>
                </div>

                {/* Histórico */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Icon name="history" className="text-slate-500" />
                            Últimos Disparos
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{notifications.length} registros</span>
                    </div>

                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="animate-spin size-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto"></div>
                                <p className="text-xs uppercase font-bold text-slate-500 tracking-widest">Carregando histórico...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                <Icon name="cloud_off" className="text-4xl text-slate-600 mb-3" />
                                <p className="text-xs font-bold text-slate-500 uppercase">Nenhuma notificação enviada ainda</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className="bg-card-dark border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${notif.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                                                    notif.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                                        notif.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-red-500/10 text-red-500'
                                                }`}>
                                                <Icon name={
                                                    notif.type === 'info' ? 'info' :
                                                        notif.type === 'success' ? 'check_circle' :
                                                            notif.type === 'warning' ? 'warning' :
                                                                'error'
                                                } />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="text-sm font-black uppercase text-white">{notif.title}</h4>
                                                    <span className="text-[8px] font-black bg-white/5 px-1.5 py-0.5 rounded text-slate-500 uppercase">
                                                        Para: {notif.target_audience === 'all' ? 'Tudo' : notif.target_audience}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                                                <p className="text-[9px] text-slate-600 font-bold uppercase mt-3">
                                                    {new Date(notif.created_at).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteNotification(notif.id)}
                                            className="size-8 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-500 transition-all flex items-center justify-center"
                                        >
                                            <Icon name="delete" className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
            </div>
        </div>
    );
};
