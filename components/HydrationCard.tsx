import React, { useState } from 'react';
import { Icon } from './Icon';

export const HydrationCard: React.FC = () => {
  const [waterLevel, setWaterLevel] = useState(1.5);
  const maxWater = 3.0;
  const percentage = Math.min((waterLevel / maxWater) * 100, 100);

  const addWater = () => {
    setWaterLevel(prev => Math.min(prev + 0.25, maxWater));
  };

  return (
    <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-surface-dark p-5 shadow-sm border border-slate-100 dark:border-white/5">
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="opacity" className="text-blue-500 text-lg" />
            <p className="text-base font-bold leading-tight">Meta de Água</p>
          </div>
          <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal">
            {waterLevel.toFixed(1)}L de {maxWater.toFixed(1)}L
          </p>
        </div>
        <div className="mt-4">
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <button 
            onClick={addWater}
            className="flex items-center justify-center rounded-lg h-10 px-4 bg-blue-500/10 text-blue-500 gap-2 text-sm font-bold w-full active:scale-95 transition-transform hover:bg-blue-500/20"
          >
            <Icon name="add" className="text-lg" />
            <span className="truncate">Adicionar 250ml</span>
          </button>
        </div>
      </div>
      <div 
        className="w-32 bg-center bg-no-repeat aspect-square bg-contain flex items-center justify-center bg-blue-500/5 rounded-xl border border-blue-500/10" 
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBShVvjEur9hZfcEE6wYioT09LPrsOSl7N4kMYfZOGpjisXXsOJWkoQN-KquVEh6Z6kW7EzGnxAj1VdQFX0WO4_LdheQOanQUtMbz4ltXicTH3_wLttf5-bYcCTwNHLzcSRajTLe9n9FTB04Jv2_p-iPuRTqwcrOBMmaiHp7JHg2eHqG0mmgSEgJWcr__IzSm9HOITmRZqGIbuDdp8VTGEZEJ9hoUpAD-_00MZbc6GGplzj-PGidcYxPD-goHcgklpXSCzAN7h81KlU")' }}
      ></div>
    </div>
  );
};