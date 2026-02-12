
import React from 'react';
import { ProductItem } from '../types';
import { ShoppingBag, Search, ExternalLink, Ruler, Maximize2 } from 'lucide-react';

interface ShoppingPanelProps {
  items: ProductItem[];
  isLoading: boolean;
}

const ShoppingPanel: React.FC<ShoppingPanelProps> = ({ items, isLoading }) => {
  if (!isLoading && items.length === 0) return null;

  return (
    <div className="mt-6 lg:mt-8 glass-panel rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 border border-white/10 animate-fade-in relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 bg-primary/5 rounded-full blur-[40px] lg:blur-[80px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 lg:mb-8 relative z-10">
        <div className="p-2.5 lg:p-3 rounded-xl bg-gradient-to-br from-tertiary to-primary shadow-lg shadow-primary/20">
           <ShoppingBag size={18} className="text-white lg:w-5 lg:h-5" />
        </div>
        <div>
          <h3 className="text-xl lg:text-2xl font-display font-bold text-white leading-none">Shop The Look</h3>
          <p className="text-[10px] lg:text-sm text-slate-400 mt-1">Exact matches with spatial measurements</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse border border-white/5 flex flex-col justify-end p-4">
               <div className="w-1/2 h-4 bg-white/10 rounded mb-2"></div>
               <div className="w-3/4 h-3 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 relative z-10">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group bg-black/40 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/5 hover:border-primary/50 transition-all hover:bg-white/5 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="px-2 py-0.5 lg:py-1 rounded-md bg-white/5 text-[9px] lg:text-[10px] uppercase tracking-wider text-white/50 border border-white/5 font-medium">
                      {item.category}
                    </span>
                    {item.isSpaceOptimized && (
                      <span className="flex items-center gap-1 text-[8px] lg:text-[9px] text-secondary font-black uppercase tracking-widest">
                        <Maximize2 size={8} className="lg:w-[10px] lg:h-[10px]" /> Optimized
                      </span>
                    )}
                  </div>
                  {item.priceRange && (
                     <span className="text-[10px] lg:text-xs text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded">{item.priceRange}</span>
                  )}
                </div>
                <h4 className="font-bold text-white mb-2 group-hover:text-primary transition-colors text-base lg:text-lg leading-tight">
                  {item.name}
                </h4>

                {/* Technical Dimensions */}
                {item.dimensions && (
                  <div className="flex items-center gap-3 p-2.5 mb-3 bg-white/5 rounded-xl border border-white/5">
                    <Ruler size={14} className="text-tertiary flex-shrink-0" />
                    <div className="grid grid-cols-3 w-full text-center">
                       <div>
                          <p className="text-[7px] uppercase font-black text-accent/30 tracking-widest">Length</p>
                          <p className="text-[9px] font-mono text-white/80">{item.dimensions.length}</p>
                       </div>
                       <div className="border-x border-white/10">
                          <p className="text-[7px] uppercase font-black text-accent/30 tracking-widest">Width</p>
                          <p className="text-[9px] font-mono text-white/80">{item.dimensions.width}</p>
                       </div>
                       <div>
                          <p className="text-[7px] uppercase font-black text-accent/30 tracking-widest">Height</p>
                          <p className="text-[9px] font-mono text-white/80">{item.dimensions.height}</p>
                       </div>
                    </div>
                  </div>
                )}

                <div className="p-2.5 lg:p-3 bg-black/30 rounded-xl mb-2 border border-white/5">
                   <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Architectural Search</p>
                   <p className="text-[10px] lg:text-xs text-slate-300 font-mono leading-relaxed line-clamp-2">
                     {item.query}
                   </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                 <a 
                   href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.query)}`}
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center justify-center gap-2 py-2.5 lg:py-3 rounded-xl bg-white text-black hover:bg-primary hover:text-white text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all shadow-lg"
                 >
                   <Search size={14} />
                   Shop Item
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingPanel;
