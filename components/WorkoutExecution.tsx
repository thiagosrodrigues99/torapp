import React from 'react';
import { Icon } from './Icon';

interface WorkoutExecutionProps {
  onBack: () => void;
  onFinish: () => void;
}

export const WorkoutExecution: React.FC<WorkoutExecutionProps> = ({ onBack, onFinish }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col font-manrope">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div 
          aria-label="Voltar" 
          className="text-white flex size-12 shrink-0 items-center cursor-pointer"
          onClick={onBack}
        >
          <Icon name="arrow_back_ios_new" className="text-3xl" />
        </div>
        <h2 className="text-black dark:text-white text-lg font-extrabold leading-tight tracking-tight flex-1 text-center pr-12 font-display uppercase italic">
          Execução de Treino
        </h2>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sessão Iniciante</p>
          <p className="text-primary text-sm font-extrabold leading-normal">65%</p>
        </div>
        <div className="rounded-full bg-gray-800 h-2.5 overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: '65%' }}></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <h1 className="text-white tracking-tight text-3xl font-extrabold leading-tight text-center font-display">
            Agachamento Livre
          </h1>
          <div className="flex justify-center gap-2 mt-3">
            <div className="flex h-7 items-center justify-center gap-x-2 rounded-full bg-primary/20 border border-primary/30 px-4">
              <p className="text-primary text-[10px] font-bold uppercase tracking-wider">Quadríceps</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div 
            className="relative flex items-center justify-center bg-[#1a0d11] bg-cover bg-center aspect-square rounded-xl overflow-hidden border border-white/5 shadow-2xl shadow-primary/10" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCF7pHkgIjVfbhr2N_AqYoU1OH5LAkeyS9jySo5nr45rn1dfryjfLXIhTAZUMKhZ-2wzSiF1iKvZbmYfjQ3brQgQJsOPyP0SF8U3XN8Gk6I0WtJVpOBXio2A4V_V8kpZrcBGle3jvvBk4cz_CPZJWPqlADmqNKuTS_nHeiSE6dcb2R9TI_OuTM5wBnDsTI_mdtarZH7gfPPBKSVfAmFeXexortJuY8-i9joAtsUBIh_4iFsTHW58OJQsSW8sOfMYKdBRVbxWSP-qzsQ")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <button className="relative z-10 flex shrink-0 items-center justify-center rounded-full size-20 bg-primary/90 text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Icon name="play_arrow" className="!text-4xl translate-x-1" />
            </button>
            <div className="absolute bottom-4 right-4 flex justify-end items-center">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span className="text-white text-sm font-bold uppercase">Série 2 de 4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 mb-4">
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-4 rounded-r-lg">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-700 overflow-hidden border border-primary/40">
                <img 
                  alt="Influencer" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlJip-lBAdz2pMkfhGwAd1F6MXnevH2hxrT3mV6oMom_UGVn9ncolLl5Dzxko6SapphUuuAKIO_OoRId-CQ5N2RZbcevclvxSwiczjJTdpM0Uz6gnZLlQL8vor_K2VV0IiP6PgIDOSuRda1mQyKJjciIVMJj8DfuwAINunyHAXYAUm-kIhxrQ0A5mHuwV0FYR16gu9rBIlrA9f7tS7WcnN0nKrLi82no9ZeOaXKSqKibKRUulvwfOBWvz0zEy-UUPb97xTq7KwRgkw"
                />
              </div>
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-tighter">Treino Especial</p>
                <p className="text-white text-sm font-medium">Você ganhou esse treino da <span className="font-extrabold">@influenciadora</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="p-6 pt-2 pb-10 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-white/10 border border-white/10 active:scale-95 transition-all"
          >
            <Icon name="stop_circle" className="text-white" />
            <span className="text-white font-extrabold uppercase tracking-widest text-sm">Parar</span>
          </button>
          <button 
            onClick={onFinish}
            className="flex-[2] flex items-center justify-center gap-2 h-14 rounded-xl bg-primary shadow-lg shadow-primary/30 active:scale-95 transition-all"
          >
            <Icon name="check_circle" className="text-white" />
            <span className="text-white font-extrabold uppercase tracking-widest text-sm">Concluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};