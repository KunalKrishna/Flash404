import { motion } from "motion/react";
import { HTTP_STATUS_CODES } from "../constants";
import { getDueCards, getStats } from "../lib/srs";
import { SRSState, View } from "../types";
import { Play, List, Trophy, GraduationCap, Clock, BookOpen } from "lucide-react";

interface DashboardProps {
  state: SRSState;
  setView: (view: View) => void;
}

export default function Dashboard({ state, setView }: DashboardProps) {
  const stats = getStats(state);
  const dueCards = getDueCards(state);

  const levelColors = [
    "bg-slate-200", // Not started
    "bg-indigo-100", // Fresh
    "bg-indigo-200", // Learning
    "bg-indigo-300", // Familiar
    "bg-indigo-400", // Strong
    "bg-indigo-600 text-white", // Mastered
  ];

  const levelLabels = ["New", "Level 1", "Level 2", "Level 3", "Level 4", "Mastered"];

  return (
    <div className="max-w-4xl mx-auto py-16 px-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-brand-text">StatusRecall</h1>
        </div>
        <div className="flex items-center gap-8 text-sm text-brand-muted">
          <div className="flex items-center gap-2">New <span className="font-semibold text-brand-text">{stats.unstarted}</span></div>
          <div className="flex items-center gap-2">Learning <span className="font-semibold text-brand-text">{stats.learning}</span></div>
          <div className="flex items-center gap-2">Review <span className="font-semibold text-brand-text">{dueCards.length}</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <motion.div 
          className="lg:col-span-12 glass-card p-12 rounded-[24px] flex flex-col items-center text-center"
        >
          <div className="bg-slate-100 text-brand-muted text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full mb-6"> Active Review </div>
          <div className="text-8xl font-extrabold text-brand-text mb-6 tracking-tighter">
            {dueCards.length}
          </div>
          <p className="text-brand-muted max-w-sm mb-10 text-lg leading-relaxed">
            {dueCards.length > 0 
              ? "You have cards due for review based on your spaced repetition schedule." 
              : "Great job! You've reviewed all your cards for now."}
          </p>
          <button
            disabled={dueCards.length === 0}
            onClick={() => setView('study')}
            className={`px-12 py-4 rounded-xl font-bold transition-all shadow-sm ${
              dueCards.length > 0 
                ? "bg-brand-accent text-white hover:bg-indigo-700 active:scale-95" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {dueCards.length > 0 ? "Start Session" : "Nothing Due"}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-8 rounded-[24px] flex flex-col">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-4">Completion</span>
            <div className="text-4xl font-extrabold text-brand-text mb-2">{Math.round((stats.mastered / stats.total) * 100)}%</div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-auto">
              <div className="h-full bg-indigo-500" style={{ width: `${(stats.mastered / stats.total) * 100}%` }} />
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-[24px] flex flex-col">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-4">Mastered</span>
            <div className="text-4xl font-extrabold text-brand-text">{stats.mastered}</div>
            <span className="text-sm text-brand-muted mt-2">Cards at level 5</span>
          </div>

          <button 
            onClick={() => setView('list')}
            className="glass-card p-8 rounded-[24px] flex flex-col hover:border-brand-accent transition-colors group text-left"
          >
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-4 group-hover:text-brand-accent">Total Library</span>
            <div className="text-4xl font-extrabold text-brand-text mb-2">{stats.total}</div>
            <span className="text-sm text-brand-muted group-hover:text-brand-text underline flex items-center gap-1">Manage cards <List size={14} /></span>
          </button>
      </div>

      <div className="glass-card p-10 rounded-[24px]">
          <h2 className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-10 flex items-center gap-3">
            <div className="w-1 h-3 bg-brand-accent rounded-full" /> Progression Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {stats.levels.map((count, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-[10px] text-brand-muted mb-2 font-bold uppercase truncate tracking-wider">{levelLabels[i]}</div>
                <div className="flex items-end gap-2">
                  <div className="font-extrabold text-2xl text-brand-text">{count}</div>
                  <div className={`w-2 h-2 rounded-full mb-2 ${levelColors[i].split(' ')[0]}`} />
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
