import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { quotes365, getQuoteByDay } from '../data/quotes365';
import { categories, voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function QuoteScreen({ onVoiceChange, currentDay, onPreviousDay, onNextDay }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const { selectedVoice, toggleFavorite, isFavorite, completeQuote } = useApp();
  
  const currentQuote = getQuoteByDay(currentDay - 1);
  const currentVoice = voiceTypes.find(v => v.id === selectedVoice);
  const categoryData = categories.find(c => c.id === currentQuote.category);
  
  if (!currentQuote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Citação não encontrada</h2>
          <Button onClick={onBack} className="bg-white text-black">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    onPreviousDay();
  };

  const handleNext = () => {
    onNextDay();
  };

  const handleFavorite = () => {
    toggleFavorite(currentQuote.id, category);
  };

  const handleComplete = () => {
    completeQuote(currentQuote.id, category);
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
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryData.color}`}>
          <span className="text-lg">{categoryData.emoji}</span>
          <span className="text-white font-medium text-sm">{categoryData.name}</span>
        </div>
        <button
          onClick={onVoiceChange}
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
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Card da citação */}
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg max-w-2xl mx-auto w-full">
        {/* Insight */}
        <div className="bg-yellow-400 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="font-bold text-black">Insight</span>
          </div>
          <p className="text-black font-bold text-lg">"{currentQuote.insight}"</p>
        </div>
        
        {/* Clareza */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔍</span>
            <span className="font-bold text-gray-800">Clareza</span>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">
            {currentQuote.clarity}
          </p>
        </div>
        
        {/* Ação Consciente */}
        <div className="bg-green-500 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✅</span>
            <span className="font-bold text-white">Ação Consciente</span>
          </div>
          <p className="text-white font-medium text-sm">
            {currentQuote.action}
          </p>
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={handleFavorite}
            className={`flex-1 ${
              isFavorite(currentQuote.id, currentQuote.category)
                ? 'bg-pink-500 hover:bg-pink-600'
                : 'bg-pink-400 hover:bg-pink-500'
            } text-white text-xs py-2 px-2 rounded-xl h-8`}
          >
            <Heart className={`w-3 h-3 mr-1 ${isFavorite(currentQuote.id, currentQuote.category) ? 'fill-current' : ''}`} />
            <span className="text-xs">Favoritar</span>
          </Button>
          
          <Button
            onClick={handleShare}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-2 rounded-xl h-8"
          >
            <Share2 className="w-3 h-3 mr-1" />
            <span className="text-xs">Compartilhar</span>
          </Button>
          
          <Button
            onClick={handleComplete}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-2 rounded-xl h-8"
          >
            <Check className="w-3 h-3 mr-1" />
            <span className="text-xs">Concluir</span>
          </Button>
        </div>
      </div>
      
      {/* Navegação entre citações - estilo original */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full mb-24">
        <Button
          onClick={onPreviousDay}
          disabled={currentDay === 1}
          className="bg-purple-500/80 hover:bg-purple-600 text-white border border-white/30 disabled:opacity-50 px-4 py-2 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        
        <span className="text-white font-medium bg-white/20 px-4 py-2 rounded-full">
          Dia {currentDay} de 365
        </span>
        
        <Button
          onClick={onNextDay}
          disabled={currentDay >= 365}
          className="bg-purple-500/80 hover:bg-purple-600 text-white border border-white/30 disabled:opacity-50 px-4 py-2 rounded-xl"
        >
          Próxima
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

