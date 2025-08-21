import React from 'react';
import { Button } from '@/components/ui/button';
import { categories, voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export function MainScreen({ onCategorySelect, onVoiceChange }) {
  const { selectedVoice } = useApp();
  
  const currentVoice = voiceTypes.find(v => v.id === selectedVoice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
      <div className="absolute bottom-60 right-32 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      <div className="absolute top-32 left-16 w-14 h-14 bg-blue-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Caminho da Motivação
        </h1>
        <p className="text-white/90 text-lg">
          365 Dias de apoio e inspiração
        </p>
      </div>
      
      {/* Card principal */}
      <div className="bg-yellow-400 rounded-3xl p-6 mb-6 text-center shadow-lg">
        <div className="text-2xl mb-2">✨</div>
        <h2 className="text-xl font-bold text-black mb-2">
          Um passo por dia muda tudo. Qual você vai dar hoje?
        </h2>
        <p className="text-black/80">
          Sua dose diária de motivação te espera
        </p>
      </div>
      
      {/* Modo atual */}
      <div className="bg-blue-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentVoice?.emoji}</span>
          <div>
            <p className="text-white font-medium">Modo atual:</p>
            <p className="text-white/80 text-sm">{currentVoice?.name}</p>
          </div>
        </div>
        <Button
          onClick={onVoiceChange}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full"
        >
          Alterar
        </Button>
      </div>
      
      {/* Categorias */}
      <div className="flex-1 space-y-4 pb-32">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full p-6 rounded-xl bg-gradient-to-r ${category.color} text-white text-left shadow-md border border-white/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-95`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{category.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/80" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

