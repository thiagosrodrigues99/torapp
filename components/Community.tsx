import React from 'react';
import { Icon } from './Icon';

interface CommunityProps {
  onBack: () => void;
}

export const Community: React.FC<CommunityProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-manrope">
      {/* Header */}
      <div className="flex items-center px-4 py-3 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
        <div 
          onClick={onBack}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Icon name="arrow_back_ios" className="text-2xl" />
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-6">Ranking Mensal</h2>
      </div>

      <main className="max-w-md mx-auto pb-24">
        {/* Trial Card */}
        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#1e0d11] p-4 shadow-sm border border-slate-200 dark:border-primary/20">
            <div className="flex flex-[2_2_0px] flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">Finalização do Teste Grátis</p>
                <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal leading-normal">Seu teste grátis termina em 2 dias. Assine agora para manter sua posição no ranking.</p>
              </div>
              <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal w-fit shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <span className="truncate">Assinar Agora</span>
              </button>
            </div>
            <div 
              className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-none border border-slate-100 dark:border-white/10" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI5P11NHvIDtpMFf7dTuT6eeix9CqepPmawdbFnaaGF2s7ntheoCjq67iHbmyvj68ayVcCgVejw2ACW5JHqC_lJWaSmzBiEO7fKdP7SO6MO_MPbrLBR1gHzAYJDBDp64MeWtEoPdLCHDdozw2hWh2f70D9Xv8krTTY9uSnwW1kpskrptzd6GfkpY6w4FKCKDw4OKyDn5OSR6ddGLUQGkjc4nIxnYIQ3Sp86moGR6LGVdY7d8x9-DecRhKd3gig3Fnug8GpTikUSJ2g")' }}
            >
            </div>
          </div>
        </div>

        {/* Leaders Section */}
        <div className="flex items-center justify-between px-4 pt-2 pb-2">
          <h3 className="text-slate-900 dark:text-white text-lg font-extrabold tracking-tight">Líderes do Mês</h3>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Ver Tudo</span>
        </div>

        <div className="flex flex-col">
          {/* Rank 1 */}
          <div className="flex items-center gap-4 px-4 min-h-[80px] py-2 border-b border-slate-100 dark:border-white/5 bg-primary/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-primary" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBL9LYg67qZ1rOu1TrNIrzoemIb08_q_GIybU8zyF777lF4_BFDtRmoGPLVqeZUxRlz6QtMdVnt1vgka1eTKpk9_uNrfoyK74SFdO9E1QX2-gkQLl7WuQl6FTPMiO_xVvuG8wvGXD_XMtAk-EWp3OuCxGopNe1cMJ5luOEWRHzmQSUJ1b36c51FiFdMDFqL2cP2sUIBR-HbxzK-glzkN6odcBd6dAL1IVmA-Bqy-P_CsWdd6xRt_wODzgio30190IepYXq1zGvSoBE3")' }}
                >
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  <Icon name="workspace_premium" className="text-[12px] text-white font-bold" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Ricardo Gomes</p>
                <p className="text-primary text-sm font-semibold leading-normal">1º lugar • 4.920 pts</p>
              </div>
            </div>
          </div>

          {/* Rank 2 */}
          <div className="flex items-center gap-4 px-4 min-h-[80px] py-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-6 text-slate-400 font-bold italic">2</div>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALzJTKgYxWaBZ9emxaHkaNVbHhZhXIA2OeDdtqt-TGN-qwOJ2JW1N0PQlzuPr_u3FlnHpJ4KR09NdhRPMrrxY4YuORvAYPnguLf5ynwZ1mkySw_pWAeVdKRBIM3BbFhN6IrtP7MAdDHH6LCRgkP4IpE4E4z46hw0LK1OHxqu1UlbWwBnor3lU7Bz8D4PedGpSOIJz7m6oBhWefjGo09siUdhO7_rgcfuobY9jMTyUkROqg1G1gJObZfrRtARGdi34fRsqoSoNekDqB")' }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Ana Beatriz</p>
                <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal leading-normal">2º lugar • 3.850 pts</p>
              </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex items-center gap-4 px-4 min-h-[80px] py-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-6 text-slate-400 font-bold italic">3</div>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcPEq6mPKMRsTBFzDNFmwX_RSD0dM4zHW_Wk9tf9RjLE5C25aU059a2v0Z6Wy8UoHleOnbqysqvABFvFZ4UoaBIgOODWKcTNdqkIxr3ua-9foaHjf_Ry7A_92F9Vp6HRDPcJBjawRDIh7gGb4a9gEmQz_5rHD5fN4p-jkConaC1xfH-dpHXUQTP8awJWZeFQnBwL8c1BsveIo1INR5JdjOq19sJMjk-V3rDwtqw29CRBzpDQgxLFNW6pXxPeMjT_1HVwib9AqjKCiV")' }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Lucas Silva</p>
                <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal leading-normal">3º lugar • 2.850 pts</p>
              </div>
            </div>
          </div>

          {/* User Rank 14 */}
          <div className="flex items-center gap-4 px-4 min-h-[80px] py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-6 text-primary font-extrabold italic">14</div>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 ring-2 ring-primary/30" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAE0riD_Re72IjCtyv5hS5ZPY7U3xz2ncTz0e8tpcN7QT7y019ET3QB5GXKIaVVpDpE7VuU8JS4ggQt0Hi2vg4B1xCptQe4ILLThl4WHqQLiOEjMvWva5ZAcKDDZk1WOM5jHgayIQAXP-Du2LqWQCxPb5XIIL-E_zxIBs4-jSPZeF8RHqiOSQxEYw3zNzfKEcr15ANK5kBorwhTC-7x-5OcbR1NjrZT1eQui_9vl3syPGJ9taaIOZ40SKa_LyzQpcK9YSIeqhCKbPLS")' }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Você (João)</p>
                <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal leading-normal">14º lugar • 1.210 pts</p>
              </div>
            </div>
          </div>

          {/* Rank 15 */}
          <div className="flex items-center gap-4 px-4 min-h-[80px] py-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-6 text-slate-400 font-bold italic">15</div>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfU31kSDkoXM0j6K1-qLEtLmEW6n_jRGQhncKG2wwY9qCQywz_xKChBkHIy8LHgahlU74TTaH8SwPI7sWef3DqVsD7bXiQmznDzqpkVtyUC2wXQ4SwUpiEkcsSAA9fXPlF5_0-6uVDQbcVOyJwADVtM7bqG7Fh7anBZYLOzjgAnqcPNQha5aGfTguACkslBDxKxedFSH1u9IAnCOqma3UHkYtWvoS4rfK933AX-ThNOifpewr9r1gU8HzRiyi-A65JNEmzdbplENMC")' }}
              >
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Carla Mendes</p>
                <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-normal leading-normal">15º lugar • 1.150 pts</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};