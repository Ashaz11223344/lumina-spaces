
import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Scan, Cpu, Layers, FileUp } from 'lucide-react';
import CameraModal from './CameraModal';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  onLoadTemplate?: () => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, onLoadTemplate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageSelected(e.dataTransfer.files[0]);
      }
    },
    [onImageSelected]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {showCamera && (
        <CameraModal 
          onClose={() => setShowCamera(false)} 
          onCapture={onImageSelected} 
        />
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative group w-full min-h-[28rem] lg:min-h-[36rem] rounded-[2.5rem] lg:rounded-[3.5rem] border border-dashed transition-all duration-700 flex flex-col items-center justify-between p-6 lg:p-14 text-center overflow-hidden
          ${isDragging 
            ? 'border-secondary bg-secondary/10 scale-[1.01] shadow-[0_0_50px_rgba(170,196,140,0.25)]' 
            : 'border-white/10 bg-background/20'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Scanning effect line */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 transition-all duration-[2s] blur-sm ${isDragging ? 'opacity-100 top-full' : 'group-hover:opacity-40 group-hover:top-full ease-in-out infinite'}`} />

        {/* Top/Center Visuals */}
        <div className="flex flex-col items-center justify-center flex-grow py-8">
          <div className="relative mb-6 lg:mb-10">
              <div className={`
                  w-24 h-24 lg:w-36 lg:h-36 rounded-full flex items-center justify-center transition-all duration-700 relative z-20
                  ${isDragging 
                      ? 'bg-secondary/20 text-secondary scale-110 shadow-[0_0_60px_rgba(170,196,140,0.5)]' 
                      : 'bg-white/5 text-accent/20 group-hover:bg-secondary/10 group-hover:text-secondary'
                  }
              `}>
                  {isDragging ? <Scan size={48} className="animate-pulse lg:w-16 lg:h-16" /> : <Layers size={48} className="lg:w-16 lg:h-16" />}
                  
                  {/* Animated Rings */}
                  <div className={`absolute inset-0 border border-current rounded-full opacity-10 scale-125 ${isDragging ? 'animate-ping' : ''}`}></div>
                  <div className="absolute inset-0 border border-current rounded-full opacity-5 scale-150"></div>
                  <div className="absolute inset-0 border border-current rounded-full opacity-5 scale-[2]"></div>
              </div>
              
              {/* Hover Floating Icons - Hidden on small mobile */}
              {!isDragging && (
                  <>
                      <div className="hidden sm:flex absolute -top-4 -right-4 w-10 lg:w-12 h-10 lg:h-12 bg-primary/20 rounded-2xl items-center justify-center text-primary border border-primary/20 shadow-xl group-hover:animate-float" style={{animationDelay: '0s'}}>
                          <ImageIcon size={18} className="lg:w-5 lg:h-5" />
                      </div>
                      <div className="hidden sm:flex absolute -bottom-4 -left-4 w-10 lg:w-12 h-10 lg:h-12 bg-secondary/20 rounded-2xl items-center justify-center text-secondary border border-secondary/20 shadow-xl group-hover:animate-float" style={{animationDelay: '1s'}}>
                          <Camera size={18} className="lg:w-5 lg:h-5" />
                      </div>
                  </>
              )}
          </div>
          
          <div className="relative z-20">
              <h3 className="text-2xl lg:text-5xl font-display font-bold text-white mb-2 lg:mb-4 tracking-tight group-hover:text-glow transition-all">
                  {isDragging ? "Process Scene Data" : "Ingest Space Image"}
              </h3>
              <p className="text-accent/40 max-w-sm lg:max-w-md mx-auto mb-8 lg:mb-12 text-sm lg:text-lg font-light leading-relaxed px-4">
                  Drag and drop your source photo, or select an interface below to begin orchestration.
              </p>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="relative z-20 w-full flex flex-col items-center gap-4 lg:gap-8 mb-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 lg:gap-4 w-full max-w-3xl px-2">
                <button 
                  onClick={openGallery}
                  className="flex-1 flex items-center justify-center gap-3 lg:gap-4 px-6 lg:px-8 py-4 lg:py-5 rounded-[1.5rem] lg:rounded-[2rem] bg-white/5 border border-white/10 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-secondary/50 transition-all group/btn"
                >
                    <UploadCloud size={16} className="text-secondary lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform" />
                    From Gallery
                </button>
                
                <button 
                  onClick={() => setShowCamera(true)}
                  className="flex-1 flex items-center justify-center gap-3 lg:gap-4 px-8 lg:px-10 py-4 lg:py-5 rounded-[1.5rem] lg:rounded-[2rem] bg-secondary text-background text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pale transition-all shadow-xl shadow-secondary/10 active:scale-95 z-30"
                >
                    <Camera size={18} className="lg:w-5 lg:h-5" />
                    Use Camera
                </button>

                {onLoadTemplate && (
                  <button 
                    onClick={onLoadTemplate}
                    className="flex-1 flex items-center justify-center gap-3 lg:gap-4 px-6 lg:px-8 py-4 lg:py-5 rounded-[1.5rem] lg:rounded-[2rem] bg-white/5 border border-white/10 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-accent/50 transition-all group/btn"
                  >
                      <FileUp size={16} className="text-accent lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform" />
                      Load Template
                  </button>
                )}
            </div>

            {/* Footer Badge */}
            <div className="flex items-center gap-3 text-[8px] lg:text-[10px] text-accent/30 font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] px-4 lg:px-6 py-2 lg:py-2.5 bg-white/5 rounded-full border border-white/5">
                <Cpu size={12} className="text-tertiary lg:w-4 lg:h-4" />
                <span>Encrypted Studio Link</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
