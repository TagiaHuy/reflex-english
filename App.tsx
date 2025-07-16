import React, { useState, useEffect } from 'react';
import ScenarioSelector from './components/ScenarioSelector';
import ChatView from './components/ChatView';
import CreateScenarioModal from './components/CreateScenarioModal';
import HomeScreen from './components/HomeScreen';
import { SCENARIOS } from './constants';
import type { Scenario } from './types';

const App: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [showHome, setShowHome] = useState(true);
  
  useEffect(() => {
    // Set dark mode based on user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load scenarios
    const customScenariosRaw = localStorage.getItem('customScenarios');
    const customScenarios = customScenariosRaw ? JSON.parse(customScenariosRaw) : [];
    setScenarios([...SCENARIOS, ...customScenarios]);
  }, []);

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
  };

  const handleExitScenario = () => {
    setCurrentScenario(null);
  };
  
  const handleCreateScenario = (newScenario: Scenario) => {
    const updatedScenarios = [...scenarios, newScenario];
    setScenarios(updatedScenarios);

    const customScenarios = updatedScenarios.filter(s => s.id.startsWith('custom-'));
    localStorage.setItem('customScenarios', JSON.stringify(customScenarios));
    setCreateModalOpen(false);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => {
      const updated = prev.filter(s => s.id !== id);
      // Cập nhật localStorage chỉ cho custom scenarios
      const customScenarios = updated.filter(s => s.id.startsWith('custom-'));
      localStorage.setItem('customScenarios', JSON.stringify(customScenarios));
      return updated;
    });
  };

  if (!process.env.API_KEY) {
      return (
        <div className="bg-slate-100 dark:bg-slate-900 h-screen flex items-center justify-center p-4">
            <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
                <p className="text-slate-600 dark:text-slate-300">
                    The Gemini API key is not configured.
                </p>
                 <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Please ensure the `API_KEY` environment variable is set.
                </p>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-white dark:bg-slate-900">
      {showHome ? (
        <HomeScreen onStart={() => setShowHome(false)} />
      ) : currentScenario ? (
        <ChatView scenario={currentScenario} onExit={handleExitScenario} onBackToHome={() => {
          setCurrentScenario(null);
        }} />
      ) : (
        <ScenarioSelector 
          scenarios={scenarios} 
          onSelectScenario={handleSelectScenario} 
          onStartCreate={() => setCreateModalOpen(true)}
          onBackToHome={() => {
            setShowHome(true);
            setCurrentScenario(null);
          }}
          onDeleteScenario={handleDeleteScenario}
        />
      )}
      <CreateScenarioModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateScenario}
      />
    </div>
  );
};

export default App;
