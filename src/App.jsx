import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VoiceSelection } from './components/VoiceSelection';
import { MainScreen } from './components/MainScreen';
import { QuoteScreen } from './components/QuoteScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import './App.css';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);

  const handleWelcomeContinue = () => {
    setCurrentScreen('voice-selection');
  };

  const handleVoiceSelectionBack = () => {
    setCurrentScreen('welcome');
  };

  const handleVoiceSelectionContinue = () => {
    setCurrentScreen('main');
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedQuoteIndex(0); // Resetar para o dia 1 (índice 0) ao selecionar nova categoria
    setCurrentScreen("quote");
  };

  const handleQuoteBack = () => {
    setCurrentScreen('main');
    setSelectedCategory(null);
  };

  const handleVoiceChange = () => {
    setCurrentScreen('voice-selection');
  };

  const handleBottomNavigation = (page) => {
    if (page === 'home') {
      setCurrentScreen('main');
    } else if (page === 'favorites') {
      setCurrentScreen('favorites');
    } else if (page === 'achievements') {
      setCurrentScreen('achievements');
    } else if (page === 'settings') {
      setCurrentScreen('settings');
    }
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleRestartOnboarding = () => {
    setCurrentScreen('welcome');
  };

  const handleFavoriteQuoteSelect = (category, quoteIndex) => {
    setSelectedCategory(category);
    setSelectedQuoteIndex(quoteIndex);
    setCurrentScreen('quote');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onContinue={handleWelcomeContinue} />;
      
      case 'voice-selection':
        return (
          <VoiceSelection 
            onBack={handleVoiceSelectionBack}
            onContinue={handleVoiceSelectionContinue}
          />
        );
      
      case 'main':
        return (
          <div className="relative">
            <MainScreen 
              onCategorySelect={handleCategorySelect}
              onVoiceChange={handleVoiceChange}
            />
            <BottomNavigation 
              currentPage="home"
              onPageChange={handleBottomNavigation}
            />
          </div>
        );
      
      case 'quote':
        return (
          <div className="relative">
            <QuoteScreen 
              category={selectedCategory}
              onBack={handleQuoteBack}
              onVoiceChange={handleVoiceChange}
              currentDay={selectedQuoteIndex + 1} // Passa o dia atual
              onPreviousDay={() => setSelectedQuoteIndex(prev => Math.max(0, prev - 1))} // Handler para dia anterior
              onNextDay={() => setSelectedQuoteIndex(prev => Math.min(364, prev + 1))} // Handler para próximo dia
            />
            <BottomNavigation 
              currentPage="home"
              onPageChange={handleBottomNavigation}
            />
          </div>
        );
      
      case 'favorites':
        return (
          <div className="relative">
            <FavoritesScreen 
              onBack={handleBackToMain}
              onQuoteSelect={handleFavoriteQuoteSelect} 
            />
            <BottomNavigation 
              currentPage="favorites"
              onPageChange={handleBottomNavigation}
            />
          </div>
        );

      case 'achievements':
        return (
          <div className="relative">
            <AchievementsScreen onBack={handleBackToMain} />
            <BottomNavigation 
              currentPage="achievements"
              onPageChange={handleBottomNavigation}
            />
          </div>
        );
      
      case 'settings':
        return (
          <div className="relative">
            <SettingsScreen 
              onBack={handleBackToMain}
              onVoiceChange={handleVoiceChange}
              onRestartOnboarding={handleRestartOnboarding}
            />
            <BottomNavigation 
              currentPage="settings"
              onPageChange={handleBottomNavigation}
            />
          </div>
        );
      
      default:
        return <WelcomeScreen onContinue={handleWelcomeContinue} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

