import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { quotes, categories } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function FavoritesScreen({ onQuoteSelect }) {
  const { favorites, toggleFavorite } = useApp();

  const getFavoriteQuotes = () => {
    return favorites.map(fav => {
      const categoryQuotes = quotes[fav.category] || [];
      const quote = categoryQuotes.find(q => q.id === fav.id);
      const category = categories.find(c => c.id === fav.category);
      
      return {
        ...quote,
        category: fav.category,
        categoryData: category
      };
    }).filter(Boolean);
  };

  const favoriteQuotes = getFavoriteQuotes();

  const handleRemoveFavorite = (quoteId, category) => {
    toggleFavorite(quoteId, category);
  };

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
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Título */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Favoritos
        </h1>
        <p className="text-white/90 text-lg">
          Suas citações salvas para inspiração
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Lista de favoritos */}
        {favoriteQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💫</div>
          <h2 className="text-xl font-bold text-white mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-white/80 mb-6">
            Favorite citações que te inspiram para encontrá-las facilmente aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteQuotes.map((quote) => (
            <div
              key={`${quote.category}-${quote.id}`}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              {/* Header da categoria */}
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${quote.categoryData.color} text-xs`}>
                  <span>{quote.categoryData.emoji}</span>
                  <span className="text-white font-medium">{quote.categoryData.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(quote.id, quote.category)}
                  className="text-pink-300 hover:text-pink-500 transition-colors"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Conteúdo da citação */}
              <div className="mb-3">
                <h3 className="text-white font-bold text-lg mb-2">
                  "{quote.insight}"
                </h3>
                <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                  {quote.clarity}
                </p>
              </div>

              {/* Botão para ver completa */}
              <Button
                onClick={() => onQuoteSelect(quote.category, quote.id - 1)}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                Ver citação completa
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

