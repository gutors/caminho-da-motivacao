// Dados das categorias e citações de motivação
export const voiceTypes = [
  {
    id: 'geracao-z',
    name: 'Geração Z',
    emoji: '🎯',
    description: 'leve, direto, tom de influencer',
    icon: '🎯'
  },
  {
    id: 'coach',
    name: 'Coach',
    emoji: '📢',
    description: 'intenso, provocador, energético',
    icon: '📢'
  },
  {
    id: 'sabio',
    name: 'Sábio',
    emoji: '🧠',
    description: 'reflexivo, profundo, filosófico',
    icon: '🧠'
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
    description: 'Organize sua mente e comece por onde dá',
    color: 'from-orange-400 to-red-400'
  },
  {
    id: 'autoconfianca',
    name: 'Autoconfiança e Autoestima',
    emoji: '💝',
    description: 'Fortaleça sua visão sobre quem você é',
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

export const quotes = {
  procrastinacao: [
    {
      id: 1,
      day: 1,
      insight: "Pare de adiar, comece agora!",
      clarity: "Sabe aquela tarefa que você tá enrolando pra fazer? Então, ela não vai sumir sozinha! O tempo tá passando e cada minuto que você adia é um minuto a menos pra curtir o resultado. Pensa assim: quanto antes você começar, antes você termina e pode ir fazer o que realmente gosta.",
      action: "Escolha UMA tarefa pequena e faça agora mesmo. Só uma!"
    },
    {
      id: 2,
      day: 2,
      insight: "Pequenos passos, grandes resultados",
      clarity: "Você não precisa fazer tudo de uma vez. A procrastinação muitas vezes vem do medo de não conseguir fazer algo perfeito. Mas a perfeição é inimiga do progresso. É melhor fazer algo imperfeito do que não fazer nada.",
      action: "Divida sua tarefa em 3 partes menores e faça apenas a primeira hoje."
    }
  ],
  autoconfianca: [
    {
      id: 1,
      day: 1,
      insight: "Você é mais capaz do que imagina",
      clarity: "Muitas vezes subestimamos nossa própria capacidade. Olhe para trás e veja quantos desafios você já superou, quantas coisas você já aprendeu. Cada experiência, boa ou ruim, te tornou mais forte e sábio.",
      action: "Liste 3 conquistas suas dos últimos 6 meses, por menores que sejam."
    }
  ],
  habitos: [
    {
      id: 1,
      day: 1,
      insight: "Hábitos pequenos, mudanças grandes",
      clarity: "Não precisa revolucionar sua vida de uma vez. Os melhores hábitos são aqueles que você consegue manter consistentemente. É melhor fazer 5 minutos todos os dias do que 2 horas uma vez por semana.",
      action: "Escolha um hábito que leve apenas 2 minutos e faça agora."
    }
  ],
  exercicio: [
    {
      id: 1,
      day: 1,
      insight: "Movimento é vida",
      clarity: "Seu corpo foi feito para se mover. Não importa se é uma caminhada, dança, alongamento ou exercício intenso. O importante é sair do sedentarismo e ativar sua energia. Cada movimento conta.",
      action: "Faça 10 polichinelos ou caminhe por 5 minutos agora mesmo."
    }
  ]
};

export const achievements = [
  {
    id: 'primeiro-passo',
    name: 'Primeiro Passo',
    description: 'Completou sua primeira citação',
    icon: '🎯',
    requirement: 1
  },
  {
    id: 'sequencia-3',
    name: '3 Dias Seguidos',
    description: 'Manteve uma sequência de 3 dias',
    icon: '🔥',
    requirement: 3
  },
  {
    id: 'sequencia-7',
    name: '7 Dias Seguidos',
    description: 'Uma semana completa de motivação',
    icon: '⭐',
    requirement: 7
  },
  {
    id: 'explorador',
    name: 'Explorador',
    description: 'Visitou todas as categorias',
    icon: '🗺️',
    requirement: 'all_categories'
  },
  {
    id: 'colecionador',
    name: 'Colecionador',
    description: 'Favoritou 10 citações',
    icon: '💎',
    requirement: 10
  }
];

