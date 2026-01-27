import React from 'react';
import { Icon } from './Icon';

export const ProfileHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
        <div className="relative">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20 border-2 border-primary" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANeNZUVtKlRv1f-VdcwLmwm7M1Zw5MoMCBFHJQeYT9TsedZcAd0wuMwA1ayOMkTF-9pZUm52hTp5fBsJgGlaRNOpyg8L_C-OTX_wMyt9GVEohDytdScroGXZMByO47XaCMx09Fi8TqBlzCRaoZhapP2arcPz_hljo_4cvKYg4GDFIPrwVGxecMUxRi_OXlWWP7Q5_bEqPvEoIo8gS4QgEln4God8y6sYvTobnSkHi-lWvFo68wAbWlWJN5OpAQHtJQZdza47DysKPt")' }}
          ></div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-surface-dark">
            PRO
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-xl font-bold leading-tight">João Silva</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Icon name="stars" className="text-primary text-sm" fill />
            <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-medium">1.250 Pontos</p>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              Plano Ativo
            </span>
          </div>
        </div>
      </div>

      <button className="flex items-center justify-between bg-card-nutrition hover:bg-[#323232] border border-white/5 p-4 rounded-xl shadow-lg transition-all active:scale-[0.98] w-full group">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Icon name="person_add" className="text-primary text-2xl" />
          </div>
          <span className="text-[#f0f0f0] font-bold text-sm tracking-widest uppercase">Convidar Amigo</span>
        </div>
        <Icon name="chevron_right" className="text-[#f0f0f0]/30 group-hover:text-[#f0f0f0] transition-colors" />
      </button>
    </>
  );
};