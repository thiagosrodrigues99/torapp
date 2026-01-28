import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { EditRecipe } from './EditRecipe';
import { supabase } from '../lib/supabase';

interface Recipe {
  id: string;
  title: string;
  description: string;
  category_id: string;
  image_url: string;
  created_at: string;
  recipe_categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface RecipesManagementProps {
  onBack: () => void;
}

export const RecipesManagement: React.FC<RecipesManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for data
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: catData } = await supabase
        .from('recipe_categories')
        .select('*')
        .order('name');

      if (catData) setCategories(catData);

      const { data: recData } = await supabase
        .from('recipes')
        .select('*, recipe_categories(name)')
        .order('created_at', { ascending: false });

      if (recData) setRecipes(recData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `recipe-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  const handleCreateRecipe = async () => {
    if (!newTitle || !newCategoryId) {
      alert('Por favor, preencha o título e a categoria.');
      return;
    }

    try {
      setSaving(true);
      let imageUrl = '';

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from('recipes')
        .insert([{
          title: newTitle,
          description: newDescription,
          category_id: newCategoryId,
          image_url: imageUrl
        }]);

      if (error) throw error;

      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewCategoryId('');
      setImageFile(null);
      setImagePreview(null);

      fetchData();
      alert('Receita cadastrada com sucesso!');
    } catch (err) {
      console.error('Error creating recipe:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('recipe_categories')
        .insert([{ name: newCategoryName }]);

      if (error) throw error;

      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Erro ao criar categoria. Talvez ela já exista?');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || r.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (view === 'edit' && selectedRecipeId) {
    return (
      <EditRecipe
        recipeId={selectedRecipeId}
        onBack={() => setView('list')}
        onSuccess={() => {
          setView('list');
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen font-display">
      {/* Modal Overlay */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-dark w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-4 text-white">Nova Categoria</h3>
            <div className="space-y-4">
              <div className="flex flex-col w-full">
                <p className="text-xs font-medium pb-2 text-gray-400">Nome da Categoria</p>
                <input
                  className="w-full rounded-lg border-none bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none placeholder:text-[#bc9aa3] text-white"
                  placeholder="Ex: Veganas"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 flex items-center justify-center h-12 rounded-lg font-bold text-sm text-gray-400 hover:bg-white/5 transition-colors"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleCreateCategory}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center h-12 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {saving ? '...' : 'SALVAR'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-gray-200 dark:border-white/10 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors"
          >
            <Icon name="arrow_back_ios_new" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Gestão de Receitas</h2>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-20">
        <div className="px-4 pt-6">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Nova Receita Fit</h2>
        </div>

        <section className="mt-4 px-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm space-y-4 border border-gray-100 dark:border-transparent">
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Título</p>
              <input
                className="w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3]"
                placeholder="Ex: Omelete de Espinafre"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Preparo</p>
              <textarea
                className="w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] min-h-32 p-4 text-base focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-400 dark:placeholder:text-[#bc9aa3] resize-none"
                placeholder="Descreva o passo a passo..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Categoria</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    className="appearance-none w-full rounded-lg border-none bg-gray-100 dark:bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none pr-10 text-gray-900 dark:text-white"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <Icon name="expand_more" />
                  </div>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="size-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/10"
                >
                  <Icon name="add" />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2 text-gray-700 dark:text-gray-300">Imagem da Receita</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl min-h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-[#3a272c]/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3a272c]/50 transition-colors overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <Icon name="add_a_photo" className="text-4xl text-gray-400 dark:text-white/40" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Selecionar imagem</span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <button
              onClick={handleCreateRecipe}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors mt-2 text-base uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {saving ? 'CADASTRANDO...' : 'CADASTRAR RECEITA'}
            </button>
          </div>
        </section>

        <div className="h-8"></div>

        <div className="px-4">
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Receitas do Sistema</h2>
        </div>

        <div className="px-4 mt-4 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="search" />
            </span>
            <input
              className="w-full rounded-lg border-none bg-white dark:bg-surface-dark h-11 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-400 border border-gray-100 dark:border-transparent shadow-sm shadow-black/5"
              placeholder="Buscar..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-11 px-4 flex items-center gap-2 bg-white dark:bg-surface-dark border rounded-lg shadow-sm text-sm font-medium transition-all ${filterCategory ? 'border-primary text-primary' : 'border-gray-100 dark:border-transparent text-gray-900 dark:text-white'}`}
            >
              <Icon name="filter_list" />
              <span className="hidden sm:inline">{filterCategory ? categories.find(c => c.id === filterCategory)?.name : 'Todos'}</span>
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                <div className="p-1 flex flex-col">
                  <button
                    onClick={() => { setFilterCategory(null); setIsFilterOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-left transition-colors ${!filterCategory ? 'bg-primary text-white font-bold' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    Todas
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setFilterCategory(cat.id); setIsFilterOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-left transition-colors ${filterCategory === cat.id ? 'bg-primary text-white font-bold' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 px-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3 opacity-50">
              <div className="size-8 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Carregando...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-10 opacity-50 italic">
              Nenhuma receita encontrada.
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <RecipeItem
                key={recipe.id}
                title={recipe.title}
                category={recipe.recipe_categories?.name || 'Sem Categoria'}
                image={recipe.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200'}
                onEdit={() => {
                  setSelectedRecipeId(recipe.id);
                  setView('edit');
                }}
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const RecipeItem = ({ title, category, image, onEdit, onDelete }: { title: string, category: string, image: string, onEdit?: () => void, onDelete?: () => void, key?: string }) => (
  <div className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-transparent group">
    <div className="size-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
      <img alt="Receita" className="w-full h-full object-cover" src={image} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-sm truncate text-gray-900 dark:text-white">{title}</h3>
      <p className="text-[10px] text-primary font-black mt-0.5 uppercase tracking-wider">{category}</p>
    </div>
    <div className="flex items-center gap-1">
      <button
        onClick={onEdit}
        className="size-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-primary transition-colors"
      >
        <Icon name="edit" className="text-lg" />
      </button>
      <button
        onClick={onDelete}
        className="size-9 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
      >
        <Icon name="delete" className="text-lg" />
      </button>
    </div>
  </div>
);