import React, { useState, useEffect } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { WorkoutSelection } from './components/WorkoutSelection';
import { WorkoutExecution } from './components/WorkoutExecution';
import { EditProfile } from './components/EditProfile';
import { RunMonitoring } from './components/RunMonitoring';
import { PersonalTrainer } from './components/PersonalTrainer';
import { RecipesList } from './components/RecipesList';
import { RecipeDetails } from './components/RecipeDetails';

import { Community } from './components/Community';
import { AllMedals } from './components/AllMedals';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { AdminDashboard } from './components/AdminDashboard';
import { InfluencerDashboard } from './components/InfluencerDashboard';
import { UserDashboard } from './components/UserDashboard';
import { Icon } from './components/Icon';
import { supabase } from './lib/supabase';

export default function App() {
  const [userRole, setUserRole] = useState<'user' | 'admin' | 'influencer' | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [view, setView] = useState<'dashboard' | 'workout-selection' | 'workout-execution' | 'edit-profile' | 'run-monitoring' | 'personal-trainer' | 'recipes-list' | 'recipe-details' | 'community' | 'all-medals'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

  useEffect(() => {
    // Monitor auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserRole(session.user.id, session);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserRole(session.user.id, session);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string, session?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching role from profiles:', error);
        // Fallback to metadata
        const metadataRole = session?.user?.user_metadata?.role;
        if (metadataRole) {
          console.log('Using metadata role fallback:', metadataRole);
          setUserRole(metadataRole as 'user' | 'admin' | 'influencer');
        } else {
          setUserRole('user');
        }
      } else if (data) {
        setUserRole(data.role as 'user' | 'admin' | 'influencer');
      } else {
        // Data is null (row not found), try metadata
        const metadataRole = session?.user?.user_metadata?.role;
        if (metadataRole) {
          console.log('Profile not found, using metadata role:', metadataRole);
          setUserRole(metadataRole as 'user' | 'admin' | 'influencer');
        } else {
          console.warn('Profile not found and no metadata role, defaulting to user');
          setUserRole('user');
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching role:', err);
      const metadataRole = session?.user?.user_metadata?.role;
      if (metadataRole) {
        setUserRole(metadataRole as 'user' | 'admin' | 'influencer');
      } else {
        setUserRole('user');
      }
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout...');
      // Tentativa de signout no Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao sair:', error);
      // Opcional: mostrar erro visual ao usuário se desejar
    } finally {
      // Garante que o estado seja limpo imediatamente
      setUserRole(null);
      setView('dashboard'); // Volta para a tela inicial
      console.log('Logout finalizado e estado limpo.');
    }
  };

  const isAuthenticated = userRole !== null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isRegistering) {
      return (
        <Register
          onBack={() => setIsRegistering(false)}
          onComplete={() => {
            setIsRegistering(false);
          }}
        />
      );
    }
    if (isRecoveringPassword) {
      return (
        <ForgotPassword
          onBack={() => setIsRecoveringPassword(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={(role) => setUserRole(role)}
        onRegisterClick={() => setIsRegistering(true)}
        onForgotPasswordClick={() => setIsRecoveringPassword(true)}
      />
    );
  }

  // Admin View
  if (userRole === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Influencer View
  if (userRole === 'influencer' && view === 'dashboard') {
    return <InfluencerDashboard onLogout={handleLogout} onEditProfile={() => setView('edit-profile')} />;
  }

  // User View Logic
  const handleNavigate = (tab: string) => {
    if (tab === 'dashboard') setView('dashboard');
    if (tab === 'community') setView('community');
  };

  if (view === 'edit-profile') {
    return <EditProfile onBack={() => setView('dashboard')} />;
  }

  if (view === 'workout-selection') {
    return (
      <WorkoutSelection
        onBack={() => setView('dashboard')}
        onStart={(groups) => {
          setSelectedMuscleGroups(groups);
          setView('workout-execution');
        }}
      />
    );
  }

  if (view === 'workout-execution') {
    return (
      <WorkoutExecution
        onBack={() => setView('workout-selection')}
        onFinish={() => setView('dashboard')}
        selectedGroups={selectedMuscleGroups}
      />
    );
  }

  if (view === 'run-monitoring') {
    return <RunMonitoring onBack={() => setView('dashboard')} />;
  }

  if (view === 'personal-trainer') {
    return <PersonalTrainer onBack={() => setView('dashboard')} />;
  }

  if (view === 'recipes-list') {
    return <RecipesList onBack={() => setView('dashboard')} onRecipeClick={() => setView('recipe-details')} />;
  }

  if (view === 'recipe-details') {
    return <RecipeDetails onBack={() => setView('recipes-list')} />;
  }



  if (view === 'community') {
    return (
      <>
        <Community onBack={() => setView('dashboard')} />
        <BottomNavigation currentTab={view} onNavigate={handleNavigate} />
      </>
    );
  }

  if (view === 'all-medals') {
    return <AllMedals onBack={() => setView('dashboard')} />;
  }

  // Fallback or dashboard view
  return (
    <UserDashboard
      onEditProfile={() => setView('edit-profile')}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentTab={view}
      onSeeAllMedals={() => setView('all-medals')}
      onStartWorkout={() => setView('workout-selection')}
      onRunClick={() => setView('run-monitoring')}
      onRecipesClick={() => setView('recipes-list')}
      onPersonalTrainerClick={() => setView('personal-trainer')}
      onStartChallenge={() => setView('workout-selection')}
    />
  );
}