import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  category: string;
  video_url?: string;
  gif_url?: string;
  image_url?: string; // Fallback for the UI
}

interface ExerciseBankProps {
  onBack: () => void;
}

export const ExerciseBank: React.FC<ExerciseBankProps> = ({ onBack }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(['Pernas', 'Peitoral', 'Costas', 'Ombros', 'Braços', 'Abdominais', 'Cardio']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const generateThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            cleanup();
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            cleanup();
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          }, 'image/png');
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      img.onerror = () => {
        cleanup();
        reject(new Error('Failed to load image for thumbnail'));
      };

      img.src = url;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const baseFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const fileName = `${baseFileName}.${fileExt}`;
      const filePath = `gifs/${fileName}`;

      // 1. Upload do Arquivo para o Storage
      const { error: uploadError } = await supabase.storage
        .from('exercise-gifs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Gerar a URL Pública permanente
      const { data: publicUrlData } = supabase.storage
        .from('exercise-gifs')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      console.log('Link do GIF gerado com sucesso:', publicUrl);

      setGifUrl(publicUrl);
      setThumbnailUrl(publicUrl); // Define a miniatura como o próprio GIF por padrão

      // 3. Tentar gerar uma miniatura menor se for possível, mas sem bloquear
      try {
        const thumbBlob = await generateThumbnail(file);
        const thumbPath = `thumbnails/${baseFileName}_thumb.png`;

        const { error: thumbError } = await supabase.storage
          .from('exercise-gifs')
          .upload(thumbPath, thumbBlob);

        if (!thumbError) {
          const { data: thumbData } = supabase.storage
            .from('exercise-gifs')
            .getPublicUrl(thumbPath);
          setThumbnailUrl(thumbData.publicUrl);
        }
      } catch (thumbErr) {
        console.warn('Miniatura automática pulada, usando URL original.');
      }

    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert('Erro ao processar o arquivo: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exercise_bank')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setExercises(data || []);

      if (data) {
        const uniqueCategories = Array.from(new Set([
          ...categories,
          ...data.map((ex: any) => ex.category).filter(Boolean)
        ]));
        setCategories(uniqueCategories.sort());
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !category) {
      alert('Preencha pelo menos o nome e a categoria.');
      return;
    }

    if (uploading) {
      alert('Aguarde o upload do GIF terminar.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        category,
        gif_url: gifUrl,
        thumbnail_url: thumbnailUrl || gifUrl,
      };

      let result;
      if (editingId) {
        result = await supabase
          .from('exercise_bank')
          .update(payload)
          .eq('id', editingId);
      } else {
        result = await supabase
          .from('exercise_bank')
          .insert([payload]);
      }

      if (result.error) throw result.error;

      setName('');
      setCategory('');
      setGifUrl('');
      setThumbnailUrl('');
      setEditingId(null);
      await fetchExercises();
      alert(editingId ? 'Exercício atualizado!' : 'Exercício cadastrado com sucesso!');
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      alert('Erro ao salvar: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

    try {
      const { error } = await supabase
        .from('exercise_bank')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchExercises();
    } catch (error: any) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  const handleEdit = (ex: any) => {
    setEditingId(ex.id);
    setName(ex.name);
    setCategory(ex.category);
    setGifUrl(ex.gif_url || '');
    setThumbnailUrl(ex.thumbnail_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updated = [...categories, newCategory].sort();
      setCategories(updated);
      setCategory(newCategory);
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const filteredExercises = exercises.filter(ex =>
    (ex.name && ex.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ex.category && ex.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen font-display">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex items-center bg-[#141414] border-b border-[#281b1e] p-4 justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={onBack}
            className="text-white flex size-10 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
          >
            <Icon name="arrow_back" />
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Banco de Exercícios</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-[#281b1e] text-white hover:bg-white/10 transition-colors">
            <Icon name="account_circle" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-10">
        {/* HeadlineText: Form Section */}
        <div className="px-4 pt-6">
          <h3 className="text-white tracking-tight text-2xl font-bold leading-tight">
            {editingId ? 'Editar Exercício' : 'Cadastrar Novo Exercício'}
          </h3>
          <p className="text-[#bc9aa3] text-sm mt-1">
            {editingId ? 'Alterando informações do exercício selecionado' : 'Adicione novos itens à sua base de dados'}
          </p>
        </div>

        {/* Form Container */}
        <div className="flex flex-col gap-1 mt-4">
          {/* TextField: Título */}
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Título do Exercício</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#563941] bg-[#1e1e1e] focus:border-primary h-14 placeholder:text-[#bc9aa3] p-[15px] text-base font-normal leading-normal transition-all"
                placeholder="Ex: Agachamento Livre"
                type="text"
              />
            </label>
          </div>

          {/* TextField: Grupo Muscular with Add Action */}
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <div className="flex justify-between items-center pb-2">
                <p className="text-white text-base font-medium leading-normal">Grupo Muscular</p>
                <button
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-primary text-sm flex items-center gap-1 font-bold hover:text-white transition-colors"
                >
                  <Icon name={isAddingCategory ? "close" : "add_circle"} className="text-sm" />
                  {isAddingCategory ? "Cancelar" : "Novo"}
                </button>
              </div>

              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-input flex-1 rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-primary bg-[#1e1e1e] h-14 px-4 transition-all"
                    placeholder="Nome do Grupo"
                    autoFocus
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-primary text-white size-14 rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all font-bold"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#563941] bg-[#1e1e1e] focus:border-primary h-14 placeholder:text-[#bc9aa3] p-[15px] text-base font-normal leading-normal transition-all"
                  >
                    <option value="">Selecione um grupo</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#bc9aa3]">
                    <Icon name="expand_more" />
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="px-4 py-3">
            <p className="text-white text-base font-medium leading-normal pb-2">Demonstração (GIF)</p>
            <div className="relative">
              {!gifUrl ? (
                <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#563941] bg-[#1e1e1e]/50 px-6 py-10 transition-colors hover:bg-[#1e1e1e] cursor-pointer group relative">
                  <input
                    type="file"
                    accept="image/gif"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Icon name={uploading ? "refresh" : "cloud_upload"} className={`text-primary text-4xl mb-2 ${uploading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                    <p className="text-white text-lg font-bold leading-tight tracking-tight text-center">
                      {uploading ? 'Enviando GIF...' : 'Upload de GIF'}
                    </p>
                    <p className="text-[#bc9aa3] text-sm font-normal leading-normal text-center">Arraste e solte ou toque para selecionar</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-[#563941] bg-[#1e1e1e]">
                  <img src={gifUrl} alt="Preview" className="w-full h-48 object-contain" />
                  <button
                    onClick={() => setGifUrl('')}
                    className="absolute top-2 right-2 size-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                  >
                    <Icon name="close" />
                  </button>
                  <div className="p-3 bg-black/50 backdrop-blur-sm absolute bottom-0 w-full">
                    <p className="text-[10px] text-white font-bold uppercase tracking-widest text-center">GIF Carregado com Sucesso</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Action Button */}
          <div className="px-4 py-6">
            <button
              onClick={handleSave}
              disabled={loading || uploading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <Icon name={editingId ? 'edit' : 'save'} />
              {loading ? 'PROCESSANDO...' : uploading ? 'AGUARDANDO UPLOAD...' : editingId ? 'ATUALIZAR EXERCÍCIO' : 'SALVAR NO BANCO'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setThumbnailUrl('');
                  setEditingId(null);
                  setName('');
                  setCategory('');
                  setGifUrl('');
                }}
                className="w-full mt-2 text-[#bc9aa3] text-xs font-bold uppercase tracking-widest py-2 hover:text-white transition-colors"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </div>

        <div className="h-4 bg-[#141414] border-t border-[#281b1e] mt-4"></div>

        {/* Library Section */}
        <section className="mt-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-xl font-bold">Biblioteca</h3>
            <span className="text-[#bc9aa3] text-sm">{filteredExercises.length} exercícios</span>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bc9aa3]">
                <Icon name="search" />
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#563941] rounded-lg h-11 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-[#bc9aa3] transition-all"
                placeholder="Buscar exercício..."
                type="text"
              />
            </div>
            <button className="w-11 h-11 flex items-center justify-center bg-[#1e1e1e] border border-[#563941] rounded-lg text-white hover:bg-white/5 transition-colors">
              <Icon name="filter_list" />
            </button>
          </div>

          {/* Exercise List */}
          <div className="flex flex-col gap-3">
            {loading && exercises.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-[#bc9aa3] animate-pulse">
                <Icon name="refresh" className="text-4xl animate-spin" />
                <p className="font-bold uppercase tracking-widest text-xs">Carregando Banco...</p>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-[#bc9aa3] border border-dashed border-[#563941] rounded-2xl">
                <Icon name="search_off" className="text-4xl" />
                <p className="font-bold uppercase tracking-widest text-xs">Nenhum exercício encontrado</p>
              </div>
            ) : (
              filteredExercises.map((ex) => (
                <ExerciseItem
                  key={ex.id}
                  title={ex.name}
                  muscle={ex.category}
                  muscleColor={
                    ex.category === 'Peitoral' ? 'text-blue-400 bg-blue-500/20' :
                      ex.category === 'Costas' ? 'text-emerald-400 bg-emerald-500/20' :
                        ex.category === 'Ombros' ? 'text-purple-400 bg-purple-500/20' :
                          ex.category === 'Braços' ? 'text-yellow-400 bg-yellow-500/20' :
                            ex.category === 'Abdominais' ? 'text-orange-400 bg-orange-500/20' :
                              'text-primary bg-primary/20'
                  }
                  onEdit={() => handleEdit(ex)}
                  onDelete={() => handleDelete(ex.id)}
                  imageUrl={ex.thumbnail_url || ex.gif_url}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredExercises.length > 10 && (
            <button className="mt-2 w-full py-3 text-[#bc9aa3] text-sm font-medium hover:text-white transition-colors">
              Carregar mais exercícios...
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

interface ExerciseItemProps {
  title: string;
  muscle: string;
  muscleColor: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ExerciseItem: React.FC<ExerciseItemProps & { imageUrl?: string }> = ({ title, muscle, muscleColor, onEdit, onDelete, imageUrl }) => (
  <div className="flex items-center gap-3 p-3 bg-[#1e1e1e] rounded-xl border border-[#281b1e]">
    <div className="w-14 h-14 rounded-lg bg-[#281b1e] overflow-hidden flex-shrink-0 flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <Icon name="fitness_center" className="text-2xl text-primary/40" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-semibold truncate uppercase tracking-tight text-sm">{title}</h4>
      <div className="flex gap-2 mt-1">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${muscleColor}`}>{muscle}</span>
      </div>
    </div>
    <div className="flex gap-1">
      <button
        onClick={onEdit}
        className="p-2 text-[#bc9aa3] hover:text-white transition-colors"
      >
        <Icon name="edit" className="text-xl" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-[#bc9aa3] hover:text-primary transition-colors"
      >
        <Icon name="delete" className="text-xl" />
      </button>
    </div>
  </div>
);