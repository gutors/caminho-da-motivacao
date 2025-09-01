// Dados das categorias e citações de motivação
export const voiceTypes = [
  {
    id: 'geracao-z',
    name: 'Geração Z',
    emoji: '😎',
    description: 'leve, direto, tom de influencer',
    icon: '😎'
  },
  {
    id: 'coach',
    name: 'Coach',
    emoji: '🎯',
    description: 'intenso, provocador, energético',
    icon: '🎯'
  },
  {
    id: 'sabio',
    name: 'Sábio',
    emoji: '🧙‍♂️',
    description: 'reflexivo, profundo, filosófico',
    icon: '🧙‍♂️'
  },
  {
    id: 'engracado',
    name: 'Engraçado/Irônico',
    emoji: '😄',
    description: 'bem-humorado, direto, com gírias e sarcasmo',
    icon: '😄'
  }
];

export const categories = [
  {
    id: 'procrastinacao',
    name: 'Procrastinação',
    emoji: '⏰',
    description: 'Vença a procrastinação e tome ação',
    color: 'from-orange-400 to-red-400'
  },
  {
    id: 'autoconfianca',
    name: 'Autoconfiança',
    emoji: '💝',
    description: 'Desenvolva sua autoestima e confiança',
    color: 'from-pink-400 to-red-400'
  },
  {
    id: 'habitos',
    name: 'Hábitos Saudáveis',
    emoji: '🌱',
    description: 'Crie pequenas rotinas com impacto real',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'exercicio',
    name: 'Exercício e Movimento',
    emoji: '💪',
    description: 'Ative seu corpo com leveza e motivação',
    color: 'from-blue-400 to-cyan-400'
  }
];

export const achievementsData = [
  {
    id: 'primeiro-passo',
    title: 'Primeiro Passo',
    description: 'Completou sua primeira citação',
    icon: '🎯',
    goal: 1,
    metric: 'totalCompleted',
  },
  {
    id: 'first_favorite',
    title: 'Primeira Favorita',
    description: 'Favoritou sua primeira citação',
    icon: '❤️',
    goal: 1,
    metric: 'totalFavorites',
  },
  {
    id: 'colecionador',
    title: 'Colecionador',
    description: 'Favoritou 10 citações',
    icon: '💎',
    goal: 10,
    metric: 'totalFavorites',
  },
  {
    id: 'sequencia-3',
    title: '3 Dias Seguidos',
    description: 'Manteve uma sequência de 3 dias',
    icon: '🔥',
    goal: 3,
    metric: 'currentStreak',
  },
  {
    id: 'sequencia-7',
    title: '7 Dias Seguidos',
    description: 'Uma semana completa de motivação',
    icon: '⭐',
    goal: 7,
    metric: 'currentStreak',
  },
  {
    id: 'sequencia-21',
    title: '21 Dias de Ouro',
    description: 'Manteve a chama acesa por 21 dias',
    icon: '🏆',
    goal: 21,
    metric: 'currentStreak',
  },
  {
    id: 'explorador',
    title: 'Explorador',
    description: 'Visitou todas as 4 categorias',
    icon: '🗺️',
    goal: 4,
    metric: 'categoriesVisited',
  },
];

