import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function VoiceSelection() {
  const navigate = useNavigate();
  const { selectedVoice, updateSelectedVoice } = useApp();

  const handleVoiceSelect = (voiceId) => {
    updateSelectedVoice(voiceId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
      <div className="absolute bottom-60 right-32 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      <div className="absolute top-32 left-16 w-14 h-14 bg-blue-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      
      {/* Ícone principal */}
      <div className="text-6xl text-center mb-8 animate-pulse">
        🌱
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center leading-tight">
          4 tons. 4 personalidades para conversar com você.
        </h1>
        
        <p className="text-xl text-white/90 mb-8 text-center">
          Escolha como prefere ser motivado hoje.
        </p>
        
        {/* Grid de vozes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          {voiceTypes.map((voice) => (
            <button
              key={voice.id}
              onClick={() => handleVoiceSelect(voice.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedVoice === voice.id
                  ? 'bg-white border-yellow-400 text-black shadow-lg'
                  : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
              }`}
            >
              <div className="text-4xl mb-3">{voice.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{voice.name}</h3>
              <p className={`text-sm ${
                selectedVoice === voice.id ? 'text-gray-600' : 'text-white/80'
              }`}>
                {voice.description}
              </p>
            </button>
          ))}
        </div>
        
        <p className="text-yellow-300 text-center mb-6 text-sm">
          💡 Você pode alterar o estilo a qualquer momento
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          disabled={!selectedVoice}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continuar ✨
        </Button>
      </div>
    </div>
  );
}