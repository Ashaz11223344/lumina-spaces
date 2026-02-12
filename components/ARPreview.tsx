
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, Sparkles, Layers, Maximize, MoveHorizontal, Info } from 'lucide-react';

interface ARPreviewProps {
  redesignUrl: string;
  onClose: () => void;
}

const ARPreview: React.FC<ARPreviewProps> = ({ redesignUrl, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [opacity, setOpacity] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access is required for the AR experience. Please check your browser permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setIsCapturing(true);
    // Visual flash effect
    setTimeout(() => setIsCapturing(false), 200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in overflow-hidden">
      {/* Live Video Feed */}
      <div className="relative w-full h-full flex items-center justify-center">
        {error ? (
          <div className="max-w-md text-center p-8 glass-panel rounded-[2rem]">
            <Info size={48} className="text-red-400 mx-auto mb-6" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Access Denied</h3>
            <p className="text-accent/60 text-sm mb-6">{error}</p>
            <button onClick={onClose} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full">Return to Design</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
            />
            
            {/* Redesign Overlay */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
              style={{ 
                opacity: opacity,
                backgroundImage: `url(${redesignUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent h-2 w-full animate-[scan_4s_linear_infinite]" />
            </div>

            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] border border-white/10 rounded-[3rem]">
                <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-secondary/50 rounded-tl-xl" />
                <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" />
                <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-secondary/50 rounded-bl-xl" />
                <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-secondary/50 rounded-br-xl" />
              </div>
            </div>

            {/* Flash Effect */}
            {isCapturing && <div className="absolute inset-0 bg-white z-[210] animate-pulse" />}
          </>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-[220] pointer-events-none">
        <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-4 pointer-events-auto">
          <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-white text-lg font-display font-bold tracking-tight">AR Magic Lens</h2>
            <p className="text-[10px] text-accent/40 font-black uppercase tracking-widest mt-1">Live Reality Synthesis</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/10 pointer-events-auto hover:rotate-90"
        >
          <X size={28} />
        </button>
      </div>

      {/* Bottom Interface */}
      <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col items-center gap-8 z-[220] pointer-events-none">
        
        {/* Transparency Slider */}
        <div className="w-full max-w-md glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-6 pointer-events-auto shadow-2xl">
          <Layers size={18} className="text-accent/40" />
          <div className="flex-1 relative flex items-center">
             <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={opacity} 
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-secondary"
             />
             <div 
               className="absolute top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-between w-full px-1"
               style={{ left: 0 }}
             >
                <div className="w-0.5 h-3 bg-white/20 rounded-full" />
                <div className="w-0.5 h-3 bg-white/20 rounded-full" />
             </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
            {Math.round(opacity * 100)}% LENS
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-10 pointer-events-auto">
          <button 
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all group"
            title="Calibrate Depth"
          >
            <Maximize size={24} className="group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={handleCapture}
            className="w-24 h-24 rounded-full bg-white p-2 shadow-[0_0_50px_rgba(255,255,255,0.3)] group active:scale-95 transition-all"
          >
            <div className="w-full h-full rounded-full border-2 border-black/5 bg-secondary flex items-center justify-center text-background">
               <Camera size={32} />
            </div>
          </button>

          <button 
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all group"
            title="Real-time Flow"
          >
            <MoveHorizontal size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <p className="text-[9px] text-accent/20 font-black uppercase tracking-[0.4em]">Align camera with origin perspective for best results</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { top: -10%; }
          to { top: 110%; }
        }
      `}} />
    </div>
  );
};

export default ARPreview;
