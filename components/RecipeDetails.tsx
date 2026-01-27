import React from 'react';
import { Icon } from './Icon';

interface RecipeDetailsProps {
  onBack: () => void;
}

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({ onBack }) => {
  return (
    <div className="font-jakarta bg-background-dark text-text-main antialiased min-h-screen flex flex-col relative max-w-[450px] mx-auto">
      <section className="relative h-[380px] w-full shrink-0">
        <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-cover" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAayopf32A3rAZFqc2iO8ZEwR5JKN8KGOcLJkSfU8LDUXwp9uH7Zrx9BA8_qSQ_JP5NoCv023xnr4Gg_qMbEIGREFM33Gkyp9GIjm2ntzoG6dzAcHONz07QOHQL5u0gogDX9VcofQLkuYowt1GWs-_A1TTSLWdlk11qMlnr-ydpHu8vVxmEtu8oOVUJ82MYnITA1B_CpR4gl8GsdwsT566jdr_pALOLSKF01sRjM9mFySUkqMbpBK-15cm0JUDlyh_1-lcPjDSoo704")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/30"></div>
        </div>
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <Icon name="arrow_back_ios_new" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform">
             <Icon name="favorite" className="fill-0 hover:fill-1 text-primary transition-colors" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold leading-tight text-white mb-4">Frango Grelhado com Legumes</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="schedule" className="text-primary text-xl" />
              <span className="text-sm font-medium">20 min</span>
            </div>
            <div className="flex items-center gap-2">
               <Icon name="local_fire_department" className="text-primary text-xl" />
              <span className="text-sm font-medium">350 kcal</span>
            </div>
            <div className="flex items-center gap-2">
               <Icon name="signal_cellular_alt" className="text-primary text-xl" />
              <span className="text-sm font-medium">Fácil</span>
            </div>
          </div>
        </div>
      </section>
      
      <main className="flex-1 px-6 py-8 space-y-8 pb-12">
        <section>
          <div className="flex items-center gap-2 mb-4">
             <Icon name="shopping_basket" className="text-primary" />
            <h2 className="text-xl font-bold text-primary">Ingredientes</h2>
          </div>
          <div className="bg-card-dark rounded-2xl p-4 space-y-4">
            {[
                "200g de peito de frango em cubos",
                "1 brócolis pequeno picado",
                "1 cenoura média em rodelas",
                "2 dentes de alho picados",
                "Azeite de oliva, sal e pimenta"
            ].map((item, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer group select-none">
                    <input className="peer appearance-none w-5 h-5 rounded border-2 border-primary bg-transparent checked:bg-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer" type="checkbox"/>
                    <span className="text-sm font-medium transition-all peer-checked:text-primary peer-checked:line-through peer-checked:opacity-50">{item}</span>
                </label>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="restaurant_menu" className="text-primary" />
            <h2 className="text-xl font-bold text-primary">Modo de Preparo</h2>
          </div>
          <div className="space-y-6">
            {[
                "Tempere o frango com sal, pimenta e alho picado. Deixe marinar por 5 minutos.",
                "Em uma frigideira antiaderente, aqueça um fio de azeite e grelhe o frango até dourar.",
                "Adicione a cenoura e o brócolis. Refogue em fogo médio com a frigideira tampada por 5-7 minutos.",
                "Finalize com ervas frescas se desejar e sirva imediatamente enquanto estiver quente."
            ].map((step, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-white">{index + 1}</div>
                    <p className="text-sm leading-relaxed text-slate-300">{step}</p>
                </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};