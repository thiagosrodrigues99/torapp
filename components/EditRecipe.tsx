import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface EditRecipeProps {
  recipeId: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface Category {
  id: string;
  name: string;
}

export const EditRecipe: React.FC<EditRecipeProps> = ({ recipeId, onBack, onSuccess }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Image State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, [recipeId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Load categories
      const { data: catData } = await supabase
        .from('recipe_categories')
        .select('*')
        .order('name');
      if (catData) setCategories(catData);

      // Load recipe
      const { data: recipe, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (error) throw error;

      setTitle(recipe.title);
      setDescription(recipe.description || '');
      setCategoryId(recipe.category_id || '');
      setImageUrl(recipe.image_url || '');
    } catch (err) {
      console.error('Error fetching recipe:', err);
      alert('Erro ao carregar dados da receita.');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
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

      setImageUrl(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erro ao subir imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !categoryId) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('recipes')
        .update({
          title,
          description,
          category_id: categoryId,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipeId);

      if (error) throw error;
      alert('Receita atualizada com sucesso!');
      onSuccess();
    } catch (err) {
      console.error('Error updating recipe:', err);
      alert('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      const { error } = await supabase
        .from('recipe_categories')
        .insert([{ name: newCategoryName }]);
      if (error) throw error;

      setNewCategoryName('');
      setIsCategoryModalOpen(false);

      // Refresh categories only
      const { data: catData } = await supabase
        .from('recipe_categories')
        .select('*')
        .order('name');
      if (catData) setCategories(catData);
    } catch (err) {
      alert('Erro ao criar categoria.');
    }
  };

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <div className="size-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white min-h-screen font-display pb-10">
      {/* Modal Overlay */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface-dark w-full max-w-[340px] rounded-2xl p-6 shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-6 text-white text-center text-primary">Nova Categoria</h3>
            <div className="space-y-6">
              <div className="flex flex-col w-full">
                <input
                  className="w-full rounded-lg border border-white/5 bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none text-white"
                  placeholder="Nome da categoria..."
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 h-12 rounded-lg font-bold text-sm text-gray-300 hover:bg-white/5 transition-colors border border-white/10"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleCreateCategory}
                  className="flex-1 h-12 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  SALVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center bg-background-dark p-4 border-b border-white/10 justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-primary hover:opacity-80 transition-opacity"
        >
          <Icon name="chevron_left" className="text-2xl" />
          <span className="text-base font-medium">Voltar</span>
        </button>
        <h2 className="text-lg font-bold leading-tight absolute left-1/2 -translate-x-1/2 uppercase tracking-widest italic">Editar Receita</h2>
        <div className="w-10"></div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="px-4 pt-6 text-center">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Informações da Receita</h2>
          <p className="text-gray-400 text-sm mt-1 uppercase italic tracking-wider font-bold">Base de Dados Fit</p>
        </div>

        <section className="mt-6 px-4">
          <div className="bg-surface-dark rounded-2xl p-5 space-y-5 border border-white/5 shadow-xl">
            <div className="flex flex-col w-full">
              <p className="text-sm font-bold pb-2 text-primary uppercase tracking-widest">Título</p>
              <input
                className="w-full rounded-lg border-none bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none text-white"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-bold pb-2 text-primary uppercase tracking-widest">Preparo</p>
              <textarea
                className="w-full rounded-lg border-none bg-[#3a272c] min-h-40 p-4 text-base focus:ring-2 focus:ring-primary outline-none text-white resize-none leading-relaxed"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-sm font-bold pb-2 text-primary uppercase tracking-widest">Categoria</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    className="appearance-none w-full rounded-lg border-none bg-[#3a272c] h-12 px-4 text-base focus:ring-2 focus:ring-primary outline-none pr-10 text-white"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
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
                  className="size-12 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Icon name="add" />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full text-center">
              <p className="text-sm font-bold pb-2 text-primary uppercase tracking-widest text-left">Capa da Receita</p>
              <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#3a272c]">
                {imageUrl ? (
                  <img alt="Preview" className="w-full h-48 object-cover transition-all duration-300 group-hover:brightness-50" src={imageUrl} />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-500 font-bold uppercase text-xs italic">Sem Imagem</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-primary px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-2 text-[10px] font-black hover:scale-105 transition-all text-white uppercase tracking-widest shadow-xl"
                  >
                    <Icon name={uploading ? "sync" : "cloud_upload"} className={uploading ? "animate-spin" : ""} />
                    {uploading ? "SUBINDO..." : "CADASTRAR FOTO"}
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};