import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { achievementsData } from '../data/motivationData';

const AppContext = createContext();

const getDefaultProgress = () => {
  return {
    last_category_id: 'procrastinacao',
    last_voice_id: null,
    categories: {
      procrastinacao: { current_day: 1 },
      autoconfianca: { current_day: 1 },
      habitos: { current_day: 1 },
      exercicio: { current_day: 1 },
    },
  };
};

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQuotesLoading, setQuotesLoading] = useState(true);
  const [isProfileLoading, setProfileLoading] = useState(true);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [completedQuotes, setCompletedQuotes] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [progress, setProgress] = useState(null);
  const [quotesByDay, setQuotesByDay] = useState({});
  const [quotesById, setQuotesById] = useState({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    setQuotesLoading(true);
    try {
      const { data, error } = await supabase.from('quotes').select('*');
      if (error) {
        console.error("Error fetching quotes:", error);
        return;
      }

      const byDay = {};
      const byId = {};

      data.forEach(quote => {
        // Populate quotesById
        byId[quote.id] = quote;

        // Populate quotesByDay
        if (!byDay[quote.category]) {
          byDay[quote.category] = {};
        }
        if (!byDay[quote.category][quote.voice_type]) {
          byDay[quote.category][quote.voice_type] = {};
        }
        byDay[quote.category][quote.voice_type][quote.day] = quote;
      });

      setQuotesById(byId);
      setQuotesByDay(byDay);
    } catch (error) {
      console.error("Error processing quotes:", error);
    } finally {
      setQuotesLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
        const [profileRes, favoritesRes, completedRes, achievementsRes] = await Promise.all([
          supabase.from('profiles').select('selected_voice, current_streak, last_completed_date, progress').eq('id', user.id).single(),
          supabase.from('user_favorites').select('quote_id').eq('user_id', user.id),
          supabase.from('user_completed_quotes').select('quote_id').eq('user_id', user.id),
          supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id)
        ]);

        const { data: profileData, error: profileError } = profileRes;
        if (profileError) console.error('Erro ao buscar perfil:', profileError);
        else if (profileData) {
          setSelectedVoice(profileData.selected_voice || null);
          setCurrentStreak(profileData.current_streak || 0);
          setLastCompletedDate(profileData.last_completed_date);
          setProgress(profileData.progress && Object.keys(profileData.progress).length > 0 ? profileData.progress : getDefaultProgress());
        }

        const { data: favoritesData, error: favoritesError } = favoritesRes;
        if (favoritesError) console.error('Erro ao buscar favoritos:', favoritesError);
        else setFavorites(favoritesData.map(f => Number(f.quote_id)));

        const { data: completedData, error: completedError } = completedRes;
        if (completedError) console.error('Erro ao buscar concluídos:', completedError);
        else setCompletedQuotes(completedData.map(c => Number(c.quote_id)));

        const { data: achievementsData, error: achievementsError } = achievementsRes;
        if (achievementsError) console.error('Erro ao buscar conquistas:', achievementsError);
        else setUnlockedAchievements(achievementsData.map(a => a.achievement_id));
    } catch (error) {
        console.error("Error fetching user data:", error);
    } finally {
        setProfileLoading(false);
    }
  };

  const updateSelectedVoice = async (voiceId) => {
    if (!user) return;
    setSelectedVoice(voiceId);
    const { error } = await supabase.from('profiles').update({ selected_voice: voiceId }).eq('id', user.id);
    if (error) console.error("Error updating selected voice:", error);
  };

  const completeQuote = async (quoteId) => {
    if (!user || !quoteId) return;

    const quote = quotesById[quoteId];
    if (!quote) return;

    const newProgress = JSON.parse(JSON.stringify(progress));
    newProgress.last_category_id = quote.category;
    newProgress.last_voice_id = quote.voice_type;
    if (newProgress.categories[quote.category]) {
      newProgress.categories[quote.category].current_day += 1;
    } else {
      newProgress.categories[quote.category] = { current_day: 2 };
    }
    setProgress(newProgress);

    const today = new Date().toISOString().split('T')[0];
    let newStreak = lastCompletedDate === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] ? currentStreak + 1 : 1;
    
    const { error: profileError } = await supabase.from('profiles').update({ progress: newProgress, current_streak: newStreak, last_completed_date: today }).eq('id', user.id);
    if (profileError) console.error("Erro ao atualizar perfil:", profileError);
    else {
      setCurrentStreak(newStreak);
      setLastCompletedDate(today);
    }

    const { error: insertError } = await supabase.from('user_completed_quotes').insert({ user_id: user.id, quote_id: quoteId, category: quote.category });
    if (!insertError) setCompletedQuotes(prev => [...prev, quoteId]);
    else console.error("Erro ao salvar citação concluída:", insertError);
  };

  const resetUserData = async () => {
    if (!user) return;

    const [achievementsError, favoritesError, completedError] = await Promise.all([
        supabase.from('user_achievements').delete().match({ user_id: user.id }),
        supabase.from('user_favorites').delete().match({ user_id: user.id }),
        supabase.from('user_completed_quotes').delete().match({ user_id: user.id })
    ]);

    if (achievementsError.error || favoritesError.error || completedError.error) {
        console.error("Error deleting user data:", achievementsError.error, favoritesError.error, completedError.error);
        return;
    }

    const { error: profileError } = await supabase.from('profiles').update({
        current_streak: 0,
        last_completed_date: null,
        progress: getDefaultProgress(),
        selected_voice: null
    }).eq('id', user.id);

    if (profileError) {
        console.error("Error resetting profile:", profileError);
        return;
    }

    // Reset local state
    setFavorites([]);
    setCompletedQuotes([]);
    setUnlockedAchievements([]);
    setCurrentStreak(0);
    setLastCompletedDate(null);
    setProgress(getDefaultProgress());
    setSelectedVoice(null);
  };

  const stats = useMemo(() => {
    const visitedCategories = new Set(
      completedQuotes.map(quoteId => quotesById[quoteId]?.category).filter(Boolean)
    );
    return {
      totalCompleted: completedQuotes.length,
      currentStreak,
      totalFavorites: favorites.length,
      categoriesVisited: visitedCategories.size
    }
  }, [completedQuotes, currentStreak, favorites.length, quotesById]);

  const processedAchievements = useMemo(() => {
    if (!stats) return [];
    const statsMap = { ...stats };
    return achievementsData.map(ach => ({ ...ach, progress: Math.min(statsMap[ach.metric] || 0, ach.goal) }));
  }, [stats]);

  useEffect(() => {
    if (!user || processedAchievements.length === 0) return;

    const newUnlocks = processedAchievements.filter(ach => ach.progress >= ach.goal && !unlockedAchievements.includes(ach.id));
    if (newUnlocks.length > 0) {
      const newUnlockIds = newUnlocks.map(ach => ach.id);
      const recordsToInsert = newUnlockIds.map(id => ({ user_id: user.id, achievement_id: id }));
      supabase.from('user_achievements').insert(recordsToInsert).then(({ error }) => {
        if (!error) setUnlockedAchievements(prev => [...prev, ...newUnlockIds]);
        else console.error("Erro ao salvar novas conquistas:", error);
      });
    }
  }, [processedAchievements, unlockedAchievements, user]);

  const isFavorite = (quoteId) => favorites.includes(quoteId);

  const toggleFavorite = async (quoteId) => {
    if (!user) return;

    const quote = quotesById[quoteId];
    if (!quote) return;

    const isCurrentlyFavorite = isFavorite(quoteId);
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(id => id !== quoteId));
      await supabase.from('user_favorites').delete().match({ user_id: user.id, quote_id: quoteId });
    } else {
      setFavorites(prev => [...prev, quoteId]);
      await supabase.from('user_favorites').insert({ user_id: user.id, quote_id: quoteId, category: quote.category });
    }
  };

  const value = {
    session, user, loading, isQuotesLoading, isProfileLoading, supabase,
    selectedVoice, updateSelectedVoice,
    favorites, completedQuotes, completeQuote,
    currentStreak, unlockedAchievements,
    stats, progress, processedAchievements,
    isFavorite, toggleFavorite,
    quotesByDay, quotesById,
    resetUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
}