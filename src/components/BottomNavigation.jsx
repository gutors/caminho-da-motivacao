import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Star, Trophy, Settings } from 'lucide-react';

export function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home', emoji: '🏠' },
    { id: 'favorites', path: '/favorites', icon: Star, label: 'Favoritos', emoji: '⭐' },
    { id: 'achievements', path: '/achievements', icon: Trophy, label: 'Conquistas', emoji: '🏆' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Configurações', emoji: '⚙️' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg mb-1">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}