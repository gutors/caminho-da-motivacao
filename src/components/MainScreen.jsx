import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { categories, voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';
import { ArrowRight, PlayCircle } from 'lucide-react';

export function MainScreen() {
  const navigate = useNavigate();
  const { selectedVoice, user, progress, completedQuotes } = useApp();
  
  const currentVoice = voiceTypes.find(v => v.id === selectedVoice);
  const lastCategory = categories.find(c => c.id === progress?.last_category_id);

  const handleNavigate = (category) => {
    const day = progress?.categories[category.id]?.current_day || 1;
    navigate(`/quote/${category.id}/${selectedVoice}/${day}`);
  };

  const handleContinue = () => {
    if (!progress || !lastCategory) return;
    const day = progress.categories[lastCategory.id]?.current_day || 1;
    navigate(`/quote/${lastCategory.id}/${selectedVoice}/${day}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 right-10 w-12 h-12 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
      <div className="absolute bottom-60 right-32 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      <div className="absolute top-32 left-16 w-14 h-14 bg-blue-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Caminho da Motivação</h1>
        <p className="text-xl text-white/90 drop-shadow">365 dias de apoio e inspiração</p>
      </div>
      
      {/* Card principal */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 mb-8 text-center shadow-lg max-w-2xl mx-auto w-full relative overflow-hidden">
        {/* <div className="text-2xl mb-2">✨</div> */}
        <h2 className="text-xl font-bold text-black mb-2">
          {user?.user_metadata?.display_name && (
            <span className="block text-lg font-medium text-black/80 mb-2">Olá, {user.user_metadata.display_name}!</span>
          )}
          Um passo por dia muda tudo. Qual você vai dar hoje?
        </h2>
        <p className="text-black/80">
          Sua dose diária de motivação te espera
        </p>
      </div>
      {progress && lastCategory && completedQuotes.length > 0 && (
        <div className="max-w-2xl mx-auto w-full mb-6">
            <Button onClick={handleContinue} className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 py-6">
                <PlayCircle className="w-6 h-6 mr-3" />
                Continuar em {lastCategory.name} (Dia {progress.categories[lastCategory.id]?.current_day})
            </Button>
        </div>
      )}

      {/* Modo atual */}
      {/* <div className="bg-blue-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between"> */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={() => navigate('/voice-selection')}
          className="flex items-center gap-2 px-6 py-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
        >
          <span className="text-2xl">{currentVoice?.emoji}</span>
          <span className="text-white font-medium">Modo atual: {currentVoice?.name}</span>
          {/* <p className="text-white/80 text-md">{currentVoice?.name}</p> */}
        </Button>
      </div>
      
      {/* Categorias */}
      <div className="flex-1 max-w-2xl mx-auto w-full mb-10">
        <div className="space-y-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleNavigate(category)}
              className={`w-full p-6 rounded-2xl bg-gradient-to-r ${category.color} text-white text-left shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl relative overflow-hidden group`}
            >
              {/* Elementos decorativos no botão */}
              <div className="absolute top-2 right-2 w-4 h-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/30 rounded-full group-hover:scale-110 transition-transform delay-75"></div>
              
              <div className="flex items-center justify-between z-10">
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{category.emoji}</span>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-white/80" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}