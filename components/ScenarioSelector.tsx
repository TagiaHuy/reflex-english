import React from 'react';
import type { Scenario } from '../types';
import PlusIcon from './icons/PlusIcon';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  onStartCreate: () => void;
}

const ScenarioCard: React.FC<{ scenario: Scenario; onSelect: () => void }> = ({ scenario, onSelect }) => (
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

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ scenarios, onSelectScenario, onStartCreate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white">
            Reflex English
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Choose a situation to start building your speaking reflexes.
          </p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={() => onSelectScenario(scenario)}
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
