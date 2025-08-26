import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
      <div className="absolute bottom-40 right-32 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      <div className="absolute top-32 left-16 w-14 h-14 bg-blue-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      
      {/* Ícone principal */}
      <div className="text-6xl mb-8 animate-pulse">
        🌱
      </div>
      
      {/* Conteúdo principal */}
      <div className="text-center max-w-md">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Bem-vindo ao seu espaço
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
          de motivação diária.
        </h2>
        
        <p className="text-xl text-white/90 mb-12 max-w-md mx-auto leading-relaxed">
          Aqui você escolhe o que quer trabalhar hoje — e como prefere ouvir isso.
        </p>
        
        <Button 
          onClick={() => navigate('/voice-selection')}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          Continuar ✨
        </Button>
      </div>
    </div>
  );
}

