import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  points: number;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  has_liked?: boolean;
}

interface CommunityProps {
  onBack: () => void;
}

export const Community: React.FC<CommunityProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'ranking'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [ranking, setRanking] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // New Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user);

      if (activeTab === 'feed') {
        await fetchPosts(session?.user?.id);
      } else {
        await fetchRanking();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'feed') fetchPosts(currentUser?.id);
    else fetchRanking();
  }, [activeTab]);

  const fetchPosts = async (userId?: string) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (userId) {
        const { data: likes } = await supabase
          .from('community_likes')
          .select('post_id')
          .eq('user_id', userId);

        const likedPostIds = new Set(likes?.map(l => l.post_id));
        setPosts(data.map(p => ({
          ...p,
          has_liked: likedPostIds.has(p.id)
        })));
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, points')
        .eq('role', 'user')
        .order('points', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRanking(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: string, hasLiked: boolean) => {
    if (!currentUser) return;

    try {
      if (hasLiked) {
        await supabase.from('community_likes').delete().match({ post_id: postId, user_id: currentUser.id });
        await supabase.rpc('decrement_likes', { post_id_val: postId });
      } else {
        await supabase.from('community_likes').insert({ post_id: postId, user_id: currentUser.id });
        await supabase.rpc('increment_likes', { post_id_val: postId });
      }
      fetchPosts(currentUser.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !postImage) return;
    if (!currentUser) return;

    try {
      setIsPosting(true);
      let imageUrl = '';

      if (postImage) {
        const fileExt = postImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('community')
          .upload(filePath, postImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('community')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('community_posts').insert({
        user_id: currentUser.id,
        content: newPostContent,
        image_url: imageUrl
      });

      if (error) throw error;

      setNewPostContent('');
      setPostImage(null);
      setPostImagePreview(null);
      fetchPosts(currentUser.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-manrope">
      {/* Header */}
      <div className="flex items-center px-4 py-3 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-white/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Icon name="arrow_back_ios" className="text-xl" />
        </button>
        <div className="flex bg-slate-100 dark:bg-surface-dark p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ranking' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}
          >
            Ranking
          </button>
        </div>
        <div className="w-10"></div>
      </div>

      <main className="max-w-md mx-auto pb-32">
        {activeTab === 'feed' ? (
          <div className="flex flex-col gap-6 p-4">
            {/* Create Post Card */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-xl border border-white/5">
              <div className="flex gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                  <Icon name="person" />
                </div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Como foi seu treino hoje?"
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm placeholder:text-slate-500 min-h-[60px]"
                />
              </div>

              {postImagePreview && (
                <div className="mt-4 relative rounded-2xl overflow-hidden aspect-video group">
                  <img src={postImagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    onClick={() => { setPostImage(null); setPostImagePreview(null); }}
                    className="absolute top-2 right-2 size-8 bg-black/60 rounded-full flex items-center justify-center text-white"
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest"
                >
                  <Icon name="add_a_photo" />
                  <span>Foto</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={isPosting || (!newPostContent.trim() && !postImage)}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isPosting ? 'Postando...' : 'Postar'}
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
              <div className="flex flex-col items-center py-12 gap-3 opacity-50">
                <div className="size-8 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Carregando Feed...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 opacity-50 italic">Nenhum post ainda. Seja o primeiro!</div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-xl border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                      {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} className="w-full h-full object-cover" alt="" /> : <Icon name="person" className="text-slate-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight leading-none italic">{post.profiles?.full_name || 'Atleta Tor'}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {post.content && <p className="px-4 pb-4 text-sm font-medium leading-relaxed dark:text-slate-300">{post.content}</p>}

                  {post.image_url && (
                    <div className="aspect-square bg-slate-900 border-y border-white/5">
                      <img src={post.image_url} className="w-full h-full object-cover" alt="Post" />
                    </div>
                  )}

                  <div className="p-4 flex items-center justify-between border-t border-white/5">
                    <button
                      onClick={() => handleLike(post.id, !!post.has_liked)}
                      className={`flex items-center gap-2 transition-all ${post.has_liked ? 'text-primary' : 'text-slate-500'}`}
                    >
                      <Icon name="favorite" className={post.has_liked ? 'fill-1' : ''} />
                      <span className="text-xs font-black">{post.likes_count}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500">
                      <Icon name="chat_bubble" />
                      <span className="text-xs font-black">Comentar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Ranking Tab */
          <div className="flex flex-col">
            <div className="p-4">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">Seu Desempenho</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-black italic text-white leading-none">Top 14</h3>
                  <div className="text-right">
                    <p className="text-xs font-black text-white/80 uppercase">1.210</p>
                    <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Pontos Totais</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Líderes da Semana</h3>
              <Icon name="trending_up" className="text-primary" />
            </div>

            <div className="px-4 flex flex-col gap-2 mt-2">
              {loading ? (
                <div className="flex flex-col items-center py-12 gap-3 opacity-50">
                  <div className="size-8 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                </div>
              ) : ranking.map((user, idx) => (
                <div key={user.id} className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all ${idx === 0 ? 'bg-amber-500/10 border border-amber-500/20' : idx === 1 ? 'bg-slate-500/10 border border-slate-500/20' : idx === 2 ? 'bg-amber-700/10 border border-amber-700/20' : 'bg-white dark:bg-surface-dark border border-white/5'}`}>
                  <div className={`size-10 rounded-full flex items-center justify-center font-black italic text-lg ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-600'}`}>
                    {idx + 1}
                  </div>
                  <div className="size-12 rounded-full overflow-hidden border-2 border-white/10 bg-slate-800">
                    {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" /> : <Icon name="person" className="text-slate-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-tight italic">{user.id === currentUser?.id ? 'Você' : user.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="size-2 rounded-full bg-emerald-500"></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nível Iniciante</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary italic leading-none">{user.points || 0}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">PTS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};