import { HTTP_STATUS_CODES } from "../constants";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import { View, SRSState } from "../types";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ListViewProps {
  state: SRSState;
  setView: (view: View) => void;
}

const CATEGORIES = [
  { id: "1xx", label: "Informational (1XX) ℹ️💡", range: [100, 199], color: "text-blue-500" },
  { id: "2xx", label: "Success (2XX) 🆗✅", range: [200, 299], color: "text-emerald-500" },
  { id: "3xx", label: "Redirect (3XX) 🔀🚧", range: [300, 399], color: "text-amber-500" },
  { id: "4xx", label: "Client Error (4XX) 👨🏻‍🚫", range: [400, 499], color: "text-rose-500" },
  { id: "5xx", label: "Server Error (5XX) 💻🚫", range: [500, 599], color: "text-violet-500" },
];

export default function ListView({ state, setView }: ListViewProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "1xx": true,
    "2xx": true,
    "3xx": true,
    "4xx": true,
    "5xx": true,
  });

  const toggleCategory = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = useMemo(() => {
    return HTTP_STATUS_CODES.filter(
      (c) => 
        c.code.toString().includes(search) || 
        c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const groups = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      items: filtered.filter(item => item.code >= cat.range[0] && item.code <= cat.range[1])
    })).filter(group => group.items.length > 0);
  }, [filtered]);

  const getLevelColor = (level: number) => {
    if (level === 0) return "bg-slate-100 text-brand-muted";
    if (level === 5) return "bg-green-100 text-green-600 border-green-200";
    return "bg-indigo-100 text-indigo-600 border-indigo-200";
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-brand-muted hover:text-brand-text transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-brand-text">Library</h2>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
          <input 
            type="text"
            placeholder="Search code or description..."
            className="w-full pl-12 pr-6 py-3 bg-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-accent transition-all shadow-sm text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="glass-card rounded-[24px] overflow-hidden">
            <button
              onClick={() => toggleCategory(group.id)}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${group.color.replace('text', 'bg')}`} />
                <span className={`text-sm font-bold uppercase tracking-widest ${group.color}`}>
                  {group.label}
                </span>
                <span className="text-xs text-brand-muted font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  {group.items.length} codes
                </span>
              </div>
              {expanded[group.id] ? <ChevronUp size={18} className="text-brand-muted" /> : <ChevronDown size={18} className="text-brand-muted" />}
            </button>
            <AnimatePresence>
              {expanded[group.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((card) => {
                      const srsCard = state.cards[card.code];
                      return (
                        <div key={card.code} className="p-5 border border-brand-border rounded-[20px] flex items-start gap-4 hover:border-brand-accent/30 transition-all group bg-white/50">
                          <div className="text-3xl font-extrabold text-brand-text tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                            {card.code}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-xs text-brand-text">{card.title}</h3>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${getLevelColor(srsCard.level)}`}>
                                {srsCard.level === 5 ? "MASTERED" : srsCard.level === 0 ? "NEW" : `LVL ${srsCard.level}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">{card.description}</p>
                          </div>
                        </div>
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
  );
}
