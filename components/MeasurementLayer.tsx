
import React, { useState, useRef, useEffect } from 'react';
import { Ruler, Trash2, Loader2, Info } from 'lucide-react';
import { ManualMeasurement, MeasurementPoint } from '../types';
import { estimateRealWorldDistance } from '../services/geminiService';

interface MeasurementLayerProps {
  imageUrl: string;
  isActive: boolean;
}

const MeasurementLayer: React.FC<MeasurementLayerProps> = ({ imageUrl, isActive }) => {
  const [measurements, setMeasurements] = useState<ManualMeasurement[]>([]);
  const [currentStart, setCurrentStart] = useState<MeasurementPoint | null>(null);
  const [mousePos, setMousePos] = useState<MeasurementPoint | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = async (e: React.MouseEvent) => {
    if (!isActive || isProcessing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 1000;
    const point = { x, y };

    if (!currentStart) {
      setCurrentStart(point);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const newMeasure: ManualMeasurement = {
        id: newId,
        start: currentStart,
        end: point,
        distanceLabel: 'Analyzing...'
      };
      
      setMeasurements(prev => [...prev, newMeasure]);
      setCurrentStart(null);
      setIsProcessing(true);

      try {
        const label = await estimateRealWorldDistance(imageUrl, newMeasure.start, newMeasure.end);
        setMeasurements(prev => prev.map(m => m.id === newId ? { ...m, distanceLabel: label } : m));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 1000;
    setMousePos({ x, y });
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setCurrentStart(null);
  };

  if (!isActive && measurements.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-40 pointer-events-auto cursor-crosshair transition-all duration-500 ${isActive ? 'bg-tertiary/5' : 'pointer-events-none'}`}
      onClick={handleContainerClick}
      onMouseMove={handleMouseMove}
    >
      {/* SVG Measurement Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="measureGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {measurements.map((m) => (
          <g key={m.id}>
            <line 
              x1={`${m.start.x / 10}%`} y1={`${m.start.y / 10}%`} 
              x2={`${m.end.x / 10}%`} y2={`${m.end.y / 10}%`} 
              stroke="#8DAF98" strokeWidth="2" strokeDasharray="5,5"
              filter="url(#measureGlow)"
            />
            <circle cx={`${m.start.x / 10}%`} cy={`${m.start.y / 10}%`} r="5" fill="#8DAF98" />
            <circle cx={`${m.end.x / 10}%`} cy={`${m.end.y / 10}%`} r="5" fill="#8DAF98" />
            
            {/* Measurement Flag */}
            <foreignObject 
               x={`${(m.start.x + m.end.x) / 20 - 5}%`} 
               y={`${(m.start.y + m.end.y) / 20 - 2.5}%`} 
               width="100" height="40"
            >
              <div className="flex items-center justify-center h-full">
                <div className="bg-tertiary text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg shadow-2xl border border-white/20 whitespace-nowrap flex items-center gap-2">
                  {m.distanceLabel === 'Analyzing...' && <Loader2 size={12} className="animate-spin" />}
                  {m.distanceLabel}
                </div>
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Dynamic Trace Line */}
        {currentStart && mousePos && (
          <g>
            <line 
              x1={`${currentStart.x / 10}%`} y1={`${currentStart.y / 10}%`} 
              x2={`${mousePos.x / 10}%`} y2={`${mousePos.y / 10}%`} 
              stroke="#8DAF98" strokeWidth="1" strokeDasharray="4,4" opacity="0.6"
            />
            <circle cx={`${currentStart.x / 10}%`} cy={`${currentStart.y / 10}%`} r="4" fill="#8DAF98" opacity="0.8" />
          </g>
        )}
      </svg>

      {/* Manual Measurement UI Console */}
      {isActive && (
        <div className="absolute top-8 left-8 pointer-events-auto animate-fade-down flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-5 shadow-2xl max-w-sm">
            <div className="p-3 bg-tertiary/20 text-tertiary rounded-2xl">
              <Ruler size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-white text-xs font-black uppercase tracking-widest">Manual Spatial Tool</h4>
              <p className="text-[10px] text-accent/50 uppercase tracking-widest mt-1">Tap two markers to calculate scale</p>
            </div>
            {measurements.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); clearMeasurements(); }}
                className="p-3 hover:bg-red-500/20 text-accent/40 hover:text-red-400 rounded-2xl transition-all"
                title="Reset All"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          
          {isProcessing && (
            <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-white/10 flex items-center gap-4 self-start shadow-xl">
               <div className="w-4 h-4 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin" />
               <span className="text-[10px] text-white font-mono uppercase tracking-[0.2em] font-bold">Triangulating Depth...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeasurementLayer;
