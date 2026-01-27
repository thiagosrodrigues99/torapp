import React from 'react';
import { Icon } from './Icon';

interface CommissionPaymentProps {
  onBack: () => void;
}

export const CommissionPayment: React.FC<CommissionPaymentProps> = ({ onBack }) => {
  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center p-4 justify-between w-full px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <Icon name="arrow_back" />
            </button>
            <h2 className="text-lg font-bold tracking-tight uppercase italic text-white leading-tight">
              Pagar Comissão - Bruno Siqueira
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3 px-2 rounded-lg text-white">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase leading-none">Administrador</p>
                <p className="text-[9px] text-slate-500 uppercase">Acesso Total</p>
              </div>
              <Icon name="account_circle" className="text-3xl" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-8 w-full max-w-2xl mx-auto space-y-6">
        <div className="bg-card-dark p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pendente</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Valor Total a Pagar</p>
          <h1 className="text-5xl font-black text-primary tracking-tighter">R$ 1.250,00</h1>
        </div>
        <div className="bg-card-dark p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="size-12 rounded-full bg-slate-700 overflow-hidden ring-2 ring-primary/20">
              <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9eqzLjWMoEKw6Rf-IeFtwjc7fyq6qtwYC1wgjGo4D5Z6RRWtfdQLIz-tdNze5fxS9zfrPwEI5RyJFPoFJ21Azk-09wQ-ahVEfmujnYI3_i7W2kHTIHL4xPIisGIqbzZX3eYfVv08cYbPgZaBJIRZ72qSIaV49DaUUV_yb4HVxsb_fwhJRNfFacexASlA-xbno_C78HapiRGfzr_fFE_D58c44gpbmarMLWDX1hBegbyuDspEKyoSJ-Ugu9rHzKYFwO99yMfr28CWi"/>
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wide">Bruno Siqueira</p>
              <p className="text-xs text-slate-500">@brunosiqueira_fit</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Chave Pix para Pagamento</label>
              <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="font-mono text-sm text-slate-200">bruno.pix@gmail.com</span>
                <button className="text-primary hover:text-white transition-colors">
                  <Icon name="content_copy" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card-dark p-6 rounded-2xl border border-white/5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Upload de Comprovante</label>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group">
            <div className="size-14 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
              <Icon name="cloud_upload" className="text-3xl font-light" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white uppercase tracking-wide">Arraste o comprovante aqui</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1">Ou clique para selecionar (PDF, JPG, PNG)</p>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <button className="w-full bg-primary hover:bg-[#b50031] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3">
            <Icon name="check_circle" />
            Marcar como Pago
          </button>
        </div>
        <div className="text-center py-6">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-bold">Certifique-se de validar o comprovante antes de finalizar</p>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-xl bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};
