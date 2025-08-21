import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';
import { achievements } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function AchievementsModal({ isOpen, onClose }) {
  const { unlockedAchievements, stats } = useApp();

  if (!isOpen) return null;

  const getAchievementStatus = (achievement) => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    let progress = 0;
    let isCompleted = false;

    switch (achievement.id) {
      case 'primeiro-passo':
        progress = Math.min(stats.totalCompleted, 1);
        isCompleted = stats.totalCompleted >= 1;
        break;
      case 'sequencia-3':
        progress = Math.min(stats.currentStreak, 3);
        isCompleted = stats.currentStreak >= 3;
        break;
      case 'sequencia-7':
        progress = Math.min(stats.currentStreak, 7);
        isCompleted = stats.currentStreak >= 7;
        break;
      case 'explorador':
        progress = stats.categoriesVisited;
        isCompleted = stats.categoriesVisited >= 4;
        break;
      case 'colecionador':
        progress = Math.min(stats.totalFavorites, 10);
        isCompleted = stats.totalFavorites >= 10;
        break;
      default:
        break;
    }

    return { isUnlocked, progress, isCompleted };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-2xl font-bold text-white">Conquistas</h2>
          <p className="text-white/90 text-sm">Sua jornada de progresso</p>
        </div>

        {/* Lista de conquistas */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {achievements.map((achievement) => {
            const { isUnlocked, progress, isCompleted } = getAchievementStatus(achievement);
            const progressPercentage = typeof achievement.requirement === 'number' 
              ? (progress / achievement.requirement) * 100 
              : isCompleted ? 100 : 0;

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isUnlocked
                    ? 'border-yellow-400 bg-yellow-50'
                    : isCompleted
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`text-2xl ${isUnlocked || isCompleted ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${isUnlocked || isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${isUnlocked || isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {(isUnlocked || isCompleted) && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                {/* Barra de progresso */}
                {typeof achievement.requirement === 'number' && !isUnlocked && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progresso</span>
                      <span>{progress}/{achievement.requirement}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="mt-2 text-xs font-medium">
                  {isUnlocked ? (
                    <span className="text-yellow-600">🎉 Desbloqueada!</span>
                  ) : isCompleted ? (
                    <span className="text-green-600">✅ Completa!</span>
                  ) : (
                    <span className="text-gray-500">🔒 Bloqueada</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Continue sua jornada para desbloquear mais conquistas!
          </p>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
          >
            Continuar Jornada
          </Button>
        </div>
      </div>
    </div>
  );
}

