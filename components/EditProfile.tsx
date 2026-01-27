import React from 'react';
import { Icon } from './Icon';

interface EditProfileProps {
  onBack: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ onBack }) => {
  return (
    <div className="bg-background-dark text-white min-h-screen flex flex-col font-sans">
      <div className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center text-primary active:opacity-60 transition-opacity"
          >
            <Icon name="arrow_back_ios" className="text-2xl" />
            <span className="text-sm font-medium -ml-1">Voltar</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">Editar Perfil</h2>
        </div>
      </div>
      <div className="flex-1 w-full max-w-md mx-auto px-6 pb-32">
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="relative">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-2 border-primary" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANeNZUVtKlRv1f-VdcwLmwm7M1Zw5MoMCBFHJQeYT9TsedZcAd0wuMwA1ayOMkTF-9pZUm52hTp5fBsJgGlaRNOpyg8L_C-OTX_wMyt9GVEohDytdScroGXZMByO47XaCMx09Fi8TqBlzCRaoZhapP2arcPz_hljo_4cvKYg4GDFIPrwVGxecMUxRi_OXlWWP7Q5_bEqPvEoIo8gS4QgEln4God8y6sYvTobnSkHi-lWvFo68wAbWlWJN5OpAQHtJQZdza47DysKPt")' }}
            >
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-4 border-background-dark active:scale-95 transition-transform">
              <Icon name="photo_camera" className="text-xl" />
            </button>
          </div>
          <p className="mt-4 text-xl font-bold">João Silva</p>
          <p className="text-slate-400 text-sm">Alterar foto de perfil</p>
        </div>
        <form className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Nome Completo</label>
            <input className="w-full h-14 bg-input-bg border border-input-border/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-white font-medium outline-none transition-all" type="text" defaultValue="João Silva"/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">E-mail</label>
            <input className="w-full h-14 bg-input-bg border border-input-border/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-white font-medium outline-none transition-all" type="email" defaultValue="joao.silva@email.com"/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Telefone</label>
            <input className="w-full h-14 bg-input-bg border border-input-border/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-white font-medium outline-none transition-all" type="tel" defaultValue="(11) 98765-4321"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Peso (kg)</label>
              <input className="w-full h-14 bg-input-bg border border-input-border/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-white font-medium outline-none transition-all" type="number" defaultValue="82"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Altura (cm)</label>
              <input className="w-full h-14 bg-input-bg border border-input-border/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-white font-medium outline-none transition-all" type="number" defaultValue="185"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Data de Nascimento</label>
            <input className="w-full h-14 bg-input-bg border border-input-border/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-white font-medium outline-none transition-all" type="date" defaultValue="1995-05-15"/>
          </div>
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-dark/80 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="w-full h-14 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-primary/20 tracking-wider"
          >
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
};