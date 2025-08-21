import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedVoice, setSelectedVoice] = useLocalStorage('selectedVoice', null);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [completedQuotes, setCompletedQuotes] = useLocalStorage('completedQuotes', []);
  const [currentStreak, setCurrentStreak] = useLocalStorage('currentStreak', 0);
  const [lastCompletedDate, setLastCompletedDate] = useLocalStorage('lastCompletedDate', null);
  const [visitedCategories, setVisitedCategories] = useLocalStorage('visitedCategories', []);
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('unlockedAchievements', []);

  // Função para adicionar/remover favoritos
  const toggleFavorite = (quoteId, category) => {
    const favoriteItem = { id: quoteId, category };
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === quoteId && fav.category === category);
      if (exists) {
        return prev.filter(fav => !(fav.id === quoteId && fav.category === category));
      } else {
        return [...prev, favoriteItem];
      }
    });
  };

  // Função para verificar se uma citação está favoritada
  const isFavorite = (quoteId, category) => {
    return favorites.some(fav => fav.id === quoteId && fav.category === category);
  };

  // Função para marcar citação como concluída
  const completeQuote = (quoteId, category) => {
    const today = new Date().toDateString();
    const completedItem = { id: quoteId, category, date: today };
    
    setCompletedQuotes(prev => {
      const exists = prev.find(comp => comp.id === quoteId && comp.category === category);
      if (!exists) {
        return [...prev, completedItem];
      }
      return prev;
    });

    // Atualizar sequência
    updateStreak(today);
    
    // Marcar categoria como visitada
    if (!visitedCategories.includes(category)) {
      setVisitedCategories(prev => [...prev, category]);
    }
  };

  // Função para atualizar sequência
  const updateStreak = (today) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (lastCompletedDate === yesterdayString || lastCompletedDate === today) {
      if (lastCompletedDate !== today) {
        setCurrentStreak(prev => prev + 1);
        setLastCompletedDate(today);
      }
    } else if (lastCompletedDate !== today) {
      setCurrentStreak(1);
      setLastCompletedDate(today);
    }
  };

  // Função para verificar e desbloquear conquistas
  const checkAchievements = () => {
    const newAchievements = [];

    // Primeiro Passo
    if (completedQuotes.length >= 1 && !unlockedAchievements.includes('primeiro-passo')) {
      newAchievements.push('primeiro-passo');
    }

    // Sequências
    if (currentStreak >= 3 && !unlockedAchievements.includes('sequencia-3')) {
      newAchievements.push('sequencia-3');
    }
    if (currentStreak >= 7 && !unlockedAchievements.includes('sequencia-7')) {
      newAchievements.push('sequencia-7');
    }

    // Explorador (visitou todas as categorias)
    if (visitedCategories.length >= 4 && !unlockedAchievements.includes('explorador')) {
      newAchievements.push('explorador');
    }

    // Colecionador (10 favoritos)
    if (favorites.length >= 10 && !unlockedAchievements.includes('colecionador')) {
      newAchievements.push('colecionador');
    }

    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Verificar conquistas sempre que dados relevantes mudarem
  useEffect(() => {
    checkAchievements();
  }, [completedQuotes, currentStreak, visitedCategories, favorites]);

  const value = {
    selectedVoice,
    setSelectedVoice,
    favorites,
    toggleFavorite,
    isFavorite,
    completedQuotes,
    completeQuote,
    currentStreak,
    visitedCategories,
    unlockedAchievements,
    stats: {
      totalCompleted: completedQuotes.length,
      currentStreak,
      totalFavorites: favorites.length,
      categoriesVisited: visitedCategories.length
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
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

