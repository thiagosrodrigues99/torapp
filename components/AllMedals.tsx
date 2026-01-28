import React from 'react';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

interface AllMedalsProps {
  onBack: () => void;
}

export const AllMedals: React.FC<AllMedalsProps> = ({ onBack }) => {
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState({
    fullName: '',
    points: 0
  });
  const [medals, setMedals] = React.useState<any[]>([]);
  const [earnedMedalIds, setEarnedMedalIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, points')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setUserData({
        fullName: profile.full_name || 'Usuário',
        points: profile.points || 0
      });

      // Fetch medals
      const { data: allMedals } = await supabase
        .from('medals')
        .select('*')
        .order('points_required', { ascending: true });

      if (allMedals) setMedals(allMedals);

      const { data: earned } = await supabase
        .from('user_medals')
        .select('medal_id')
        .eq('user_id', session.user.id);

      if (earned) {
        setEarnedMedalIds(earned.map(e => e.medal_id));
      }

    } catch (err) {
      console.error('Error fetching user data for medals:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-start cursor-pointer active:opacity-60 transition-opacity"
          >
            <Icon name="arrow_back_ios" className="text-2xl" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Conquistas</h2>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 flex flex-col min-h-[calc(100vh-72px)] pb-8">
        <div className="flex-grow flex flex-col">
          <div className="py-6">
            <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 shadow-sm">
              <p className="text-slate-500 dark:text-[#bc9aa3] text-sm font-medium uppercase tracking-wider">Total de Pontos de {userData.fullName}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold leading-tight">{userData.points.toLocaleString('pt-BR')}</p>
                <p className="text-primary font-bold text-xl">pts</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 pb-4">
            <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Minhas Conquistas</h3>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              {earnedMedalIds.length} Medalhas
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 mb-8">
            {medals.map((medal) => {
              const isEarned = earnedMedalIds.includes(medal.id) || userData.points >= medal.points_required;

              // Color mapping logic
              let iconColor = "text-slate-400";
              let from = "";
              let to = "";

              if (isEarned) {
                if (medal.title === 'Iniciante') { iconColor = "text-yellow-500"; from = "from-yellow-300"; to = "to-orange-500"; }
                else if (medal.title === 'Hidratado') { iconColor = "text-blue-400"; from = "from-blue-300"; to = "to-indigo-500"; }
                else if (medal.title === 'Maratonista') { iconColor = "text-orange-500"; from = "from-orange-300"; to = "to-red-500"; }
                else if (medal.title === 'Elite') { iconColor = "text-yellow-500"; from = "from-yellow-200"; to = "to-amber-500"; }
                else { iconColor = "text-primary"; from = "from-primary/50"; to = "to-primary"; }
              }

              return (
                <div key={medal.id} className={`flex flex-col gap-3 p-4 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 transition-all ${isEarned ? 'shadow-md' : 'opacity-40 grayscale-filter'}`}>
                  <div className={`w-full aspect-square bg-gradient-to-br ${isEarned ? `${from} ${to}` : 'from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900'} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                    {medal.image_url ? (
                      <img src={medal.image_url} className={`size-20 object-contain ${isEarned ? '' : 'opacity-40 grayscale'}`} alt={medal.title} />
                    ) : (
                      <Icon name={medal.icon} className={`text-5xl ${isEarned ? 'text-white' : 'text-slate-400'}`} fill={isEarned} />
                    )}
                    {!isEarned && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Icon name="lock" className="text-white/50 text-xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold leading-tight">{medal.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className={`${isEarned ? 'text-primary' : 'text-slate-400'} text-[10px] font-bold uppercase tracking-wider`}>
                        {medal.points_required} pts
                      </p>
                      {isEarned && <Icon name="check_circle" className="text-green-500 text-base" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};