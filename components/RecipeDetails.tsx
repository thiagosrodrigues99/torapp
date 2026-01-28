import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface RecipeDetailsProps {
  recipeId: string;
  onBack: () => void;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  recipe_categories?: {
    name: string;
  };
}

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipeId, onBack }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*, recipe_categories(name)')
        .eq('id', recipeId)
        .single();

      if (error) throw error;
      setRecipe(data);
    } catch (err) {
      console.error(err);
      onBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="font-jakarta bg-background-dark text-text-main antialiased min-h-screen flex flex-col relative max-w-[450px] mx-auto pb-10">
      <section className="relative h-[380px] w-full shrink-0">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("${recipe.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600'}")` }}
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
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">{recipe.recipe_categories?.name || 'RECEITA FIT'}</p>
          <h1 className="text-3xl font-black leading-tight text-white mb-4 uppercase italic tracking-tighter shadow-black drop-shadow-lg">{recipe.title}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="schedule" className="text-primary text-xl" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">Saudável</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="local_fire_department" className="text-primary text-xl" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">Proteico</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 px-6 py-8 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="restaurant_menu" className="text-primary" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Como Preparar</h2>
          </div>
          <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 leading-relaxed whitespace-pre-wrap text-slate-300 text-sm font-medium">
            {recipe.description || 'Nenhum modo de preparo detalhado disponível para esta receita.'}
          </div>
        </section>

        <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
          <Icon name="emoji_events" className="text-primary text-4xl mb-2" />
          <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Dica de Chef</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Consuma imediatamente para aproveitar todos os nutrientes e o sabor fresco dos ingredientes!</p>
        </section>
      </main>
    </div>
  );
};