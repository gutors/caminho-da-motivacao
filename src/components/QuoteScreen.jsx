import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function QuoteScreen() {
  const { category, day } = useParams();
  const navigate = useNavigate();
  const { supabase, selectedVoice, toggleFavorite, isFavorite, completeQuote } = useApp();

  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDay = parseInt(day, 10);
  const categoryData = categories.find(c => c.id === category);
  const currentVoice = voiceTypes.find(v => v.id === selectedVoice);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      const tableName = `quotes_${category}`;
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('voice_type', selectedVoice)
        .eq('id', currentDay); // Assumindo que o ID da citação corresponde ao dia

      if (error || data.length === 0) {
        console.error('Erro ao buscar citação:', error);
        setCurrentQuote(null);
      } else {
        setCurrentQuote(data[0]);
      }
      setLoading(false);
    };

    if (category && currentDay && selectedVoice) {
      fetchQuote();
    }
  }, [category, currentDay, selectedVoice, supabase]);

  const handleNavigateDay = (offset) => {
    const newDay = currentDay + offset;
    if (newDay > 0 && newDay <= 365) { // Limite de 365 dias
      navigate(`/quote/${category}/${newDay}`);
    }
  };

  const handleComplete = () => {
    if (!currentQuote) return;
    completeQuote(category, currentQuote.id, selectedVoice);
    handleNavigateDay(1); // Avança para o próximo dia após concluir
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando citação...</div>;
  }

  if (!currentQuote) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-600 flex flex-col justify-center items-center p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Citação não encontrada!</h2>
            <p className='mb-6'>Não foi possível carregar a citação para este dia e voz.</p>
            <Button onClick={() => navigate(-1)} className="bg-white text-black">Voltar</Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos originais - borboletas, plantas e flores */}
      <div className="absolute top-16 right-16 text-4xl animate-bounce">🌸</div>
      <div className="absolute top-32 left-16 text-3xl animate-pulse">🌿</div>
      <div className="absolute bottom-32 left-20 text-4xl animate-bounce delay-300">🦋</div>
      <div className="absolute bottom-60 right-32 text-3xl animate-pulse delay-500">🌺</div>
      <div className="absolute top-48 right-40 text-2xl animate-bounce delay-700">🌱</div>
      <div className="absolute bottom-80 left-40 text-3xl animate-pulse delay-1000">🌼</div>
      
      {/* Header com botão voltar */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
      {/* Categoria e Voz */}
      <div className="flex gap-2 mb-6 justify-center">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryData?.color}`}>
          <span className="text-lg">{categoryData?.emoji}</span>
          <span className="text-white font-medium text-sm">{categoryData?.name}</span>
        </div>
        <button
          onClick={() => navigate('/voice-selection')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-blue-300"
        >
          <span className="text-lg">{currentVoice?.emoji}</span>
          <span className="text-gray-800 font-medium text-sm">{currentVoice?.name}</span>
        </button>
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
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg max-w-2xl mx-auto w-full">
        <div className="bg-yellow-400 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="font-bold text-black">Insight</span>
          </div>
          <p className="text-black font-bold text-lg">"{currentQuote.insight}"</p>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔍</span>
            <span className="font-bold text-gray-800">Clareza</span>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            {currentQuote.clarity}
          </p>
        </div>
        <div className="bg-green-500 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✅</span>
            <span className="font-bold text-white">Ação Consciente</span>
          </div>
          <p className="text-white font-medium text-sm">
            {currentQuote.action}
          </p>
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => toggleFavorite(currentQuote.id, category)}
            className={`flex-1 ${
              isFavorite(currentQuote.id, category)
                ? 'bg-pink-500'
                : 'bg-pink-200'
            } text-white text-xs py-2 px-2 rounded-xl h-8`}
          >
            <Heart className={`w-3 h-3 mr-1 ${isFavorite(currentQuote.id, category) ? 'fill-current' : ''}`} />
            Favoritar
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-blue-500 text-white text-xs py-2 px-2 rounded-xl h-8">
            <Share2 className="w-3 h-3 mr-1" />
            Compartilhar
          </Button>
          
          <Button
            onClick={handleComplete}
            className="flex-1 bg-green-600 text-white text-xs py-2 px-2 rounded-xl h-8">
            <Check className="w-3 h-3 mr-1" />
            Concluir
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
        <span className="text-white font-medium bg-white/20 px-4 py-2 rounded-full">
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