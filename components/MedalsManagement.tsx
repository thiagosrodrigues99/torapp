import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { EditMedal } from './EditMedal';
import { supabase } from '../lib/supabase';

interface MedalsManagementProps {
  onBack: () => void;
}

export const MedalsManagement: React.FC<MedalsManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [medals, setMedals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedal, setSelectedMedal] = useState<any>(null);

  // New medal form state
  const [newTitle, setNewTitle] = useState('');
  const [newPoints, setNewPoints] = useState('');
  const [newIcon, setNewIcon] = useState('emoji_events');
  const [saving, setSaving] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedals();
  }, []);

  const fetchMedals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medals')
        .select('*')
        .order('points_required', { ascending: true });

      if (error) throw error;
      setMedals(data || []);
    } catch (err) {
      console.error('Error fetching medals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const filePath = `medal-icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medals')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('medals')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  const handleCreateMedal = async () => {
    if (!newTitle || !newPoints) return;

    try {
      setSaving(true);

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('medals')
        .insert([{
          title: newTitle,
          points_required: parseInt(newPoints),
          icon: newIcon,
          image_url: imageUrl
        }]);

      if (error) throw error;

      setNewTitle('');
      setNewPoints('');
      setNewIcon('emoji_events');
      setImageFile(null);
      setImagePreview(null);
      fetchMedals();
      alert('Medalha criada com sucesso!');
    } catch (err) {
      console.error('Error creating medal:', err);
      alert('Erro ao criar medalha');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedal = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta medalha?')) return;

    try {
      const { error } = await supabase
        .from('medals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMedals();
    } catch (err) {
      console.error('Error deleting medal:', err);
      alert('Erro ao excluir medalha');
    }
  };

  const handleEditClick = (medal: any) => {
    setSelectedMedal(medal);
    setView('edit');
  };

  if (view === 'edit' && selectedMedal) {
    return (
      <EditMedal
        medal={selectedMedal}
        onBack={() => setView('list')}
        onSave={() => {
          setView('list');
          fetchMedals();
        }}
      />
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white transition-colors duration-200 font-display">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 dark:hover:bg-surface-dark transition-colors"
            >
              <Icon name="arrow_back" className="text-gray-700 dark:text-white" />
            </button>
            <h1 className="text-xl font-bold leading-tight tracking-tight">Gestão de Medalhas</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Registration Section */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Icon name="add_moderator" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">Cadastrar Nova Medalha</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">Gamifique a jornada dos seus atletas</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50/50 dark:bg-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Título da Medalha</label>
                  <input
                    className="w-full h-12 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl px-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                    placeholder="Ex: Maratonista"
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pontos Requeridos</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl px-4 pr-12 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                      placeholder="0"
                      type="number"
                      value={newPoints}
                      onChange={(e) => setNewPoints(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] font-black">PTS</span>
                  </div>
                </div>
              </div>

              {/* Icon Mode */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Ícone (Material Name)</label>
                  <input
                    className="w-full h-12 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl px-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                    placeholder="emoji_events"
                    type="text"
                    value={imageFile ? '--- Usando PNG ---' : newIcon}
                    disabled={!!imageFile}
                    onChange={(e) => setNewIcon(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 opacity-60">
                  <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                    <Icon name={newIcon} className="text-2xl" fill />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-primary">Preview Icon</span>
                    <span className="text-[9px] text-gray-500 font-bold">Fallback Icon</span>
                  </div>
                </div>
              </div>

              {/* PNG Upload Mode */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Upload PNG</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-12 bg-white dark:bg-[#141414] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl px-4 hover:border-primary transition-all flex items-center justify-center gap-2 group"
                  >
                    <Icon name="upload" className="text-gray-400 group-hover:text-primary" />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-primary uppercase tracking-widest">Selecionar PNG</span>
                  </button>
                </div>
                {imagePreview && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="size-12 rounded-xl overflow-hidden border border-emerald-500/20">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] font-black uppercase text-emerald-500">Preview PNG</span>
                      <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-[9px] font-black text-red-500 uppercase tracking-widest text-left mt-0.5 hover:underline">Remover</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-end">
                <button
                  onClick={handleCreateMedal}
                  disabled={saving || !newTitle || !newPoints}
                  className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Icon name={saving ? "sync" : "verified"} className={saving ? "animate-spin" : ""} />
                  {saving ? "Salvando..." : "Criar Medalha"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* List Section */}
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black uppercase tracking-tight">Medalhas Ativas</h2>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Total: {medals.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
              ))
            ) : medals.length > 0 ? (
              medals.map((medal) => (
                <div key={medal.id} className="group bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:border-primary transition-all hover:shadow-xl relative overflow-hidden">
                  <div className="relative aspect-square mb-6 bg-slate-50 dark:bg-[#141414] rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5">
                    {medal.image_url ? (
                      <img src={medal.image_url} className="size-28 object-contain group-hover:scale-110 transition-transform duration-500" alt={medal.title} />
                    ) : (
                      <Icon name={medal.icon} className="text-6xl text-primary group-hover:scale-110 transition-transform duration-500" fill />
                    )}
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                      Ativo
                    </div>
                  </div>

                  <h3 className="font-black text-base uppercase tracking-tight mb-1 truncate">{medal.title}</h3>
                  <div className="flex items-center gap-1.5 mb-6">
                    <Icon name="stars" className="text-primary text-sm" fill />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{medal.points_required} Pontos</span>
                  </div>

                  <div className="flex gap-2 relative z-10">
                    <button
                      onClick={() => handleEditClick(medal)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      <Icon name="edit" className="text-sm" />
                      <span className="hidden lg:inline">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMedal(medal.id)}
                      className="size-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-600"
                    >
                      <Icon name="delete" className="text-lg" />
                    </button>
                  </div>

                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                <Icon name="inventory_2" className="text-5xl text-gray-300 mb-4" />
                <p className="font-bold text-gray-400 uppercase tracking-widest">Nenhuma medalha cadastrada</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-gray-200 dark:border-white/10 text-center bg-slate-50 dark:bg-transparent">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em]">© 2026 Admin Panel • Gamificaton Hub</p>
      </footer>
    </div>
  );
};