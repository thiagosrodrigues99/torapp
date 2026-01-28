import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface RecipesListProps {
  onBack: () => void;
  onRecipeClick: (id: string) => void;
}

interface Recipe {
  id: string;
  title: string;
  image_url: string;
  category_id: string;
  recipe_categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export const RecipesList: React.FC<RecipesListProps> = ({ onBack, onRecipeClick }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: catData } = await supabase.from('recipe_categories').select('*').order('name');
      if (catData) setCategories(catData);

      const { data: recData } = await supabase
        .from('recipes')
        .select('*, recipe_categories(name)')
        .order('created_at', { ascending: false });

      if (recData) setRecipes(recData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !selectedCat || r.category_id === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased font-jakarta">
      <div className="recipe-list-container flex flex-col min-h-screen pb-24 max-w-[450px] mx-auto">
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center p-4 justify-between">
            <div
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Icon name="arrow_back_ios_new" className="text-slate-900 dark:text-white" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 uppercase italic">Cardápio Fit</h2>
          </div>
        </header>

        <div className="px-4 py-2">
          <div className="relative">
            <button
              onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
              className="w-full flex items-center justify-between bg-card-dark border border-primary/20 rounded-xl px-4 py-3 text-white transition-colors active:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <Icon name="restaurant_menu" className="text-primary" />
                <span className="font-bold text-xs uppercase tracking-widest">{selectedCat ? categories.find(c => c.id === selectedCat)?.name : 'Todas as Categorias'}</span>
              </div>
              <Icon name="expand_more" className="text-primary" />
            </button>
            {isCatMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={() => { setSelectedCat(null); setIsCatMenuOpen(false); }}
                  className="w-full p-4 text-left text-xs font-bold uppercase tracking-widest hover:bg-primary/10 border-b border-white/5"
                >
                  Todas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCat(cat.id); setIsCatMenuOpen(false); }}
                    className="w-full p-4 text-left text-xs font-bold uppercase tracking-widest hover:bg-primary/10 border-b border-white/5"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="flex w-full items-stretch rounded-xl h-12 bg-slate-200 dark:bg-card-dark border border-white/5">
            <div className="text-primary flex items-center justify-center pl-4">
              <Icon name="search" />
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white px-4 text-sm font-medium"
              placeholder="Buscar receitas fit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pt-2 space-y-4 px-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4 opacity-50">
              <div className="size-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Carregando...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20 opacity-50 italic uppercase tracking-widest text-xs font-bold">
              Nada encontrado por aqui...
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => onRecipeClick(recipe.id)}
                className="flex flex-col items-stretch justify-start rounded-2xl shadow-xl bg-white dark:bg-card-dark overflow-hidden transition-all active:scale-[0.98] cursor-pointer border border-white/5"
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover relative"
                  style={{ backgroundImage: `url("${recipe.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400'}")` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                      {recipe.recipe_categories?.name || 'RECEITA'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 py-5 px-5">
                  <p className="text-slate-900 dark:text-white text-lg font-black leading-tight tracking-tight uppercase italic">{recipe.title}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#bc9aa3]">
                      <Icon name="schedule" className="text-primary text-base" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Preparo Médio</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#bc9aa3]">
                      <Icon name="local_fire_department" className="text-primary text-base" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Nutritivo</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-card-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-6 py-3 lg:hidden">
          <div className="flex justify-around items-center">
            <div onClick={onBack} className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer flex-1">
              <Icon name="home" />
              <span className="text-[10px] font-bold uppercase">Início</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-primary cursor-pointer flex-1">
              <Icon name="restaurant" />
              <span className="text-[10px] font-bold uppercase">Receitas</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer flex-1">
              <Icon name="groups" />
              <span className="text-[10px] font-bold uppercase">Comunidade</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};