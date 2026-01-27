import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface RunMonitoringProps {
  onBack: () => void;
}

export const RunMonitoring: React.FC<RunMonitoringProps> = ({ onBack }) => {
  const [goal, setGoal] = useState(6.0);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(2535); // Começa em 42:15 para manter o visual original
  const [distance, setDistance] = useState(4.20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
        setDistance(prev => prev + 0.003); // Simula 12km/h aprox
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.min(100, Math.round((distance / goal) * 100));

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(parseFloat(e.target.value));
  };

  const adjustGoal = (amount: number) => {
    setGoal(prev => Math.max(1, Math.min(20, prev + amount)));
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleStop = () => {
    setIsActive(false);
    setSeconds(0);
    setDistance(0);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-white font-display min-h-screen flex flex-col">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div
          onClick={onBack}
          className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer"
        >
          <Icon name="arrow_back_ios" className="text-2xl" />
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Monitoramento</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
            <Icon name="settings" className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full max-w-md mx-auto px-6 justify-between py-6">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center circular-progress shadow-2xl transition-all">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Cronômetro</p>
              <p className="text-5xl sm:text-6xl font-extrabold text-white tabular-nums tracking-tight">{formatTime(seconds)}</p>
              <p className="text-sm font-medium text-primary mt-2">{progressPercentage}% do Objetivo</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-5xl font-bold text-white">{distance.toFixed(2)} <span className="text-2xl font-normal text-gray-400">km</span></p>
          </div>
        </div>

        <div className="my-6 w-full flex flex-col items-center bg-[#1f1f1f]/40 p-5 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Definir Meta</span>
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl font-black">{goal.toFixed(1)}</span>
              <span className="text-gray-94 text-sm font-bold uppercase">km</span>
            </div>
          </div>
          <div className="flex items-center w-full gap-4">
            <button
              onClick={() => adjustGoal(-0.5)}
              className="size-10 flex items-center justify-center rounded-full bg-[#2a2a2a] text-gray-94 hover:bg-primary transition-colors active:scale-90 border border-white/5"
            >
              <Icon name="remove" className="text-xl" />
            </button>
            <div className="relative flex-1 flex items-center h-8">
              <input
                className="w-full h-1.5 bg-gray-94 rounded-lg appearance-none cursor-pointer accent-primary"
                max="20"
                min="1"
                step="0.5"
                type="range"
                value={goal}
                onChange={handleGoalChange}
              />
            </div>
            <button
              onClick={() => adjustGoal(0.5)}
              className="size-10 flex items-center justify-center rounded-full bg-[#2a2a2a] text-gray-94 hover:bg-primary transition-colors active:scale-90 border border-white/5"
            >
              <Icon name="add" className="text-xl" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="flex flex-col gap-2 rounded-2xl p-4 bg-[#1f1f1f] border border-white/5 items-center text-center shadow-lg">
            <div className="flex items-center gap-1.5">
              <Icon name="speed" className="text-primary text-lg" />
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Km/h</p>
            </div>
            <p className="text-white tracking-tight text-xl font-bold leading-tight tabular-nums">12.5</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-4 bg-[#1f1f1f] border border-white/5 items-center text-center shadow-lg">
            <div className="flex items-center gap-1.5">
              <Icon name="pace" className="text-primary text-lg" />
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Pace</p>
            </div>
            <p className="text-white tracking-tight text-xl font-bold leading-tight tabular-nums">5'20"</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-4 bg-[#1f1f1f] border border-white/5 items-center text-center shadow-lg">
            <div className="flex items-center gap-1.5">
              <Icon name="local_fire_department" className="text-primary text-lg" />
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Calorias</p>
            </div>
            <p className="text-white tracking-tight text-xl font-bold leading-tight tabular-nums">340</p>
          </div>
        </div>

        <div className="space-y-4 pb-6">
          <button
            onClick={handleStart}
            disabled={isActive}
            className={`flex items-center justify-center overflow-hidden rounded-2xl h-18 py-5 px-5 ${isActive ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary shadow-primary/20'} text-white text-xl font-extrabold leading-normal tracking-[0.05em] w-full shadow-xl active:scale-[0.98] transition-all`}
          >
            <Icon name="play_arrow" className="mr-2 text-2xl" />
            <span className="truncate">INICIAR CORRIDA</span>
          </button>
          <button
            onClick={handlePause}
            disabled={!isActive}
            className={`flex items-center justify-center overflow-hidden rounded-2xl h-18 py-5 px-5 ${!isActive ? 'bg-[#282828]/50 cursor-not-allowed' : 'bg-[#282828] border-white/10'} text-white text-xl font-extrabold leading-normal tracking-[0.05em] w-full active:scale-[0.98] transition-all`}
          >
            <Icon name="pause" className="mr-2 text-2xl" />
            <span className="truncate">PAUSAR</span>
          </button>
          <button
            onClick={handleStop}
            className="flex items-center justify-center overflow-hidden rounded-2xl h-18 py-5 px-5 bg-[#1f1f1f] border border-white/10 text-white text-xl font-extrabold leading-normal tracking-[0.05em] w-full active:scale-[0.98] transition-all"
          >
            <Icon name="stop" className="mr-2 text-2xl" />
            <span className="truncate uppercase text-red-500">Parar</span>
          </button>
        </div>
      </div>
    </div>
  );
};