import React from 'react';
import { Icon } from './Icon';

interface AgendaProps {
  onBack: () => void;
  onScheduleClick?: () => void;
}

export const Agenda: React.FC<AgendaProps> = ({ onBack, onScheduleClick }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-manrope">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Icon name="chevron_left" className="text-white" />
          </div>
          <h1 className="text-[#f0f0f0] text-lg font-bold tracking-tight">Agenda</h1>
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors">
            <Icon name="notifications" className="text-white" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pb-48">
        {/* Horizontal Calendar Selection */}
        <section className="mt-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#f0f0f0] text-base font-bold">Outubro 2023</h2>
            <Icon name="calendar_month" className="text-primary text-sm" />
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {[
              { day: 'Seg', date: '02' },
              { day: 'Ter', date: '03' },
              { day: 'Qua', date: '04' },
              { day: 'Qui', date: '05', active: true },
              { day: 'Sex', date: '06' },
              { day: 'Sáb', date: '07' },
              { day: 'Dom', date: '08' },
            ].map((item, index) => (
              <button 
                key={index}
                className={`flex flex-col items-center justify-center min-w-[58px] h-20 rounded-xl border ${
                  item.active 
                    ? 'bg-primary shadow-lg shadow-primary/20 border-transparent' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className={`text-xs font-medium uppercase ${item.active ? 'text-white/80' : 'text-white/50'}`}>{item.day}</span>
                <span className={`text-lg font-bold ${item.active ? 'text-white' : ''}`}>{item.date}</span>
                {item.active && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
              </button>
            ))}
          </div>
        </section>

        {/* Time Selector Section */}
        <section className="mt-6 px-4">
          <h3 className="text-[#f0f0f0] text-base font-bold mb-3 tracking-tight">Horários Disponíveis</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'].map((time, index) => {
               const active = time === '08:00';
               return (
                <div key={index} className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
                  active ? 'bg-primary' : 'bg-white/5 border border-white/10'
                }`}>
                  <p className={`text-sm leading-normal ${active ? 'text-white font-bold' : 'text-[#f0f0f0] font-medium'}`}>{time}</p>
                </div>
               );
            })}
          </div>
        </section>

        {/* My Appointments Section */}
        <section className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#f0f0f0] text-base font-bold tracking-tight">Meus Compromissos</h3>
            <span className="text-xs text-white/40 font-medium">2 ATIVIDADES</span>
          </div>
          <div className="flex flex-col gap-4">
            {/* Appointment Card 1 */}
            <div className="flex gap-4 p-4 rounded-xl bg-white/5 border-l-4 border-primary">
              <div className="flex flex-col items-center justify-start py-1">
                <span className="text-sm font-bold text-white">08:30</span>
                <span className="text-[10px] text-white/40 uppercase">AM</span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm">Treino de Pernas e Glúteos</h4>
                  <Icon name="more_horiz" className="text-white/30 text-lg" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Icon name="timer" className="text-primary text-xs" />
                    <span className="text-xs text-white/60">50 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="fitness_center" className="text-primary text-xs" />
                    <span className="text-xs text-white/60">Academia Central</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Appointment Card 2 */}
            <div className="flex gap-4 p-4 rounded-xl bg-white/5 border-l-4 border-white/20">
              <div className="flex flex-col items-center justify-start py-1">
                <span className="text-sm font-bold text-white">14:00</span>
                <span className="text-[10px] text-white/40 uppercase">PM</span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm">Consulta Nutricionista</h4>
                  <Icon name="more_horiz" className="text-white/30 text-lg" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Icon name="video_call" className="text-primary text-xs" />
                    <span className="text-xs text-white/60">Chamada de vídeo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="medical_services" className="text-primary text-xs" />
                    <span className="text-xs text-white/60">Dra. Amanda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Area positioned above BottomNavigation */}
      <div className="fixed bottom-[88px] left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-40">
        <button 
          onClick={onScheduleClick}
          className="w-full bg-primary hover:bg-[#c40034] active:scale-95 transition-all h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
        >
          <Icon name="add" className="text-white font-bold" />
          <span className="text-white font-extrabold tracking-widest text-sm">AGENDAR NOVO</span>
        </button>
      </div>
    </div>
  );
};