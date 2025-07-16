import React from 'react';
import type { Scenario } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/ResetIcon'; // Tạm dùng icon Reset cho thùng rác

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  onStartCreate: () => void;
  onBackToHome: () => void;
  onDeleteScenario: (id: string) => void;
}

const ScenarioCard: React.FC<{ scenario: Scenario; onSelect: () => void; onDelete?: () => void }> = ({ scenario, onSelect, onDelete }) => (
  <div className="relative group">
    <button
      onClick={onSelect}
      className="w-full h-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 text-left flex flex-col items-start"
    >
      <div className="text-4xl mb-4">{scenario.emoji}</div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{scenario.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 flex-grow">{scenario.description}</p>
      <div className="mt-4 text-blue-500 dark:text-blue-400 font-semibold flex items-center">
        Start Practice
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </button>
    {onDelete && (
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="absolute top-2 right-2 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete scenario"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    )}
  </div>
);

const CreateScenarioCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="w-full h-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 transform transition-all duration-300 text-left flex flex-col items-center justify-center text-center"
    >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mb-4">
            <PlusIcon className="w-8 h-8 text-slate-500 dark:text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">Create Your Own</h3>
        <p className="text-slate-500 dark:text-slate-400 flex-grow">Define a custom situation and AI personality for targeted practice.</p>
    </button>
)

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ scenarios, onSelectScenario, onStartCreate, onBackToHome, onDeleteScenario }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center mb-12">
          <button onClick={onBackToHome} className="mr-4 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Back to Home">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white">
              Reflex English
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Choose a situation to start building your speaking reflexes.
            </p>
          </div>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={() => onSelectScenario(scenario)}
              onDelete={() => onDeleteScenario(scenario.id)}
            />
          ))}
          <CreateScenarioCard onClick={onStartCreate} />
        </main>
        <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>Powered by Gemini. Built for practice.</p>
        </footer>
      </div>
    </div>
  );
};

export default ScenarioSelector;
