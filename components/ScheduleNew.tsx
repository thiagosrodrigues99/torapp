import React from 'react';
import { Icon } from './Icon';

interface ScheduleNewProps {
  onBack: () => void;
  onConfirm: () => void;
}

export const ScheduleNew: React.FC<ScheduleNewProps> = ({ onBack, onConfirm }) => {
  return (
    <div className="bg-background-dark text-gray-94 min-h-screen flex flex-col font-manrope">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors -ml-2"
          >
            <Icon name="chevron_left" className="text-white" />
          </button>
          <h1 className="flex-1 text-center mr-8 text-white text-lg font-bold tracking-tight">Agendar Novo</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 ml-1">Tipo de Atividade</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center pointer-events-none">
                <Icon name="edit" className="text-primary text-xl" />
              </div>
              <input 
                className="w-full h-14 rounded-2xl pl-16 pr-12 border border-gray-94/10 bg-input-bg text-gray-94 font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/50" 
                placeholder="Ex: Musculação, Yoga, etc." 
                type="text" 
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" 
                type="button"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 ml-1">Data</label>
              <div className="relative">
                <input 
                  className="w-full h-14 rounded-2xl px-4 border border-gray-94/10 bg-input-bg text-gray-94" 
                  type="date" 
                  defaultValue="2023-10-05"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 flex items-center">
                  <Icon name="calendar_month" className="text-sm" />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 ml-1">Horário</label>
              <div className="relative bg-input-bg rounded-2xl border border-gray-94/10 overflow-hidden h-[54px]">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[27px] border-t border-b border-primary/40 bg-primary/10"></div>
                <div className="flex h-full relative z-10">
                  <div className="flex-1 time-picker-column hide-scrollbar">
                    <div className="time-picker-item text-white/30 text-[10px]">07</div>
                    <div className="time-picker-item text-gray-94 font-bold text-sm">08</div>
                    <div className="time-picker-item text-white/30 text-[10px]">09</div>
                  </div>
                  <div className="flex items-center text-primary font-bold text-sm px-0.5">:</div>
                  <div className="flex-1 time-picker-column hide-scrollbar">
                    <div className="time-picker-item text-white/30 text-[10px]">15</div>
                    <div className="time-picker-item text-gray-94 font-bold text-sm">30</div>
                    <div className="time-picker-item text-white/30 text-[10px]">45</div>
                  </div>
                </div>
                <div className="absolute inset-0 time-picker-mask"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 ml-1">Local ou Observações</label>
            <div className="relative">
              <textarea 
                className="w-full rounded-2xl p-4 border border-gray-94/10 bg-input-bg text-gray-94 resize-none focus:outline-none" 
                placeholder="Ex: Academia Central, Sala 2..." 
                rows={4}
              ></textarea>
              <span className="absolute right-4 top-4 pointer-events-none text-white/40">
                <Icon name="notes" />
              </span>
            </div>
          </div>
        </form>
      </main>

      <footer className="p-6 bg-background-dark/80 backdrop-blur-xl">
        <button 
          onClick={onConfirm}
          className="w-full bg-primary hover:bg-[#c40034] active:scale-[0.98] transition-all h-14 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
        >
          <Icon name="add_task" className="text-white font-bold text-xl" />
          <span className="text-white font-extrabold tracking-widest text-sm">CONFIRMAR</span>
        </button>
      </footer>
    </div>
  );
};