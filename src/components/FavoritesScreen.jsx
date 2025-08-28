import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/motivationData';

export function FavoritesScreen() {
  const { supabase, favorites, toggleFavorite, progress } = useApp();
  const navigate = useNavigate();
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteQuotes = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      // Agrupa os favoritos por categoria para fazer uma query por tabela
      const groupedFavorites = favorites.reduce((acc, fav) => {
        if (!acc[fav.category]) {
          acc[fav.category] = [];
        }
        acc[fav.category].push(fav.quote_id);
        return acc;
      }, {});

      try {
        const promises = Object.entries(groupedFavorites).map(async ([category, ids]) => {
          const tableName = `quotes_${category}`;
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .in('id', ids);

          if (error) {
            console.error(`Erro ao buscar favoritos da categoria ${category}:`, error);
            return [];
          }
          // Adiciona a informação da categoria aos dados da citação
          return data.map(q => ({ ...q, category }));
        });

        const results = await Promise.all(promises);
        const allQuotes = results.flat(); // Achata o array de arrays
        
        // Adiciona os dados da categoria (emoji, cor, etc)
        const enrichedQuotes = allQuotes.map(quote => ({
            ...quote,
            categoryData: categories.find(c => c.id === quote.category)
        }));

        setFavoriteQuotes(enrichedQuotes);
      } catch (error) {
        console.error('Erro ao processar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteQuotes();
  }, [favorites, supabase]);

  const handleNavigateToQuote = (category) => {
    const day = progress.categories[category]?.current_day || 1;
    // A navegação para um dia específico dentro dos favoritos pode ser complexa,
    // por enquanto, vamos levar para o dia atual do usuário naquela categoria.
    navigate(`/quote/${category}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando favoritos...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6 pb-24 relative overflow-hidden">
      {/* Elementos decorativos originais */}
      <div className="absolute top-16 right-16 text-4xl animate-bounce">🌸</div>
      <div className="absolute top-32 left-16 text-3xl animate-pulse">🌿</div>
      <div className="absolute bottom-32 left-20 text-4xl animate-bounce delay-300">🦋</div>
      <div className="absolute bottom-60 right-32 text-3xl animate-pulse delay-500">🌺</div>
      <div className="absolute top-48 right-40 text-2xl animate-bounce delay-700">🌱</div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => navigate(-1)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Título */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="text-4xl font-bold text-white mb-2">Favoritos</h1>
        <p className="text-white/90 text-lg">Suas citações salvas para inspiração</p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Lista de favoritos */}
        {favoriteQuotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💫</div>
            <h2 className="text-xl font-bold text-white mb-2">Nenhum favorito ainda</h2>
            <p className="text-white/80 mb-6">Favorite citações que te inspiram para encontrá-las facilmente aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteQuotes.map((quote) => (
              <div key={`${quote.category}-${quote.id}`} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                {/* Header da categoria */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${quote.categoryData?.color} text-xs`}>
                    <span>{quote.categoryData?.emoji}</span>
                    <span className="text-white font-medium">{quote.categoryData?.name}</span>
                  </div>
                  <button onClick={() => toggleFavorite(quote.id, quote.category)} className="text-pink-300 hover:text-pink-500 transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                {/* Conteúdo da citação */}
                <div className="mb-3">
                  <h3 className="text-white font-bold text-lg mb-2">"{quote.insight}"</h3>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{quote.clarity}</p>
                </div>
                {/* Botão para ver completa */}
                <Button onClick={() => handleNavigateToQuote(quote.category)} className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  Ver citação na categoria
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}