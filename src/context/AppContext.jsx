import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { achievementsData } from '../data/motivationData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados da aplicação que antes usavam localStorage
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [completedQuotes, setCompletedQuotes] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [visitedCategories, setVisitedCategories] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Gerencia a sessão do usuário
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

  // Busca os dados do usuário no banco quando ele está logado
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    // Busca perfil, favoritos, concluídos e conquistas em paralelo
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) console.error('Erro ao buscar perfil:', profileError);
    else if (profileData) {
      setSelectedVoice(profileData.selected_voice);
      setCurrentStreak(profileData.current_streak);
      setLastCompletedDate(profileData.last_completed_date);
      setVisitedCategories(profileData.visited_categories || []);
    }

    const { data: favoritesData, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('quote_id, category')
      .eq('user_id', user.id);
    if (favoritesError) console.error('Erro ao buscar favoritos:', favoritesError);
    else setFavorites(favoritesData.map(f => ({ id: f.quote_id, category: f.category })));

    const { data: completedData, error: completedError } = await supabase
      .from('user_completed_quotes')
      .select('quote_id, category')
      .eq('user_id', user.id);
    if (completedError) console.error('Erro ao buscar concluídos:', completedError);
    else setCompletedQuotes(completedData.map(c => ({ id: c.quote_id, category: c.category })));
    
    const { data: achievementsData, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id);
    if (achievementsError) console.error('Erro ao buscar conquistas:', achievementsError);
    else setUnlockedAchievements(achievementsData.map(a => a.achievement_id));
  };

  // Adicionar/remover favoritos no Supabase
  const toggleFavorite = async (quoteId, category) => {
    if (!user) return;

    const isCurrentlyFavorite = favorites.some(fav => fav.id === quoteId && fav.category === category);

    if (isCurrentlyFavorite) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: user.id, quote_id: quoteId, category: category });
      
      if (!error) {
        setFavorites(prev => prev.filter(fav => !(fav.id === quoteId && fav.category === category)));
      } else {
        console.error("Erro ao remover favorito:", error);
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, quote_id: quoteId, category: category });

      if (!error) {
        setFavorites(prev => [...prev, { id: quoteId, category }]);
      } else {
        console.error("Erro ao adicionar favorito:", error);
      }
    }
  };

  const isFavorite = (quoteId, category) => {
    return favorites.some(fav => fav.id === quoteId && fav.category === category);
  };

  const updateSelectedVoice = async (voiceId) => {
    if (!user) return;

    // Atualiza o estado local imediatamente para uma UI responsiva
    setSelectedVoice(voiceId);

    // Salva a preferência no banco de dados
    const { error } = await supabase
      .from('profiles')
      .update({ selected_voice: voiceId, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error("Erro ao salvar a voz:", error);
      // Opcional: reverter a mudança de estado local se a chamada da API falhar
    }
  };

  const checkAchievements = async (localState) => {
    if (!user) return;

    const { completed, streak, favs, visited } = localState;
    const newAchievements = [];

    // Mapeamento de conquistas [id, condição]
    const achievementConditions = [
      ['primeiro-passo', completed >= 1],
      ['sequencia-3', streak >= 3],
      ['sequencia-7', streak >= 7],
      ['explorador', visited >= 4],
      ['colecionador', favs >= 10],
    ];

    achievementConditions.forEach(([id, condition]) => {
      if (condition && !unlockedAchievements.includes(id)) {
        newAchievements.push(id);
      }
    });

    if (newAchievements.length > 0) {
      const recordsToInsert = newAchievements.map(id => ({ user_id: user.id, achievement_id: id }));
      const { error } = await supabase.from('user_achievements').insert(recordsToInsert);

      if (!error) {
        setUnlockedAchievements(prev => [...prev, ...newAchievements]);
      } else {
        console.error("Erro ao salvar conquistas:", error);
      }
    }
  };

  const completeQuote = async (quoteId, category) => {
    if (!user) return;

    // 1. Verifica se a citação já foi concluída hoje para evitar duplicatas
    const alreadyCompleted = completedQuotes.some(q => q.id === quoteId && q.category === category);
    if (alreadyCompleted) return;

    // 2. Salva a citação concluída no banco
    const { error: insertError } = await supabase
      .from('user_completed_quotes')
      .insert({ user_id: user.id, quote_id: quoteId, category: category });

    if (insertError) {
      console.error("Erro ao salvar citação concluída:", insertError);
      return;
    }

    // Atualiza estado local para UI imediata
    const newCompletedQuotes = [...completedQuotes, { id: quoteId, category }];
    setCompletedQuotes(newCompletedQuotes);

    // 3. Lógica de sequência e categorias visitadas
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza para o início do dia
    const todayISO = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const lastDate = lastCompletedDate ? new Date(lastCompletedDate) : null;
    let newStreak = currentStreak;

    if (lastDate) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (lastDate.getTime() === yesterday.getTime()) {
        newStreak += 1; // Continua a sequência
      } else if (lastDate.getTime() < yesterday.getTime()) {
        newStreak = 1; // Quebrou a sequência, reinicia
      }
      // Se lastDate for hoje, não faz nada com a sequência
    } else {
      newStreak = 1; // Primeira vez
    }

    const newVisitedCategories = visitedCategories.includes(category)
      ? visitedCategories
      : [...visitedCategories, category];

    // 4. Atualiza o perfil do usuário no banco
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        last_completed_date: todayISO,
        visited_categories: newVisitedCategories,
      })
      .eq('id', user.id);

    if (profileError) {
      console.error("Erro ao atualizar perfil:", profileError);
    } else {
      // Atualiza estado local do perfil
      setCurrentStreak(newStreak);
      setLastCompletedDate(todayISO);
      setVisitedCategories(newVisitedCategories);
    }

    // 5. Verifica conquistas após todas as atualizações de estado
    checkAchievements({
      completed: newCompletedQuotes.length,
      streak: newStreak,
      favs: favorites.length,
      visited: newVisitedCategories.length,
    });
  };

  const stats = {
    totalCompleted: completedQuotes.length,
    currentStreak,
    totalFavorites: favorites.length,
    categoriesVisited: visitedCategories.length
  };

  const processedAchievements = useMemo(() => {
    const statsMap = {
      totalCompleted: stats.totalCompleted,
      totalFavorites: stats.totalFavorites,
      currentStreak: stats.currentStreak,
      categoriesVisited: stats.categoriesVisited,
    };

    return achievementsData.map(ach => {
      const currentValue = statsMap[ach.metric] || 0;
      const progress = Math.min(currentValue, ach.goal);

      return {
        ...ach,
        progress,
        goal: ach.goal,
      };
    });
  }, [stats.totalCompleted, stats.totalFavorites, stats.currentStreak, stats.categoriesVisited]);


  const value = {
    session,
    user,
    loading,
    supabase, // Expondo o cliente supabase para uso em outros componentes se necessário
    selectedVoice,
    updateSelectedVoice, // Nova função para salvar a voz
    favorites,
    toggleFavorite,
    isFavorite,
    completedQuotes,
    completeQuote, // Lógica principal implementada
    currentStreak,
    visitedCategories,
    unlockedAchievements,
    stats,
    processedAchievements, // Exportando as conquistas processadas
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
