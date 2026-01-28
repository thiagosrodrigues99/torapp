import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface EditMedalProps {
  onBack: () => void;
  medal: any;
  onSave: () => void;
}

export const EditMedal: React.FC<EditMedalProps> = ({ onBack, medal, onSave }) => {
  const [title, setTitle] = useState(medal.title);
  const [points, setPoints] = useState(medal.points_required);
  const [icon, setIcon] = useState(medal.icon);
  const [imageUrl, setImageUrl] = useState(medal.image_url);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
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

      setImageUrl(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('medals')
        .update({
          title,
          points_required: points,
          icon,
          image_url: imageUrl
        })
        .eq('id', medal.id);

      if (error) throw error;
      onSave();
    } catch (err) {
      console.error('Error updating medal:', err);
      alert('Erro ao atualizar medalha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 h-16 max-w-screen-xl mx-auto w-full justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-[#f0f0f0] hover:opacity-70 transition-opacity"
          >
            <Icon name="arrow_back_ios" className="text-lg" />
            <p className="text-base font-medium leading-normal tracking-[0.015em]">Voltar</p>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] absolute left-1/2 -translate-x-1/2">Editar Medalha</h2>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full pb-32">
        <section className="p-4 flex flex-col items-center">
          <div className="size-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group">
            {imageUrl ? (
              <img src={imageUrl} className="w-full h-full object-contain" alt="Preview" />
            ) : (
              <Icon name={icon} className="text-6xl" fill />
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity border-none cursor-pointer"
            >
              <Icon name={uploading ? "sync" : "upload"} className={uploading ? "animate-spin" : ""} />
              <span className="text-[10px] font-bold uppercase mt-1">{uploading ? "Fazendo Upload..." : "Alterar PNG"}</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setImageUrl(null)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remover PNG</button>
          </div>
        </section>

        <section className="flex flex-col gap-2 px-4 mt-4 max-w-lg mx-auto w-full">
          <div className="flex flex-col gap-2 py-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-700 dark:text-[#f0f0f0] text-sm font-bold uppercase tracking-widest pb-2">Título da Medalha</p>
              <input
                className="flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#282828] h-14 p-4 text-base font-medium"
                placeholder="Ex: Maratonista"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 py-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-700 dark:text-[#f0f0f0] text-sm font-bold uppercase tracking-widest pb-2">Pontos para Conquistar</p>
              <div className="relative">
                <input
                  className="flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#282828] h-14 p-4 text-base font-medium"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#bc9aa3] font-bold">PTS</span>
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-2 py-3">
            <label className="flex flex-col w-full">
              <p className="text-gray-700 dark:text-[#f0f0f0] text-sm font-bold uppercase tracking-widest pb-2">Ícone Fallback (Material Icon)</p>
              <input
                className="flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#282828] h-14 p-4 text-base font-medium"
                placeholder="Ex: emoji_events"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                disabled={!!imageUrl}
              />
            </label>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Usado apenas se não houver PNG</p>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/10">
        <div className="max-w-screen-xl mx-auto flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-opacity-90 active:scale-[0.98] transition-all text-white text-base font-bold uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </footer>
    </div>
  );
};