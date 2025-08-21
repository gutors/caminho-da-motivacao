import React from 'react';
import { Trophy, Target, Heart, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function StatsCard({ onAchievementsClick }) {
  const { stats, unlockedAchievements } = useApp();

  const statsItems = [
    {
      icon: Calendar,
      label: 'Dias Completados',
      value: stats.totalCompleted,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      label: 'Sequência Atual',
      value: stats.currentStreak,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Heart,
      label: 'Favoritos',
      value: stats.totalFavorites,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Trophy,
      label: 'Conquistas',
      value: unlockedAchievements.length,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      clickable: true,
      onClick: onAchievementsClick
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
      <h2 className="text-white font-bold mb-4 flex items-center gap-2">
        📊 Suas Estatísticas
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {statsItems.map((item, index) => {
          const Icon = item.icon;
          const Component = item.clickable ? 'button' : 'div';
          
          return (
            <Component
              key={index}
              onClick={item.onClick}
              className={`p-3 rounded-xl bg-white/20 text-center transition-all ${
                item.clickable ? 'hover:bg-white/30 cursor-pointer transform hover:scale-105' : ''
              }`}
            >
              <div className="flex justify-center mb-2">
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {item.value}
              </div>
              <div className="text-white/80 text-xs">
                {item.label}
              </div>
              {item.clickable && (
                <div className="text-white/60 text-xs mt-1">
                  Toque para ver
                </div>
              )}
            </Component>
          );
        })}
      </div>
    </div>
  );
}

