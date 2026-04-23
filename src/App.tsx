/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, SRSState, Difficulty, StudySetId } from './types';
import { getInitialState, updateCard, getDueCards } from './lib/srs';
import { HTTP_STATUS_CODES, STUDY_SETS } from './constants';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import ListView from './components/ListView';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [state, setState] = useState<SRSState>(getInitialState());
  const [sessionIndex, setSessionIndex] = useState(0);
  const [studySet, setStudySet] = useState<StudySetId>('all');

  const studySetCodes = useMemo(() => {
    switch (studySet) {
      case 'top10': return STUDY_SETS.TOP_10;
      case 'top16': return STUDY_SETS.TOP_16;
      case 'top20': return STUDY_SETS.TOP_20;
      default: return undefined;
    }
  }, [studySet]);

  const dueCards = useMemo(() => getDueCards(state, studySetCodes), [state, studySetCodes]);
  const currentDueCard = dueCards[sessionIndex];

  const handleResult = useCallback((difficulty: Difficulty) => {
    if (currentDueCard) {
      const newState = updateCard(state, currentDueCard.code, difficulty);
      setState(newState);
      setSessionIndex(prev => prev + 1);
    }
  }, [currentDueCard, state]);

  const resetSession = useCallback(() => {
    setSessionIndex(0);
    setView('dashboard');
  }, []);

  const currentHTTPCard = useMemo(() => {
    if (!currentDueCard) return null;
    return HTTP_STATUS_CODES.find(c => c.code === currentDueCard.code) || null;
  }, [currentDueCard]);

  const isSessionComplete = sessionIndex >= dueCards.length && dueCards.length > 0;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard 
              state={state} 
              setView={setView} 
              studySet={studySet} 
              setStudySet={setStudySet} 
            />
          </motion.div>
        )}

        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ListView state={state} setView={setView} />
          </motion.div>
        )}

        {view === 'study' && (
          <motion.div
            key="study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col relative overflow-hidden"
          >
            {/* Minimal Study Header */}
            <header className="flex justify-between items-center px-12 py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-accent rounded-md" />
                <span className="font-bold text-sm">StatusRecall</span>
              </div>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={resetSession}
                  className="text-[11px] font-bold text-brand-muted hover:text-brand-text uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <X size={14} /> Quit Session
                </button>
              </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
              {currentHTTPCard && !isSessionComplete ? (
                <div className="w-full flex flex-col items-center justify-center">
                  <Flashcard 
                    card={currentHTTPCard} 
                    currentLevel={currentDueCard.level}
                    onResult={handleResult} 
                  />
                  <div className="hidden lg:block mt-20 text-[11px] font-semibold text-brand-muted uppercase tracking-[0.2em] animate-pulse">
                    Use Space to Reveal & Toggle
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center glass-card p-16 rounded-[40px] max-w-md"
                >
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Trophy size={32} />
                  </div>
                  <h2 className="text-3xl font-black mb-4 tracking-tight">Well Done!</h2>
                  <p className="text-brand-muted mb-10 text-lg leading-relaxed">
                    You've successfully reviewed all due cards for this session. Your knowledge is growing.
                  </p>
                  <button
                    onClick={resetSession}
                    className="w-full py-4 bg-brand-accent text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                  >
                    Return to Library
                  </button>
                </motion.div>
              )}
            </main>

            {/* Sticky bottom progress bar */}
            {dueCards.length > 0 && (
              <div className="absolute bottom-0 left-0 w-full h-[6px] bg-slate-200">
                <motion.div 
                  initial={false}
                  animate={{ width: `${(sessionIndex / dueCards.length) * 100}%` }}
                  className="h-full bg-brand-accent shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
