import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AuthScreen from './components/AuthScreen';
import AuthHandler from './components/AuthHandler';
import { MainScreen } from './components/MainScreen';
import { QuoteScreen } from './components/QuoteScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { VoiceSelection } from './components/VoiceSelection';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BottomNavigation } from './components/BottomNavigation';
import './App.css';

function ProtectedRoute({ children }) {
  const { session, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/auth-handler" element={<AuthHandler />} />
          <Route
            path="/"
            element={<ProtectedRoute><MainLayout /></ProtectedRoute>}
          >
            <Route index element={<MainScreen />} />
            <Route path="quote/:category/:day" element={<QuoteScreen />} />
            <Route path="favorites" element={<FavoritesScreen />} />
            <Route path="achievements" element={<AchievementsScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
          </Route>
          <Route
            path="/voice-selection"
            element={<ProtectedRoute><VoiceSelection /></ProtectedRoute>}
          />
          <Route
            path="/welcome"
            element={<ProtectedRoute><WelcomeScreen /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen relative">
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
}

export default App;
