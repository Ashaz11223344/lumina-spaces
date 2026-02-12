
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  children?: React.ReactNode;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Origin", 
  afterLabel = "Redesign",
  children
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = afterImage;
  }, [afterImage]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    handleMove(e.clientX);
  }, [isResizing, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isResizing) return;
    handleMove(e.touches[0].clientX);
  }, [isResizing, handleMove]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleTouchMove]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden select-none cursor-ew-resize group"
      style={{ 
        width: '100%', 
        height: 'auto', 
        maxHeight: '80vh', 
        aspectRatio: `${aspectRatio}` 
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="After" 
        className="w-full h-full object-contain"
      />
      
      {/* Before Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-contain max-w-none"
          style={{ width: containerRef.current?.clientWidth || '100%' }}
        />
      </div>

      {/* Discovery Layer / Children */}
      {children}

      {/* Labels */}
      <div className={`absolute top-6 lg:top-12 left-6 lg:left-12 z-20 transition-opacity duration-300 ${sliderPosition < 15 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-black/75 backdrop-blur-2xl text-white text-[9px] lg:text-[11px] font-black px-4 lg:px-8 py-2 lg:py-3 rounded-full border border-white/10 uppercase tracking-[0.3em] lg:tracking-[0.5em] shadow-2xl">
          {beforeLabel}
        </div>
      </div>

      <div className={`absolute top-6 lg:top-12 right-6 lg:right-12 z-20 transition-opacity duration-300 ${sliderPosition > 85 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gradient-to-r from-primary/95 to-secondary/95 backdrop-blur-2xl text-white text-[9px] lg:text-[11px] font-black px-4 lg:px-8 py-2 lg:py-3 rounded-full flex items-center gap-2 lg:gap-4 shadow-2xl border border-white/20 uppercase tracking-[0.3em] lg:tracking-[0.5em]">
          <Sparkles size={14} className="fill-current animate-pulse text-glow lg:w-4 lg:h-4" />
          {afterLabel}
        </div>
      </div>

      {/* Handle */}
      <div 
        className="absolute inset-y-0 z-30 group/handle"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/50 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 lg:w-14 h-10 lg:h-14 rounded-full glass-panel border border-white/30 flex items-center justify-center text-white shadow-2xl transition-transform group-hover/handle:scale-110 group-active:scale-90 bg-primary/80">
          <MoveHorizontal size={20} className="lg:w-6 lg:h-6 animate-pulse-slow" />
        </div>
      </div>

      {/* Instructions Hint */}
      <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="bg-black/40 backdrop-blur-md px-4 lg:px-6 py-1.5 lg:py-2 rounded-full border border-white/5 text-[8px] lg:text-[10px] text-accent/60 font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] whitespace-nowrap">
          Slide to Explore Transformation
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
