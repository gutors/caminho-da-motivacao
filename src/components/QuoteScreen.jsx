import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function QuoteScreen() {
  const { category, voice, day } = useParams();
  const navigate = useNavigate();
  const { 
    quotesByDay,
    isQuotesLoading,
    toggleFavorite, 
    isFavorite, 
    completeQuote,
    completedQuotes,
  } = useApp();

  const currentDay = parseInt(day, 10);
  const categoryData = categories.find(c => c.id === category);
  const currentVoice = voiceTypes.find(v => v.id === voice);

  const currentQuote = quotesByDay[category]?.[voice]?.[currentDay];
  const isCompleted = currentQuote && completedQuotes.includes(currentQuote.id);

  const handleNavigateDay = (offset) => {
    const newDay = currentDay + offset;
    if (newDay > 0 && newDay <= 365) { // Limite de 365 dias
      navigate(`/quote/${category}/${voice}/${newDay}`);
    }
  };

  const handleComplete = () => {
    if (!currentQuote || isCompleted) return;
    completeQuote(currentQuote.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Caminho da Motivação',
        text: `"${currentQuote.insight}" - ${currentQuote.clarity}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`"${currentQuote.insight}" - ${currentQuote.clarity}`);
      alert('Citação copiada para a área de transferência!');
    }
  };

  if (isQuotesLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando citação...</div>;
  }

  if (!currentQuote) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-600 flex flex-col justify-center items-center p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Citação não encontrada!</h2>
            <p className='mb-6'>Não foi possível carregar a citação para este dia e voz.</p>
            
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-34 left-4 text-4xl animate-bounce z-0">🌸</div>
      <div className="absolute top-6 right-8 text-3xl animate-pulse z-0">🌿</div>
      <div className="absolute bottom-20 left-16 text-4xl animate-bounce delay-300">🦋</div>
      <div className="absolute bottom-20 right-16 text-3xl animate-pulse delay-500">🌺</div> 
      <div className="absolute top-1/5 right-1/6 text-3xl animate-pulse delay-1000">🌼</div>

      
      {/* Categoria e Voz */}
      <div className="flex gap-2 mb-6 justify-center">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryData?.color}`}>
          <span className="text-lg">{categoryData?.emoji}</span>
          <span className="text-white font-medium text-sm">{categoryData?.name}</span>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-blue-300"
        >
          <span className="text-lg">{currentVoice?.emoji}</span>
          <span className="text-gray-800 font-medium text-sm">{currentVoice?.name}</span>
        </div>
      </div>
      {/* Indicador de dia com círculo roxo */}
      <div className="bg-white rounded-full px-6 py-3 mb-6 text-center mx-auto max-w-xs">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {currentDay}
          </div>
          <span className="text-gray-800 font-bold">
            Dia {currentDay} de 365
          </span>
        </div>
      </div>

      {isCompleted && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4 max-w-2xl mx-auto w-full shadow-md">
          <div className="flex items-center">
            <Check className="w-6 h-6 mr-2" />
            <p className="font-bold">Ação Concluída!</p>
          </div>
          <p className="text-sm mt-1">Siga o seu caminho em rumo do seu objetivo!</p>
        </div>
      )}

      {/* Card da Citação */}
      <div className="bg-white rounded-3xl p-4 mb-6 shadow-lg max-w-2xl mx-auto w-full">
        <div className="bg-yellow-400 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="font-bold text-black">Insight</span>
          </div>
          <p className="text-black font-bold text-md">"{currentQuote.insight}"</p>
        </div>
        <div className="bg-blue-400 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔍</span>
            <span className="font-bold text-black">Clareza</span>
          </div>
          <p className="text-gray leading-relaxed text-sm">{currentQuote.clarity}</p>
        </div>
        <div className="bg-green-500 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✅</span>
            <span className="font-bold text-black">Ação Consciente</span>
          </div>
          <p className="text-gray font-medium text-sm">{currentQuote.action}</p>
        </div>
        <div className="flex gap-1 mb-4">
          <Button
            onClick={() => toggleFavorite(currentQuote.id)}
            className={`flex-1 ${ 
              isFavorite(currentQuote.id)
                ? 'bg-pink-500'
                : 'bg-pink-200'
            } text-white text-xs py-2 px-2 rounded-xl h-8`}
          >
            <Heart className={`w-3 h-3 mr-1 ${isFavorite(currentQuote.id) ? 'fill-current' : ''}`} />
            {isFavorite(currentQuote.id) ? 'Favorito' : 'Favoritar'}
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-blue-500 text-white text-xs py-2 px-2 rounded-xl h-8">
            <Share2 className="w-3 h-3 mr-1" />
            Compartilhar
          </Button>
          <Button
            onClick={handleComplete}
            // disabled={isCompleted}
            className={`flex-1 ${ 
              isCompleted ? 'bg-green-600' : 'bg-green-300'
            } text-white text-xs py-2 px-2 rounded-xl h-8`}
          >
            <Check className="w-3 h-3 mr-1" />
            {isCompleted ? 'Concluído' : 'Concluir'}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between max-w-2xl mx-auto w-full mb-24">
        <Button
          onClick={() => handleNavigateDay(-1)}
          disabled={currentDay <= 1}
          className="bg-purple-500/80 hover:bg-purple-600 text-white disabled:opacity-50 px-4 py-2 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        <span className="text-white font-medium bg-white/20 px-2 py-2 rounded-full">
          Dia {currentDay} de 365
        </span>
        <Button
          onClick={() => handleNavigateDay(1)}
          disabled={currentDay >= 365}
          className="bg-purple-500/80 hover:bg-purple-600 text-white disabled:opacity-50 px-4 py-2 rounded-xl"
        >
          Próxima
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}