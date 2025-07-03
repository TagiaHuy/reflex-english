import React, { useState } from 'react';
import type { Scenario } from '../types';
import PlusIcon from './icons/PlusIcon';
import DiceIcon from './icons/DiceIcon';
import { geminiService } from '../services/geminiService';

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (scenario: Scenario) => void;
}

const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [error, setError] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const randomScenarios = [
    {
      title: 'Ordering Coffee',
      emoji: '☕',
      description: 'Practice ordering coffee at a café.',
      systemPrompt: 'You are a friendly barista at a busy coffee shop. The user is a customer. Greet them, take their order, and make small talk.'
    },
    {
      title: 'Job Interview',
      emoji: '💼',
      description: 'Simulate a job interview for an office position.',
      systemPrompt: 'You are an HR manager interviewing the user for an office job. Ask about their experience, skills, and why they want the job.'
    },
    {
      title: 'At the Airport',
      emoji: '✈️',
      description: 'Practice asking for help at an airport.',
      systemPrompt: 'You are an airport staff member. The user is a traveler who needs help finding their gate and understanding announcements.'
    },
    {
      title: 'Making a Doctor Appointment',
      emoji: '🩺',
      description: 'Practice making a doctor appointment over the phone.',
      systemPrompt: 'You are a clinic receptionist. The user wants to book a doctor appointment. Ask for their details and suggest available times.'
    },
    {
      title: 'Hotel Check-in',
      emoji: '🏨',
      description: 'Practice checking in at a hotel.',
      systemPrompt: 'You are a hotel front desk clerk. The user is checking in. Greet them, confirm their reservation, and explain hotel amenities.'
    },
  ];

  const surpriseMe = async () => {
    setLoadingAI(true);
    setAiError('');
    try {
      const aiScenario = await geminiService.generateRandomScenarioAI();
      if (aiScenario) {
        setTitle(aiScenario.title);
        setEmoji(aiScenario.emoji);
        setDescription(aiScenario.description);
        setSystemPrompt(aiScenario.systemPrompt);
        setError('');
      } else {
        setAiError('Could not generate scenario. Please try again.');
      }
    } catch (e) {
      setAiError('Could not generate scenario. Please try again.');
    }
    setLoadingAI(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !systemPrompt.trim()) {
      setError('Please fill out Title, Description, and AI Persona fields.');
      return;
    }
    setError('');
    const newScenario: Scenario = {
      id: `custom-${Date.now()}`,
      title,
      emoji,
      description,
      systemPrompt,
    };
    onCreate(newScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto p-6 md:p-8 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Scenario</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={surpriseMe}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-200 transition-colors shadow"
              title="Surprise Me! Generate a random scenario"
              disabled={loadingAI}
            >
              {loadingAI ? (
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              ) : (
                <DiceIcon className="w-6 h-6" />
              )}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Scenario Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Asking for Directions"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="emoji" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Emoji</label>
              <input
                type="text"
                id="emoji"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                maxLength={2}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-center text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="A short, one-sentence summary of the practice situation."
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300">AI Persona & Instructions</label>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={4}
              placeholder="e.g., You are a helpful local resident. The user is a tourist who is lost. Be friendly, clear, and give simple directions."
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This tells the AI who to be. Be specific for the best results!</p>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          {aiError && <div className="text-xs text-red-500 mt-1 text-right">{aiError}</div>}

          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
              <PlusIcon className="w-5 h-5 mr-2 -ml-1"/>
              Create Scenario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScenarioModal;