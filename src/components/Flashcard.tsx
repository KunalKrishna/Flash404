import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HTTPStatusCode, Difficulty } from "../types";
import { getIntervalForDifficulty } from "../lib/srs";

interface FlashcardProps {
  card: HTTPStatusCode;
  currentLevel: number;
  onResult: (difficulty: Difficulty) => void;
}

export default function Flashcard({ card, currentLevel, onResult }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.code]);

  const handleFlip = useCallback(() => setIsFlipped(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === "1") onResult("again");
        if (e.key === "2") onResult("hard");
        if (e.key === "3") onResult("good");
        if (e.key === "4") onResult("easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, isFlipped, onResult]);

  const getTheme = (code: number) => {
    if (code >= 100 && code < 200) return { label: "Informational (1xx)", bg: "bg-blue-500", text: "text-blue-500", lightBg: "bg-blue-50" };
    if (code >= 200 && code < 300) return { label: "Success (2xx)", bg: "bg-emerald-500", text: "text-emerald-500", lightBg: "bg-emerald-50" };
    if (code >= 300 && code < 400) return { label: "Redirection (3xx)", bg: "bg-amber-500", text: "text-amber-500", lightBg: "bg-amber-50" };
    if (code >= 400 && code < 500) return { label: "Client Error (4xx)", bg: "bg-rose-500", text: "text-rose-500", lightBg: "bg-rose-50" };
    return { label: "Server Error (5xx)", bg: "bg-violet-500", text: "text-violet-500", lightBg: "bg-violet-50" };
  };

  const theme = getTheme(card.code);

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full max-w-2xl mx-auto h-[600px]">
      <div 
        className="relative w-[520px] h-[320px] perspective-1000 cursor-pointer group"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div className={`absolute inset-0 backface-hidden glass-card rounded-[24px] flex flex-col items-center justify-center p-10 text-center transition-colors duration-500 border-2 ${theme.lightBg} border-transparent`}>
             <div className={`text-[11px] font-bold ${theme.text} bg-white px-3 py-1 rounded-full uppercase tracking-widest mb-6 shadow-sm`}> {theme.label} </div>
             <div className="text-[84px] font-extrabold text-brand-text leading-none tracking-tighter">{card.code}</div>
             <div className="mt-8 text-brand-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
               Click or Press Space to reveal
             </div>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 backface-hidden glass-card rounded-[24px] flex flex-col items-center justify-center p-10 text-center rotate-y-180 transition-colors duration-500 ${theme.lightBg}`}>
            <div className={`text-[11px] font-bold ${theme.text} bg-white px-3 py-1 rounded-full uppercase tracking-widest mb-4 shadow-sm`}> {card.code} </div>
            <div className="text-2xl font-bold text-brand-text mb-4 leading-tight">{card.title}</div>
            <p className="text-brand-muted text-base leading-relaxed max-w-[400px]">{card.description}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {isFlipped ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-4"
          >
            {[
              { id: 'again', label: 'Again', color: 'hover:border-red-400 hover:text-red-600', key: '1' },
              { id: 'hard', label: 'Hard', color: 'hover:border-amber-400 hover:text-amber-600', key: '2' },
              { id: 'good', label: 'Good', color: 'hover:border-emerald-400 hover:text-emerald-600', key: '3' },
              { id: 'easy', label: 'Easy', color: 'hover:border-indigo-400 hover:text-indigo-600', key: '4' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={(e) => { e.stopPropagation(); onResult(btn.id as Difficulty); }}
                className={`px-8 py-4 bg-white border border-brand-border rounded-xl font-bold flex flex-col items-center min-w-[110px] transition-all active:scale-95 group ${btn.color}`}
              >
                <span className="text-sm">{btn.label}</span>
                <span className="text-[10px] text-brand-muted group-hover:text-inherit">
                  {getIntervalForDifficulty(currentLevel, btn.id as Difficulty)}
                </span>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-brand-muted text-xs font-medium bg-white px-4 py-2 rounded-full border border-brand-border shadow-sm flex items-center gap-2"
          >
            <kbd className="px-2 py-0.5 bg-slate-100 rounded text-[10px] border border-slate-200">Space</kbd> to reveal
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
