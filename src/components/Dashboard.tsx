import { motion, AnimatePresence } from "motion/react";
import { HTTP_STATUS_CODES, STUDY_SETS } from "../constants";
import { getDueCards, getStats } from "../lib/srs";
import { SRSState, View, StudySetId } from "../types";
import { Play, List, Trophy, GraduationCap, Clock, BookOpen, Settings2, X as CloseIcon, Filter, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface DashboardProps {
  state: SRSState;
  setView: (view: View) => void;
  studySet: StudySetId;
  setStudySet: (set: StudySetId) => void;
  customCodes: number[];
  setCustomCodes: (codes: number[]) => void;
}

const CATEGORIES = [
  { id: "1xx", label: "Informational (1XX)", range: [100, 199], color: "text-blue-500" },
  { id: "2xx", label: "Success (2XX)", range: [200, 299], color: "text-emerald-500" },
  { id: "3xx", label: "Redirect (3XX)", range: [300, 399], color: "text-amber-500" },
  { id: "4xx", label: "Client Error (4XX)", range: [400, 499], color: "text-rose-500" },
  { id: "5xx", label: "Server Error (5XX)", range: [500, 599], color: "text-violet-500" },
];

export default function Dashboard({ state, setView, studySet, setStudySet, customCodes, setCustomCodes }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalExpanded, setModalExpanded] = useState<Record<string, boolean>>({
    "1xx": true,
    "2xx": false,
    "3xx": false,
    "4xx": false,
    "5xx": false,
  });

  const toggleModalCategory = (id: string) => {
    setModalExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const studySetCodes = useMemo(() => {
    switch (studySet) {
      case 'top10': return STUDY_SETS.TOP_10;
      case 'top16': return STUDY_SETS.TOP_16;
      case 'top20': return STUDY_SETS.TOP_20;
      case 'custom': return customCodes;
      default: return undefined;
    }
  }, [studySet, customCodes]);

  const stats = getStats(state, studySetCodes);
  const dueCards = getDueCards(state, studySetCodes);

  const levelColors = [
    "bg-slate-200", // Not started
    "bg-indigo-100", // Fresh
    "bg-indigo-200", // Learning
    "bg-indigo-300", // Familiar
    "bg-indigo-400", // Strong
    "bg-indigo-600 text-white", // Mastered
  ];

  const levelLabels = ["New", "Level 1", "Level 2", "Level 3", "Level 4", "Mastered"];

  const setOptions: { id: StudySetId; label: string; count: number }[] = [
    { id: 'all', label: 'Default (All 62)', count: 62 },
    { id: 'top10', label: '10 Important', count: 10 },
    { id: 'top16', label: '16 Important', count: 16 },
    { id: 'top20', label: '20 Important', count: 20 },
    { id: 'custom', label: 'Custom Set', count: customCodes.length },
  ];

  const handleToggleCode = (code: number) => {
    if (customCodes.includes(code)) {
      setCustomCodes(customCodes.filter(c => c !== code));
    } else {
      setCustomCodes([...customCodes, code]);
    }
  };

  const groupedCodes = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      items: HTTP_STATUS_CODES.filter(item => item.code >= cat.range[0] && item.code <= cat.range[1])
    }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-8 relative">
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

      {/* Study Set Selector */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-bold text-brand-muted uppercase tracking-widest flex items-center gap-3">
            <Settings2 size={12} className="text-brand-accent" /> Select Practice Set
          </h2>
          {studySet === 'custom' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] font-bold text-brand-accent hover:underline flex items-center gap-1 uppercase tracking-widest"
            >
              <Filter size={12} /> Edit Custom Set
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {setOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setStudySet(option.id);
                if (option.id === 'custom' && customCodes.length === 0) {
                  setIsModalOpen(true);
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 ${
                studySet === option.id 
                  ? "border-brand-accent bg-indigo-50/50 shadow-sm" 
                  : "border-brand-border hover:border-slate-300 bg-white"
              }`}
            >
              <span className={`text-[12px] font-bold whitespace-nowrap ${studySet === option.id ? "text-brand-accent" : "text-brand-text"}`}>
                {option.label}
              </span>
              <span className="text-[10px] text-brand-muted">{option.count} Codes</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <motion.div 
          layout
          className="lg:col-span-12 glass-card p-12 rounded-[24px] flex flex-col items-center text-center shadow-md border-indigo-100"
        >
          <div className="bg-slate-100 text-brand-muted text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-1 rounded-full mb-6"> 
            Focus: {setOptions.find(o => o.id === studySet)?.label}
          </div>
          <div className="text-8xl font-extrabold text-brand-text mb-6 tracking-tighter">
            {dueCards.length}
          </div>
          <p className="text-brand-muted max-w-sm mb-10 text-lg leading-relaxed">
            {studySet === 'custom' && customCodes.length === 0 
              ? "Your custom set is empty. Select some codes to start practicing."
              : dueCards.length > 0 
                ? "You have cards due for review based on your spaced repetition schedule." 
                : "Great job! You've reviewed all your cards for now."}
          </p>
          <div className="flex gap-4">
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
            {studySet === 'custom' && (
               <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-4 rounded-xl font-bold border border-brand-border hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Settings2 size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-brand-text mb-1 italic">Configure Custom Set</h3>
                  <p className="text-xs text-brand-muted font-medium uppercase tracking-widest">{customCodes.length} codes selected</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 flex items-center justify-center transition-all"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50/20">
                <div className="divide-y divide-slate-100">
                  {groupedCodes.map((group) => (
                    <div key={group.id} className="bg-white">
                      <button
                        onClick={() => toggleModalCategory(group.id)}
                        className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left border-b border-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${group.color.replace('text', 'bg')}`} />
                          <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${group.color}`}>
                            {group.label}
                          </span>
                        </div>
                        {modalExpanded[group.id] ? <ChevronUp size={14} className="text-brand-muted" /> : <ChevronDown size={14} className="text-brand-muted" />}
                      </button>
                      
                      <AnimatePresence>
                        {modalExpanded[group.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100">
                              {group.items.map((item) => {
                                const isSelected = customCodes.includes(item.code);
                                return (
                                  <label 
                                    key={item.code}
                                    className={`flex items-center gap-4 p-5 cursor-pointer transition-colors group bg-white hover:bg-indigo-50/30 ${
                                      isSelected ? "bg-indigo-50/50" : ""
                                    }`}
                                  >
                                    <div className="relative flex items-center">
                                      <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={isSelected}
                                        onChange={() => handleToggleCode(item.code)}
                                      />
                                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isSelected ? "border-brand-accent bg-brand-accent" : "border-slate-300"
                                      }`}>
                                        {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <span className={`text-sm font-bold mr-2 ${isSelected ? "text-brand-accent" : "text-brand-text"}`}>{item.code}</span>
                                      <span className="text-xs text-brand-muted font-medium line-clamp-1">{item.title}</span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex items-center justify-between gap-4">
                <button 
                   onClick={() => setCustomCodes([])}
                   className="text-xs font-bold text-brand-muted hover:text-rose-500 uppercase tracking-widest transition-colors"
                >
                   Clear Selection
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-4 bg-brand-accent text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                >
                  Apply & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-8 rounded-[24px] flex flex-col">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-4">Completion</span>
            <div className="text-4xl font-extrabold text-brand-text mb-2">{stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}%</div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-auto">
              <div className="h-full bg-indigo-500" style={{ width: `${(stats.mastered / (stats.total || 1)) * 100}%` }} />
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
