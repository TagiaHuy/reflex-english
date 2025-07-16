import React from 'react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
  speakerInfo?: {
    name: string;
    age: string;
    occupation: string;
    personality: string;
    funFact: string;
  } | null;
  isLoading: boolean;
}

const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose, content, speakerInfo, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 md:p-8 transform transition-all max-h-screen overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Role-play Story</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="space-y-6 text-slate-600 dark:text-slate-300">
          {isLoading ? (
            <div className="w-full flex flex-col gap-4">
              <div className="bg-slate-200 dark:bg-slate-700/50 animate-pulse rounded h-6 w-3/4" />
              <div className="bg-slate-200 dark:bg-slate-700/50 animate-pulse rounded h-6 w-5/6" />
              <div className="bg-slate-200 dark:bg-slate-700/50 animate-pulse rounded h-6 w-2/3" />
            </div>
          ) : (
            <>
              {speakerInfo && (
                <div className="mb-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Speaker Info</h3>
                  <ul className="text-base space-y-1">
                    <li><span className="font-medium">Name:</span> {speakerInfo.name}</li>
                    <li><span className="font-medium">Age:</span> {speakerInfo.age}</li>
                    <li><span className="font-medium">Occupation:</span> {speakerInfo.occupation}</li>
                    <li><span className="font-medium">Personality:</span> {speakerInfo.personality}</li>
                    <li><span className="font-medium">Fun Fact:</span> {speakerInfo.funFact}</li>
                  </ul>
                </div>
              )}
              <p className="whitespace-pre-line text-base">{content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryModal; 