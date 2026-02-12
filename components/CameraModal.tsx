
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.9);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl h-[90vh] flex flex-col items-center justify-between p-6">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center text-white mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-secondary border border-secondary/20 shadow-lg shadow-secondary/10">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold tracking-tight">Studio Capture</h3>
              <p className="text-[10px] uppercase tracking-widest text-accent/50 font-black">Live Room Lens</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-all text-accent/50 hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 w-full bg-surface rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
          {error ? (
            <div className="flex flex-col items-center gap-4 text-center px-10">
              <AlertCircle size={48} className="text-red-400" />
              <p className="text-white font-medium">{error}</p>
              <button 
                onClick={startCamera}
                className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all"
              >
                Retry Access
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]" 
                style={facingMode === 'environment' ? { transform: 'none' } : {}}
              />
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
                <div className="w-full h-full border border-white/10 rounded-3xl relative">
                  {/* Viewfinder markings */}
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-secondary/50 rounded-tl-xl" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-secondary/50 rounded-bl-xl" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-secondary/50 rounded-br-xl" />
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-20">
                    <Sparkles size={32} className="text-secondary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">AI Alignment Active</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-center gap-12 mt-8">
          <button 
            onClick={toggleCamera}
            className="p-5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
            title="Switch Camera"
          >
            <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>

          <button 
            onClick={capturePhoto}
            disabled={!stream || isCapturing}
            className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all active:scale-90 disabled:opacity-50 relative group"
          >
            <div className="absolute inset-2 border-2 border-black/5 rounded-full group-hover:inset-1 transition-all" />
            <div className="w-16 h-16 rounded-full bg-secondary shadow-inner flex items-center justify-center text-white">
               {isCapturing ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera size={32} />}
            </div>
          </button>

          <div className="w-24" /> {/* Spacer for symmetry */}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraModal;
