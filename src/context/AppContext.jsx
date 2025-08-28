import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { achievementsData } from '../data/motivationData';
import { categories } from '../data/motivationData';

const AppContext = createContext();

const getDefaultProgress = () => {
  const progress = {
    last_category_id: categories[0].id,
    last_voice_id: 'coach',
    categories: {},
    visited_categories: []
  };
  categories.forEach(category => {
    progress.categories[category.id] = { current_day: 1 };
  });
  return progress;
};

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [completedQuotes, setCompletedQuotes] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) {
      return;
    }

    // Busca todos os dados em paralelo para mais performance
    const [profileRes, favoritesRes, completedRes, achievementsRes] = await Promise.all([
      supabase.from('profiles').select('selected_voice, current_streak, last_completed_date, progress').eq('id', user.id).single(),
      supabase.from('user_favorites').select('quote_id, category').eq('user_id', user.id),
      supabase.from('user_completed_quotes').select('quote_id, category').eq('user_id', user.id),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id)
    ]);

    const { data: profileData, error: profileError } = profileRes;
    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
    } else if (profileData) {
      setSelectedVoice(profileData.selected_voice);
      setCurrentStreak(profileData.current_streak || 0);
      setLastCompletedDate(profileData.last_completed_date);
      if (profileData.progress && Object.keys(profileData.progress).length > 0) {
        const userProgress = profileData.progress;
        if (!userProgress.visited_categories) {
            userProgress.visited_categories = Object.values(userProgress.categories)
                .filter(cat => cat.current_day > 1)
                .map(cat => categories.find(c => c.id === cat.id));
        }
        setProgress(userProgress);
      } else {
        setProgress(getDefaultProgress());
      }
    }

    const { data: favoritesData, error: favoritesError } = favoritesRes;
    if (favoritesError) console.error('Erro ao buscar favoritos:', favoritesError);
    else setFavorites(favoritesData.map(f => ({ id: f.quote_id, category: f.category })));

    const { data: completedData, error: completedError } = completedRes;
    if (completedError) console.error('Erro ao buscar concluídos:', completedError);
    else setCompletedQuotes(completedData.map(c => ({ id: c.quote_id, category: c.category })));

    const { data: achievementsData, error: achievementsError } = achievementsRes;
    if (achievementsError) console.error('Erro ao buscar conquistas:', achievementsError);
    else setUnlockedAchievements(achievementsData.map(a => a.achievement_id));
  };

  const updateSelectedVoice = async (voiceId) => {
    if (!user) {
        return;
    }
    setSelectedVoice(voiceId);
    const { error } = await supabase
        .from('profiles')
        .update({ selected_voice: voiceId })
        .eq('id', user.id);
    if (error) {
        console.error("Error updating selected voice:", error);
    }
  };

  const completeQuote = async (category, quoteId, voice) => {
    if (!user) {
        return;
    }

    const newProgress = JSON.parse(JSON.stringify(progress));
    newProgress.last_category_id = category;
    newProgress.last_voice_id = voice;
    if (newProgress.categories[category]) {
      newProgress.categories[category].current_day += 1;
    } else {
      newProgress.categories[category] = { current_day: 2 };
    }

    if (!newProgress.visited_categories.includes(category)) {
        newProgress.visited_categories.push(category);
    }

    setProgress(newProgress);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];
    let newStreak = currentStreak;

    if (lastCompletedDate) {
      const lastDate = new Date(lastCompletedDate);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (lastDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else if (lastDate.getTime() < yesterday.getTime()) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const { error: profileError } = await supabase.from('profiles').update({ progress: newProgress, current_streak: newStreak, last_completed_date: todayISO }).eq('id', user.id);
    if (profileError) {
      console.error("Erro ao atualizar perfil:", profileError);
    } else {
      setCurrentStreak(newStreak);
      setLastCompletedDate(todayISO);
    }

    const { error: insertError } = await supabase.from('user_completed_quotes').insert({ user_id: user.id, quote_id: quoteId, category: category });
    if (!insertError) {
        setCompletedQuotes(prev => [...prev, { id: quoteId, category }]);
    } else {
        console.error("Erro ao salvar citação concluída:", insertError);
    }
  };

  const stats = useMemo(() => {
    return {
        totalCompleted: completedQuotes.length,
        currentStreak,
        totalFavorites: favorites.length,
        categoriesVisited: progress?.visited_categories?.length || 0
    }
  }, [completedQuotes.length, currentStreak, favorites.length, progress]);

  const processedAchievements = useMemo(() => {
    if (!stats) {
        return [];
    }
    const statsMap = {
      totalCompleted: stats.totalCompleted,
      totalFavorites: stats.totalFavorites,
      currentStreak: stats.currentStreak,
      categoriesVisited: stats.categoriesVisited,
    };
    return achievementsData.map(ach => {
      const currentValue = statsMap[ach.metric] || 0;
      const progress = Math.min(currentValue, ach.goal);
      return { ...ach, progress };
    });
  }, [stats]);

  useEffect(() => {
    if (!user || processedAchievements.length === 0) {
        return;
    }

    const newUnlocks = processedAchievements.filter(ach => 
      ach.progress >= ach.goal && !unlockedAchievements.includes(ach.id)
    );

    if (newUnlocks.length > 0) {
      const newUnlockIds = newUnlocks.map(ach => ach.id);
      const recordsToInsert = newUnlockIds.map(id => ({ user_id: user.id, achievement_id: id }));

      const saveNewAchievements = async () => {
        const { error } = await supabase.from('user_achievements').insert(recordsToInsert);
        if (!error) {
          setUnlockedAchievements(prev => [...prev, ...newUnlockIds]);
        } else {
          console.error("Erro ao salvar novas conquistas:", error);
        }
      };
      saveNewAchievements();
    }
  }, [processedAchievements, unlockedAchievements, user]);

  const isFavorite = (quoteId, category) => {
    return favorites.some(fav => fav.id === quoteId && fav.category === category);
  };

  const toggleFavorite = async (quoteId, category) => {
    if (!user) return;

    const isCurrentlyFavorite = isFavorite(quoteId, category);

    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== quoteId || fav.category !== category));
      await supabase.from('user_favorites').delete().match({ user_id: user.id, quote_id: quoteId, category: category });
    } else {
      setFavorites(prev => [...prev, { id: quoteId, category: category }]);
      await supabase.from('user_favorites').insert({ user_id: user.id, quote_id: quoteId, category: category });
    }
  };

  const value = {
    session, 
    user, 
    loading, 
    supabase,
    selectedVoice, 
    updateSelectedVoice,
    favorites, 
    completedQuotes, 
    completeQuote,
    currentStreak, 
    unlockedAchievements,
    stats,
    progress,
    processedAchievements,
    isFavorite,
    toggleFavorite,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}