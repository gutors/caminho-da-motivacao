import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AchievementsScreen() {
  const { stats, processedAchievements, unlockedAchievements } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 right-10 w-12 h-12 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-40 right-10 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
      <div className="absolute bottom-30 right-20 w-6 h-6 bg-green-300 rounded-full opacity-60 animate-pulse delay-500"></div>
      <div className="absolute top-32 left-10 w-14 h-14 bg-blue-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      
      

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

      <div className="flex-1 max-w-2xl mx-auto w-full space-y-4 pb-24">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold text-white">{stats.totalCompleted}</p>
            <p className="text-white/80 text-sm">Dias Concluídos</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold text-white">{unlockedAchievements.length}</p>
            <p className="text-white/80 text-sm">Conquistas</p>
          </div>
        </div>

        {/* Lista de conquistas */}
        {processedAchievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl p-6 shadow-lg ${
                isUnlocked ? 'border-2 border-yellow-400' : 'opacity-75'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  
                  {/* Barra de progresso */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progresso</span>
                      <span>{achievement.progress}/{achievement.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${isUnlocked ? 'bg-green-500' : 'bg-gray-400'}`}
                        style={{
                          width: `${(achievement.progress / achievement.goal) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {isUnlocked && (
                  <div className="text-green-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensagem motivacional */}
      <div className="text-center text-white/80 text-sm mb-6">
        <p>Continue sua jornada para desbloquear mais conquistas!</p>
      </div>
    </div>
  );
}
