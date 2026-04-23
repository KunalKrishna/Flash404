/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, SRSState, Difficulty, StudySetId, SessionMode } from './types';
import { getInitialState, updateCard, getDueCards, getPracticeCards, saveState } from './lib/srs';
import { HTTP_STATUS_CODES, STUDY_SETS } from './constants';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import ListView from './components/ListView';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { auth, signInWithGoogle, signOut, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [state, setState] = useState<SRSState>(getInitialState());
  const [user, setUser] = useState<User | null>(null);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [studySet, setStudySet] = useState<StudySetId>('all');
  const [sessionMode, setSessionMode] = useState<SessionMode>('srs');
  const [customCodes, setCustomCodes] = useState<number[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    console.log("Setting up auth listener...");
    return onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u ? `User: ${u.email}` : "No user");
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        // Fallback to local storage if logged out
        const localState = getInitialState();
        setState(localState);
        const localCustom = localStorage.getItem('http_status_custom_set');
        setCustomCodes(localCustom ? JSON.parse(localCustom) : []);
      }
    });
  }, []);

  // Sync with Firestore
  useEffect(() => {
    if (!user) return;

    console.log("Starting Firestore sync for user:", user.uid);
    setIsSyncing(true);
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        console.log("Remote data found, syncing state...");
        const remoteData = doc.data();
        if (remoteData.cards) {
          setState({ cards: remoteData.cards });
        }
        if (remoteData.customCodes) {
          setCustomCodes(remoteData.customCodes);
        }
      } else {
        console.log("No remote data, initializing cloud doc...");
        // First time user, push local state to cloud
        setDoc(userRef, {
          cards: state.cards,
          customCodes: customCodes,
          lastUpdated: serverTimestamp()
        }, { merge: true });
      }
      setIsSyncing(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle local persistence for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('http_status_custom_set', JSON.stringify(customCodes));
      saveState(state);
    }
  }, [customCodes, state, user]);

  const studySetCodes = useMemo(() => {
    switch (studySet) {
      case 'top10': return STUDY_SETS.TOP_10;
      case 'top16': return STUDY_SETS.TOP_16;
      case 'top20': return STUDY_SETS.TOP_20;
      case 'custom': return customCodes;
      default: return undefined;
    }
  }, [studySet, customCodes]);

  const sessionCards = useMemo(() => {
    if (sessionMode === 'srs') {
      return getDueCards(state, studySetCodes);
    }
    return getPracticeCards(state, studySetCodes);
  }, [state, studySetCodes, sessionMode]);

  const currentDueCard = sessionCards[sessionIndex];

  const handleResult = useCallback((difficulty: Difficulty) => {
    if (currentDueCard) {
      const newState = updateCard(state, currentDueCard.code, difficulty);
      setState(newState);
      setSessionIndex(prev => prev + 1);

      // Sync to cloud if logged in
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, {
          cards: newState.cards,
          lastUpdated: serverTimestamp()
        }, { merge: true });
      }
    }
  }, [currentDueCard, state, user]);

  const startSession = useCallback((mode: SessionMode) => {
    setSessionMode(mode);
    setSessionIndex(0);
    setView('study');
  }, []);

  const resetSession = useCallback(() => {
    setSessionIndex(0);
    setView('dashboard');
  }, []);

  const onUpdateCustomCodes = useCallback((codes: number[]) => {
    setCustomCodes(codes);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, {
        customCodes: codes,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    }
  }, [user]);

  const handleSignIn = async () => {
    setAuthLoading(true);
    console.log("Initiating Google Sign-In...");
    try {
      const u = await signInWithGoogle();
      console.log("Sign-in function resolved for:", u?.email);
    } catch (error: any) {
      setAuthLoading(false);
      console.error("Detailed sign-in error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Sign-in cancelled by user.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("Sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized for Firebase Auth. Please add this URL to the 'Authorized Domains' list in your Firebase Console (Authentication > Settings).");
      } else {
        alert(`Sign-in error: ${error.message}`);
      }
    }
  };

  const currentHTTPCard = useMemo(() => {
    if (!currentDueCard) return null;
    return HTTP_STATUS_CODES.find(c => c.code === currentDueCard.code) || null;
  }, [currentDueCard]);

  const isSessionComplete = sessionIndex >= sessionCards.length && sessionCards.length > 0;

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
            {/* Header with Auth */}
            <div className="max-w-4xl mx-auto px-8 pt-8 flex justify-end">
              {authLoading ? (
                <div className="bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-brand-accent/30 border-t-brand-accent animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Authenticating...</span>
                  </div>
                </div>
              ) : user ? (
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-sm group">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full border border-slate-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-brand-accent/10 flex items-center justify-center">
                        <UserIcon size={12} className="text-brand-accent" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-brand-text truncate max-w-[120px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-rose-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-accent transition-all group"
                >
                  <LogIn size={14} className="text-brand-muted group-hover:text-brand-accent" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Sign in with Google</span>
                </button>
              )}
            </div>

            <Dashboard 
              state={state} 
              setView={setView} 
              studySet={studySet} 
              setStudySet={setStudySet} 
              customCodes={customCodes}
              setCustomCodes={onUpdateCustomCodes}
              startSession={startSession}
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
                <span className="font-bold text-sm">Flash404</span>
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
            {sessionCards.length > 0 && !isSessionComplete && (
              <div className="absolute bottom-0 left-0 w-full h-[6px] bg-slate-200">
                <motion.div 
                  initial={false}
                  animate={{ width: `${(sessionIndex / sessionCards.length) * 100}%` }}
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
