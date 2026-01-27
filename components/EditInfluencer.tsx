import React from 'react';
import { Icon } from './Icon';

interface EditInfluencerProps {
  onBack: () => void;
}

export const EditInfluencer: React.FC<EditInfluencerProps> = ({ onBack }) => {
  return (
    <div className="bg-background-dark text-gray-94 min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <h2 className="text-xl font-bold tracking-tight uppercase italic text-white">Editar Influenciador</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
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
      <main className="flex-1 p-8 w-full max-w-5xl mx-auto space-y-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <section className="bg-card-dark/30 p-8 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Dados Pessoais</label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Nome Completo</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="Ex: Bruno Siqueira" type="text" defaultValue="Bruno Siqueira"/>
              </div>
              <div className="md:col-span-3">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">CPF</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="000.000.000-00" type="text" defaultValue="123.456.789-00"/>
              </div>
              <div className="md:col-span-3">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">WhatsApp</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="(00) 00000-0000" type="text" defaultValue="(11) 98765-4321"/>
              </div>
            </div>
          </section>
          <section className="bg-card-dark/30 p-8 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Configurações de Parceiro</label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Cupom Ativo</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-primary font-black focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="CUPOM10" type="text" defaultValue="BRUNO10"/>
              </div>
              <div className="md:col-span-4">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Comissão (R$)</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="0,00" type="text" defaultValue="50,00"/>
              </div>
              <div className="md:col-span-4">
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Chave Pix (Recebimento)</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 font-mono text-sm focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="E-mail, CPF ou Telefone" type="text" defaultValue="bruno.pix@gmail.com"/>
              </div>
            </div>
          </section>
          <section className="bg-card-dark/30 p-8 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Acesso ao Painel</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Usuário</label>
                <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="usuario_influencer" type="text" defaultValue="brunosiqueira_fit"/>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Senha</label>
                <div className="relative">
                  <input className="bg-card-dark border border-white/5 rounded-lg px-4 py-3 text-gray94 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" placeholder="********" type="password" defaultValue="senha_protegida"/>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-white transition-colors">
                    <Icon name="visibility" />
                  </span>
                </div>
              </div>
            </div>
          </section>
          <div className="pt-4 flex flex-col gap-4">
            <button className="w-full bg-primary hover:bg-[#b50031] text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/20" type="submit">
                Salvar Alterações
            </button>
            <button className="w-full bg-transparent hover:bg-white/5 text-slate-500 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all" type="button">
                Desativar Influenciador
            </button>
          </div>
        </form>
        <div className="text-center py-10">
          <h1 className="text-xl font-black text-white uppercase tracking-tight italic mb-2 opacity-50">Painel Administrativo</h1>
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-bold">Gestão de Dados do Parceiro</p>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[160px] rounded-full"></div>
      </div>
    </div>
  );
};