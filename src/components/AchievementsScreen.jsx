import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AchievementsScreen({ onBack }) {
  const { stats } = useApp();

  const achievements = [
    {
      id: 'first_step',
      title: 'Primeiro Passo',
      description: 'Completou sua primeira citação',
      icon: '🎯',
      progress: stats.completedQuotes > 0 ? 1 : 0,
      total: 1,
      unlocked: stats.completedQuotes > 0
    },
    {
      id: 'three_days',
      title: '3 Dias Seguidos',
      description: 'Manteve uma sequência de 3 dias',
      icon: '🔥',
      progress: Math.min(stats.currentStreak, 3),
      total: 3,
      unlocked: stats.currentStreak >= 3
    },
    {
      id: 'seven_days',
      title: '7 Dias Seguidos',
      description: 'Manteve uma sequência de 7 dias',
      icon: '⭐',
      progress: Math.min(stats.currentStreak, 7),
      total: 7,
      unlocked: stats.currentStreak >= 7
    },
    {
      id: 'first_favorite',
      title: 'Primeira Favorita',
      description: 'Favoritou sua primeira citação',
      icon: '❤️',
      progress: stats.favorites > 0 ? 1 : 0,
      total: 1,
      unlocked: stats.favorites > 0
    },
    {
      id: 'explorer',
      title: 'Explorador',
      description: 'Visitou todas as 4 categorias',
      icon: '🗺️',
      progress: stats.categoriesVisited,
      total: 4,
      unlocked: stats.categoriesVisited >= 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
      <div className="absolute bottom-60 right-32 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      <div className="absolute top-32 left-16 w-14 h-14 bg-blue-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Título */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Conquistas
        </h1>
        <p className="text-white/90 text-lg">
          Sua jornada de progresso
        </p>
      </div>

      {/* Lista de conquistas */}
      <div className="flex-1 space-y-4 pb-24">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white rounded-2xl p-6 shadow-lg ${
              achievement.unlocked ? 'border-2 border-yellow-400' : 'opacity-75'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${
                  achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm ${
                  achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                {/* Barra de progresso */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(achievement.progress / achievement.total) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {achievement.unlocked && (
                <div className="text-green-500">
                  <Trophy className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem motivacional */}
      <div className="text-center text-white/80 text-sm mb-6">
        <p>Continue sua jornada para desbloquear mais conquistas!</p>
      </div>
    </div>
  );
}

