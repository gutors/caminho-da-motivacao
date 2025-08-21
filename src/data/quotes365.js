// Base de dados para 365 citações diárias
// Estrutura: cada citação tem um dia específico (1-365) e categoria

// Função auxiliar para criar template de citação
const createQuoteTemplate = (day, category, categoryName) => ({
  id: `day_${day}`,
  day: day,
  category: category,
  categoryName: categoryName,
  insight: `[DIA ${day}] Insight para ${categoryName} - EDITE AQUI`,
  clarity: `[DIA ${day}] Clareza para ${categoryName} - Adicione sua reflexão detalhada aqui. Esta é a explicação que ajudará o usuário a entender melhor o insight.`,
  action: `[DIA ${day}] Ação consciente para ${categoryName} - Defina uma ação específica e prática aqui.`
});

// Distribuição das categorias ao longo dos 365 dias
// Procrastinação: dias 1-91 (91 dias)
// Autoconfiança: dias 92-182 (91 dias) 
// Hábitos: dias 183-273 (91 dias)
// Exercício: dias 274-365 (92 dias)

export const quotes365 = [];

// Procrastinação (dias 1-91)
for (let day = 1; day <= 91; day++) {
  quotes365.push(createQuoteTemplate(day, 'procrastinacao', 'Procrastinação'));
}

// Autoconfiança (dias 92-182)
for (let day = 92; day <= 182; day++) {
  quotes365.push(createQuoteTemplate(day, 'autoconfianca', 'Autoconfiança'));
}

// Hábitos (dias 183-273)
for (let day = 183; day <= 273; day++) {
  quotes365.push(createQuoteTemplate(day, 'habitos', 'Hábitos Saudáveis'));
}

// Exercício (dias 274-365)
for (let day = 274; day <= 365; day++) {
  quotes365.push(createQuoteTemplate(day, 'exercicio', 'Exercício e Movimento'));
}

// Algumas citações de exemplo já preenchidas para demonstração
quotes365[0] = {
  id: 'day_1',
  day: 1,
  category: 'procrastinacao',
  categoryName: 'Procrastinação',
  insight: 'Pare de adiar, comece agora!',
  clarity: 'Sabe aquela tarefa que você tá enrolando pra fazer? Então, ela não vai sumir sozinha! O tempo tá passando e cada minuto que você adia é um minuto a menos pra curtir o resultado. Pensa assim: quanto antes você começar, antes você termina e pode ir fazer o que realmente gosta.',
  action: 'Escolha UMA tarefa pequena e faça agora mesmo. Só uma!'
};

quotes365[1] = {
  id: 'day_2',
  day: 2,
  category: 'procrastinacao',
  categoryName: 'Procrastinação',
  insight: 'Pequenos passos, grandes resultados',
  clarity: 'Você não precisa fazer tudo de uma vez. A procrastinação muitas vezes vem do medo de não conseguir fazer algo perfeito. Mas a perfeição é inimiga do progresso. É melhor fazer algo imperfeito do que não fazer nada.',
  action: 'Divida sua tarefa em 3 partes menores e faça apenas a primeira hoje.'
};

quotes365[2] = {
  id: 'day_3',
  day: 3,
  category: 'procrastinacao',
  categoryName: 'Procrastinação',
  insight: 'O momento perfeito não existe',
  clarity: 'Você fica esperando o momento ideal, as condições perfeitas, o humor certo... Mas esse momento nunca chega! A vida acontece enquanto você espera. O melhor momento para começar é agora, mesmo que não seja perfeito.',
  action: 'Comece algo que você vem adiando há mais de uma semana. Apenas comece!'
};

quotes365[91] = {
  id: 'day_92',
  day: 92,
  category: 'autoconfianca',
  categoryName: 'Autoconfiança',
  insight: 'Você é mais capaz do que imagina',
  clarity: 'Muitas vezes subestimamos nossa própria capacidade. Olhe para trás e veja quantos desafios você já superou, quantas coisas você já aprendeu. Cada experiência, boa ou ruim, te tornou mais forte e sábio.',
  action: 'Liste 3 conquistas suas dos últimos 6 meses, por menores que sejam.'
};

quotes365[182] = {
  id: 'day_183',
  day: 183,
  category: 'habitos',
  categoryName: 'Hábitos Saudáveis',
  insight: 'Hábitos pequenos, mudanças grandes',
  clarity: 'Não precisa revolucionar sua vida de uma vez. Os melhores hábitos são aqueles que você consegue manter consistentemente. É melhor fazer 5 minutos todos os dias do que 2 horas uma vez por semana.',
  action: 'Escolha um hábito que leve apenas 2 minutos e faça agora.'
};

quotes365[273] = {
  id: 'day_274',
  day: 274,
  category: 'exercicio',
  categoryName: 'Exercício e Movimento',
  insight: 'Movimento é vida',
  clarity: 'Seu corpo foi feito para se mover. Não importa se é uma caminhada, dança, alongamento ou exercício intenso. O importante é sair do sedentarismo e ativar sua energia. Cada movimento conta.',
  action: 'Faça 10 polichinelos ou caminhe por 5 minutos agora mesmo.'
};

// Função para buscar citação por dia
export const getQuoteByDay = (dayIndex) => {
  return quotes365[dayIndex] || quotes365[0];
};

// Função para buscar citações por categoria
export const getQuotesByCategory = (category) => {
  return quotes365.filter(quote => quote.category === category);
};

// Função para obter o dia atual (pode ser customizada)
export const getCurrentDay = () => {
  // Por padrão, retorna o dia 1
  // Você pode implementar lógica para calcular o dia baseado na data de início do usuário
  return 1;
};

