
import React from 'react';
import { BudgetItem } from '../types';
import { DollarSign, TrendingUp, History } from 'lucide-react';

interface BudgetPanelProps {
  currentItems: BudgetItem[];
  history: { id: string, items: BudgetItem[] }[];
  isLoading: boolean;
}

const BudgetPanel: React.FC<BudgetPanelProps> = ({ currentItems, history, isLoading }) => {
  if (!isLoading && currentItems.length === 0 && history.length === 0) return null;

  const calculateTotal = (items: BudgetItem[]) => {
      let min = 0;
      let max = 0;
      items.forEach(i => {
          min += i.costMin;
          max += i.costMax;
      });
      return { min, max };
  };

  const currentTotal = calculateTotal(currentItems);

  const historyTotal = history.reduce((acc, entry) => {
      const t = calculateTotal(entry.items);
      return { min: acc.min + t.min, max: acc.max + t.max };
  }, { min: 0, max: 0 });

  const grandTotal = { min: currentTotal.min + historyTotal.min, max: currentTotal.max + historyTotal.max };

  const categoryColors: Record<string, string> = {
    'Furniture': 'border-purple-500/30 text-purple-300 bg-purple-900/10',
    'Material': 'border-blue-500/30 text-blue-300 bg-blue-900/10',
    'Labor': 'border-orange-500/30 text-orange-300 bg-orange-900/10',
    'Decor': 'border-pink-500/30 text-pink-300 bg-pink-900/10'
  };

  return (
    <div className="mt-6 lg:mt-8 glass-panel rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 border border-white/10 animate-fade-in relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute bottom-0 left-0 w-32 lg:w-64 h-32 lg:h-64 bg-secondary/5 rounded-full blur-[40px] lg:blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-3 mb-6 lg:mb-8 relative z-10">
            <div className="flex items-center gap-3">
                <div className="p-2.5 lg:p-3 rounded-xl bg-gradient-to-br from-green-900 to-secondary/50 shadow-lg shadow-secondary/10">
                    <span className="text-lg lg:text-xl font-bold text-white font-sans">₹</span>
                </div>
                <div>
                    <h3 className="text-xl lg:text-2xl font-display font-bold text-white leading-none">Renovation Ledger</h3>
                    <p className="text-[10px] lg:text-sm text-slate-400 mt-1">Est. material & labor (INR)</p>
                </div>
            </div>
            
            {!isLoading && (
                <div className="text-left sm:text-right">
                    <p className="text-[8px] lg:text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5 lg:mb-1">Project Estimate</p>
                    <p className="text-xl lg:text-2xl font-display font-bold text-secondary text-glow">
                        ₹{grandTotal.min.toLocaleString('en-IN')} - ₹{grandTotal.max.toLocaleString('en-IN')}
                    </p>
                </div>
            )}
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        )}

        {/* Current Round */}
        {!isLoading && currentItems.length > 0 && (
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-2 mb-3 lg:mb-4 text-primary text-[10px] lg:text-xs uppercase tracking-widest font-bold">
                    <TrendingUp size={12} className="lg:w-3.5 lg:h-3.5" />
                    <span>Latest Estimates</span>
                </div>
                <div className="grid gap-2 lg:gap-3">
                    {currentItems.map((item, idx) => (
                        <div key={`curr-${idx}`} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors gap-2`}>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[8px] lg:text-[10px] uppercase font-bold border whitespace-nowrap ${categoryColors[item.category] || 'border-slate-700 text-slate-400'}`}>
                                    {item.category}
                                </span>
                                <span className="text-xs lg:text-sm font-medium text-slate-200 truncate">{item.item}</span>
                            </div>
                            <div className="font-mono text-xs lg:text-sm text-slate-400 self-end sm:self-auto">
                                ₹{item.costMin.toLocaleString('en-IN')} - ₹{item.costMax.toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* History */}
        {!isLoading && history.length > 0 && (
             <div className="pt-4 lg:pt-6 border-t border-white/10">
                 <div className="flex items-center gap-2 mb-3 lg:mb-4 text-slate-500 text-[10px] lg:text-xs uppercase tracking-widest font-bold">
                     <History size={12} className="lg:w-3.5 lg:h-3.5" />
                     <span>Previous Sessions</span>
                 </div>
                 <div className="space-y-4 lg:space-y-6">
                     {history.map((entry, idx) => (
                         <div key={entry.id} className="opacity-60 hover:opacity-100 transition-opacity">
                             {entry.items.map((item, itemIdx) => (
                                 <div key={`hist-${idx}-${itemIdx}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 rounded-xl border border-white/5 bg-black/20 grayscale mb-2 gap-2">
                                     <div className="flex items-center gap-3">
                                         <span className={`px-2 py-0.5 rounded text-[8px] lg:text-[10px] uppercase font-bold border whitespace-nowrap ${categoryColors[item.category] || 'border-slate-700 text-slate-400'}`}>
                                             {item.category}
                                         </span>
                                         <span className="text-xs lg:text-sm font-medium text-slate-200 truncate">{item.item}</span>
                                     </div>
                                     <div className="font-mono text-xs lg:text-sm text-slate-400 self-end sm:self-auto">
                                         ₹{item.costMin.toLocaleString('en-IN')} - ₹{item.costMax.toLocaleString('en-IN')}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ))}
                 </div>
             </div>
        )}
    </div>
  );
};

export default BudgetPanel;
