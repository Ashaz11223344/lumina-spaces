
import React, { useState } from 'react';
import { ProductItem } from '../types';
import { ShoppingBag, X, Search, Ruler, ExternalLink, DollarSign, Target, ChevronRight } from 'lucide-react';

interface ProductVisualDiscoveryProps {
  products: ProductItem[];
  isVisible: boolean;
}

const ProductVisualDiscovery: React.FC<ProductVisualDiscoveryProps> = ({ products, isVisible }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<ProductItem | null>(null);

  if (!isVisible || products.length === 0) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden select-none">
      
      {/* Visual Bounding Boxes (Revealed on Interaction for grounding feedback) */}
      {products.map((product) => {
        if (!product.box_2d) return null;
        const [ymin, xmin, ymax, xmax] = product.box_2d;
        const isInteracting = selectedProduct?.id === product.id || hoveredProduct?.id === product.id;

        return (
          <div
            key={`box-${product.id}`}
            className={`absolute border-2 transition-all duration-300 rounded-xl pointer-events-none ${
              isInteracting ? 'border-secondary/60 bg-secondary/10 opacity-100 scale-100 shadow-[0_0_20px_rgba(170,196,140,0.3)]' : 'border-transparent opacity-0 scale-95'
            }`}
            style={{
              top: `${ymin / 10}%`,
              left: `${xmin / 10}%`,
              width: `${(xmax - xmin) / 10}%`,
              height: `${(ymax - ymin) / 10}%`,
            }}
          >
            {isInteracting && (
              <div className="absolute top-2 left-2 bg-secondary text-background text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                VERIFIED_ASSET
              </div>
            )}
          </div>
        );
      })}

      {/* Interactive Centered Hotspot Pins */}
      {products.map((product) => {
        if (!product.box_2d) return null;
        
        // Pixel-perfect centering derived from the Gemini Grounding box
        const [ymin, xmin, ymax, xmax] = product.box_2d;
        const centerY = ((ymin + ymax) / 2) / 10;
        const centerX = ((xmin + xmax) / 2) / 10;

        const isSelected = selectedProduct?.id === product.id;
        const isHovered = hoveredProduct?.id === product.id;

        return (
          <div
            key={`pin-${product.id}`}
            className="absolute pointer-events-auto flex items-center justify-center z-50"
            style={{ 
              top: `${centerY}%`, 
              left: `${centerX}%`,
              transform: 'translate(-50%, -50%)' 
            }}
          >
            {/* Tooltip */}
            <div 
              className={`
                absolute bottom-full mb-6 transition-all duration-300 transform
                ${isHovered && !isSelected ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90 pointer-events-none'}
              `}
            >
              <div className="bg-background/95 backdrop-blur-2xl border border-white/20 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap">
                   <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#AAC48C]" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{product.name}</span>
                      <span className="text-[8px] font-mono text-secondary/70">{product.category}</span>
                   </div>
                   <span className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded ml-2">{product.priceRange || 'RETAIL_QUOTE'}</span>
              </div>
              <div className="w-3 h-3 bg-background/95 border-r border-b border-white/20 rotate-45 mx-auto -mt-1.5 shadow-2xl" />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
              }}
              onMouseEnter={() => setHoveredProduct(product)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group/pin transition-all hover:scale-125 focus:outline-none relative flex items-center justify-center"
            >
              <div className={`absolute w-12 h-12 rounded-full border border-secondary/20 scale-150 transition-all duration-700 ${isSelected ? 'opacity-0' : 'opacity-100 animate-pulse'}`} />
              
              <div className={`
                w-10 h-10 rounded-full border-2 transition-all duration-500 flex items-center justify-center
                ${isSelected 
                  ? 'bg-secondary border-white scale-125 shadow-[0_0_35px_rgba(170,196,140,1)]' 
                  : 'bg-black/90 border-white/30 group-hover/pin:border-secondary shadow-2xl'
                }
              `}>
                {isSelected ? (
                    <Target size={20} className="text-background" />
                ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(170,196,140,0.8)]" />
                )}
              </div>
            </button>
          </div>
        );
      })}

      {/* Asset Side Panel */}
      <div 
        className={`
          absolute top-0 right-0 h-full w-[26rem] bg-background/90 backdrop-blur-[80px] border-l border-white/10 shadow-[-40px_0_120px_rgba(0,0,0,0.8)] 
          transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1) pointer-events-auto z-50
          ${selectedProduct ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {selectedProduct && (
          <div className="h-full flex flex-col p-12 animate-fade-in relative overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-10 right-10 p-3 rounded-full hover:bg-white/10 text-accent/30 hover:text-white transition-all hover:rotate-90"
            >
              <X size={28} />
            </button>

            <div className="mt-12 space-y-12">
               {/* Meta */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="px-4 py-1.5 rounded-2xl bg-secondary/20 text-secondary border border-secondary/20 text-[10px] font-black uppercase tracking-widest">
                        {selectedProduct.category}
                     </span>
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">VERIFIED_OBJECT</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-white tracking-tighter leading-tight">
                    {selectedProduct.name}
                  </h2>
               </div>

               {/* Specs */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-secondary">
                       <Ruler size={18} />
                       <span className="text-[11px] font-black uppercase tracking-[0.2em]">Scale Analysis</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[8px] font-black text-accent/30 uppercase mb-1">Height</p>
                       <p className="text-sm font-mono font-bold text-white">{selectedProduct.dimensions?.height || '---'}</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[8px] font-black text-accent/30 uppercase mb-1">Width</p>
                       <p className="text-sm font-mono font-bold text-white">{selectedProduct.dimensions?.width || '---'}</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[8px] font-black text-accent/30 uppercase mb-1">Depth</p>
                       <p className="text-sm font-mono font-bold text-white">{selectedProduct.dimensions?.length || '---'}</p>
                    </div>
                  </div>
               </div>

               {/* Valuation */}
               <div className="bg-primary/10 border border-primary/20 p-8 rounded-[2.5rem] flex items-center justify-between">
                  <div className="space-y-1">
                     <span className="text-[9px] text-white/40 font-black uppercase">Market Estimate</span>
                     <p className="text-3xl font-mono font-bold text-white tracking-tight">
                        {selectedProduct.priceRange || "Contact Retailer"}
                     </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                     <ShoppingBag size={28} />
                  </div>
               </div>

               {/* Logic */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-accent/50">
                     <Search size={18} />
                     <span className="text-[11px] font-black uppercase tracking-[0.2em]">Contextual Match</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem]">
                     <p className="text-[12px] font-mono text-accent/60 leading-relaxed italic">
                        "{selectedProduct.query}"
                     </p>
                  </div>
               </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-16">
               <a 
                 href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(selectedProduct.query)}`}
                 target="_blank"
                 rel="noreferrer"
                 className="w-full py-6 rounded-[2rem] bg-white text-background flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all shadow-2xl group"
               >
                 <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 Explore Product Source
               </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVisualDiscovery;
