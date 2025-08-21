import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, RotateCcw, RefreshCw } from 'lucide-react';
import { voiceTypes } from '../data/motivationData';
import { useApp } from '../context/AppContext';

export function SettingsScreen({ onBack, onVoiceChange, onRestartOnboarding }) {
  const { selectedVoice, stats } = useApp();
  const currentVoice = voiceTypes.find(v => v.id === selectedVoice);

  const handleResetData = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleRestartOnboarding = () => {
    if (onRestartOnboarding) {
      onRestartOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col p-6 relative overflow-hidden">
      {/* Elementos decorativos originais */}
      <div className="absolute top-16 right-16 text-4xl animate-bounce">🌸</div>
      <div className="absolute top-32 left-16 text-3xl animate-pulse">🌿</div>
      <div className="absolute bottom-32 left-20 text-4xl animate-bounce delay-300">🦋</div>
      <div className="absolute bottom-60 right-32 text-3xl animate-pulse delay-500">🌺</div>
      <div className="absolute top-48 right-40 text-2xl animate-bounce delay-700">🌱</div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Título */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">⚙️</div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Configurações
        </h1>
        <p className="text-white/90 text-lg">
          Personalize sua experiência
        </p>
      </div>

      {/* Configurações */}
      <div className="flex-1 space-y-4 pb-24 max-w-2xl mx-auto w-full">
        
        {/* Tipo de Voz */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-bold">Tipo de Voz</h3>
                <p className="text-white/80 text-sm">
                  {currentVoice?.name || 'Não selecionado'}
                </p>
              </div>
            </div>
            <Button
              onClick={onVoiceChange}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full"
            >
              Alterar
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            Suas Estatísticas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.completedQuotes}</div>
              <div className="text-white/80 text-xs">Citações Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-white/80 text-xs">Sequência Atual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.favorites}</div>
              <div className="text-white/80 text-xs">Favoritos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.categoriesVisited}/4</div>
              <div className="text-white/80 text-xs">Categorias</div>
            </div>
          </div>
        </div>

        {/* Refazer Onboarding */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-bold">Refazer Onboarding</h3>
                <p className="text-white/80 text-sm">
                  Voltar à tela de boas-vindas
                </p>
              </div>
            </div>
            <Button
              onClick={handleRestartOnboarding}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full"
            >
              Refazer
            </Button>
          </div>
        </div>

        {/* Resetar Dados */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-bold">Resetar Dados</h3>
                <p className="text-white/80 text-sm">
                  Limpar todo o progresso
                </p>
              </div>
            </div>
            <Button
              onClick={handleResetData}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full"
            >
              Resetar
            </Button>
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-white font-bold mb-2">Sobre o App</h3>
          <p className="text-white/80 text-sm">
            Caminho da Motivação - 365 dias de apoio e inspiração para sua jornada pessoal.
          </p>
        </div>
      </div>
    </div>
  );
}

