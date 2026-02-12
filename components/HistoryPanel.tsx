
import React, { useState } from 'react';
import { GenerationResult } from '../types';
import { Clock, Info, X, Zap, Sun, Palette, MessageSquareText } from 'lucide-react';

interface HistoryPanelProps {
  history: GenerationResult[];
  activeResultId: string;
  onSelectResult: (result: GenerationResult) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, activeResultId, onSelectResult }) => {
  const [inspectedItem, setInspectedItem] = useState<GenerationResult | null>(null);

  if (history.length === 0) return null;

  return (
    <div className="mt-6 lg:mt-8 animate-fade-in relative">
      <div className="flex items-center gap-2 mb-3 lg:mb-4 px-1 lg:px-2">
        <Clock size={14} className="text-accent/40 lg:w-4 lg:h-4" />
        <h3 className="text-[10px] lg:text-sm font-bold uppercase tracking-widest text-accent/40">Design Timeline</h3>
      </div>
      
      <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {history.map((item) => (
          <div key={item.id} className="relative group/card flex-shrink-0 snap-start">
            <button
              onClick={() => onSelectResult(item)}
              className={`
                relative w-36 lg:w-48 rounded-xl lg:rounded-2xl overflow-hidden border transition-all duration-300 group text-left
                ${item.id === activeResultId 
                  ? 'border-secondary ring-2 ring-secondary/20 scale-[1.02] opacity-100' 
                  : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                }
              `}
            >
              <div className="aspect-video bg-black/50 relative">
                <img src={item.imageUrl} alt="History thumbnail" className="w-full h-full object-cover" />
                {item.id === activeResultId && (
                  <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center">
                      <div className="bg-secondary text-background text-[8px] lg:text-[10px] font-black px-2 lg:px-2.5 py-0.5 lg:py-1 rounded-full uppercase tracking-wider shadow-lg">Current</div>
                  </div>
                )}
              </div>
              
              <div className="p-2 lg:p-3 bg-white/5 backdrop-blur-md">
                <p className="text-[8px] lg:text-[10px] text-accent/40 font-mono mb-0.5 lg:mb-1">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[10px] lg:text-xs text-white font-medium truncate leading-tight">
                   {item.settings.style} {item.settings.roomType}
                </p>
              </div>
            </button>

            {/* Inspect Button - Hidden on small touch screens by default, visible via group-hover */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setInspectedItem(item);
              }}
              className="absolute top-1.5 lg:top-2 right-1.5 lg:right-2 p-1 lg:p-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-accent/60 hover:text-white hover:bg-primary transition-all opacity-0 group-hover/card:opacity-100 z-10"
              title="View Details"
            >
              <Info size={12} className="lg:w-[14px] lg:h-[14px]" />
            </button>
          </div>
        ))}
      </div>

      {/* Inspector Modal Overlay */}
      {inspectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 lg:px-6 animate-fade-in">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setInspectedItem(null)} />
          <div className="relative w-full max-w-xl glass-panel p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 shadow-2xl animate-fade-down overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-2.5 lg:p-3 rounded-2xl bg-secondary/10 text-secondary">
                  <Clock size={20} className="lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h4 className="text-lg lg:text-xl font-display font-bold text-white leading-none">Iteration Details</h4>
                  <p className="text-[8px] lg:text-[10px] uppercase tracking-widest text-accent/40 font-black mt-1">
                    Captured {new Date(inspectedItem.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <button onClick={() => setInspectedItem(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-accent/50 hover:text-white">
                <X size={20} className="lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 lg:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 text-secondary">
                  <MessageSquareText size={16} className="lg:w-[18px] lg:h-[18px]" />
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Architectural Brief</span>
                </div>
                <p className="text-xs lg:text-sm text-accent leading-relaxed italic">
                  "{inspectedItem.promptUsed}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="p-3 lg:p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Palette size={12} className="lg:w-[14px] lg:h-[14px]" />
                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Style</span>
                  </div>
                  <p className="text-xs lg:text-sm text-white font-bold">{inspectedItem.settings.style}</p>
                </div>
                <div className="p-3 lg:p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-tertiary">
                    <Sun size={12} className="lg:w-[14px] lg:h-[14px]" />
                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Lighting</span>
                  </div>
                  <p className="text-xs lg:text-sm text-white font-bold">{inspectedItem.settings.lighting}</p>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2 lg:pt-4">
                <button 
                  onClick={() => {
                    onSelectResult(inspectedItem);
                    setInspectedItem(null);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-secondary text-background text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-pale transition-all"
                >
                  <Zap size={16} className="fill-current lg:w-4 lg:h-4" />
                  Restore This Vision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
