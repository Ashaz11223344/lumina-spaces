
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Eraser, Brush, Trash2 } from 'lucide-react';

export interface MaskCanvasHandle {
  getMaskData: () => string | null;
  clearMask: () => void;
  drawRect: (box: [number, number, number, number]) => void; // box is [ymin, xmin, ymax, xmax] 0-1000
}

interface MaskCanvasProps {
  imageSrc: string;
  onMaskChange: (hasMask: boolean) => void;
  previewBox?: [number, number, number, number] | null; 
}

const MaskCanvas = forwardRef<MaskCanvasHandle, MaskCanvasProps>(({ imageSrc, onMaskChange, previewBox }, ref) => {
  const [brushSize, setBrushSize] = useState(40);
  const [mode, setMode] = useState<'brush' | 'eraser'>('brush');
  const [hasDrawn, setHasDrawn] = useState(false);
  
  const layerRef = useRef<{ 
      getMask: () => string | null; 
      clear: () => void;
      drawRect: (box: [number, number, number, number]) => void;
  }>(null);

  useImperativeHandle(ref, () => ({
    getMaskData: () => layerRef.current?.getMask() || null,
    clearMask: () => {
        layerRef.current?.clear();
        setHasDrawn(false);
        onMaskChange(false);
    },
    drawRect: (box) => {
        layerRef.current?.drawRect(box);
        setHasDrawn(true);
        onMaskChange(true);
    }
  }));
  
  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full">
       <MaskLayer 
         ref={layerRef}
         imageSrc={imageSrc} 
         brushSize={brushSize} 
         mode={mode} 
         previewBox={previewBox}
         onMaskUpdate={(has) => {
             setHasDrawn(has);
             onMaskChange(has);
         }}
       />
       
       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-background/80 backdrop-blur-xl p-3 pl-6 pr-8 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 z-30 transition-all hover:scale-105 hover:border-secondary/30 group">
         <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/5">
           <button
             onClick={() => setMode('brush')}
             className={`p-3 rounded-full transition-all duration-300 ${mode === 'brush' ? 'bg-primary text-white shadow-[0_0_15px_rgba(106,122,90,0.5)]' : 'hover:bg-white/10 text-accent/50'}`}
             title="Brush"
           >
             <Brush size={18} />
           </button>
           <button
             onClick={() => setMode('eraser')}
             className={`p-3 rounded-full transition-all duration-300 ${mode === 'eraser' ? 'bg-pale text-background shadow-[0_0_15px_rgba(190,210,186,0.5)]' : 'hover:bg-white/10 text-accent/50'}`}
             title="Eraser"
           >
             <Eraser size={18} />
           </button>
         </div>
         
         <div className="w-px h-8 bg-white/10" />
         
         <div className="flex items-center gap-4">
           <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">Brush Size</span>
           <input
             type="range"
             min="10"
             max="100"
             value={brushSize}
             onChange={(e) => setBrushSize(Number(e.target.value))}
             className="w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-secondary transition-all"
           />
         </div>

         {hasDrawn && (
            <>
                <div className="w-px h-8 bg-white/10" />
                <button 
                  onClick={() => {
                      layerRef.current?.clear();
                      setHasDrawn(false);
                      onMaskChange(false);
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-accent/50 hover:text-red-400 transition-colors"
                  title="Clear Mask"
                >
                    <Trash2 size={16} />
                </button>
            </>
         )}
       </div>
    </div>
  );
});

const MaskLayer = forwardRef<{ 
    getMask: () => string | null; 
    clear: () => void; 
    drawRect: (box: [number, number, number, number]) => void;
}, {
    imageSrc: string; 
    brushSize: number; 
    mode: 'brush' | 'eraser';
    onMaskUpdate: (hasMask: boolean) => void;
    previewBox?: [number, number, number, number] | null;
}>(({ imageSrc, brushSize, mode, onMaskUpdate, previewBox }, ref) => {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const logicCanvasRef = useRef<HTMLCanvasElement>(null); 
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null); 
    const [isDrawing, setIsDrawing] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useImperativeHandle(ref, () => ({
        getMask: () => logicCanvasRef.current?.toDataURL('image/png') || null,
        clear: () => {
            const width = dimensions.width;
            const height = dimensions.height;
            const maskCtx = maskCanvasRef.current?.getContext('2d');
            const logicCtx = logicCanvasRef.current?.getContext('2d');
            if (maskCtx && logicCtx) {
                maskCtx.clearRect(0, 0, width, height);
                logicCtx.clearRect(0, 0, width, height);
            }
        },
        drawRect: (box) => {
            const maskCanvas = maskCanvasRef.current;
            const maskCtx = maskCanvas?.getContext('2d');
            const logicCanvas = logicCanvasRef.current;
            const logicCtx = logicCanvas?.getContext('2d');
            
            if (maskCtx && logicCtx && maskCanvas) {
                const w = maskCanvas.width;
                const h = maskCanvas.height;
                const paddingY = 20; 
                const paddingX = 20;

                const ymin = Math.max(0, box[0] - paddingY) / 1000 * h;
                const xmin = Math.max(0, box[1] - paddingX) / 1000 * w;
                const ymax = Math.min(1000, box[2] + paddingY) / 1000 * h;
                const xmax = Math.min(1000, box[3] + paddingX) / 1000 * w;

                maskCtx.globalCompositeOperation = 'source-over';
                maskCtx.fillStyle = 'rgba(106, 122, 90, 0.5)';
                maskCtx.fillRect(xmin, ymin, xmax - xmin, ymax - ymin);
                logicCtx.fillStyle = '#FFFFFF';
                logicCtx.fillRect(xmin, ymin, xmax - xmin, ymax - ymin);
            }
        }
    }));

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const maxWidth = 1000;
            const maxHeight = 700;
            const aspect = img.width / img.height;
            
            let w = maxWidth;
            let h = w / aspect;
            
            if (h > maxHeight) {
                h = maxHeight;
                w = h * aspect;
            }
            
            setDimensions({ width: w, height: h });
        };
    }, [imageSrc]);

    useEffect(() => {
        if (dimensions.width === 0) return;
        
        [bgCanvasRef.current, maskCanvasRef.current, logicCanvasRef.current, overlayCanvasRef.current].forEach(canvas => {
            if (canvas) {
                canvas.width = dimensions.width;
                canvas.height = dimensions.height;
            }
        });

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const ctx = bgCanvasRef.current?.getContext('2d');
            ctx?.drawImage(img, 0, 0, dimensions.width, dimensions.height);
        };
    }, [dimensions, imageSrc]);

    useEffect(() => {
        const canvas = overlayCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || dimensions.width === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (previewBox) {
            const w = canvas.width;
            const h = canvas.height;
            const ymin = (previewBox[0] / 1000) * h;
            const xmin = (previewBox[1] / 1000) * w;
            const ymax = (previewBox[2] / 1000) * h;
            const xmax = (previewBox[3] / 1000) * w;

            ctx.save();
            ctx.strokeStyle = '#AAC48C'; 
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 6]); 
            ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);
            ctx.restore();
        }
    }, [previewBox, dimensions]);

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const maskCanvas = maskCanvasRef.current;
        const maskCtx = maskCanvas?.getContext('2d');
        const logicCtx = logicCanvasRef.current?.getContext('2d');
        if (!maskCtx || !maskCanvas || !logicCtx) return;
        const rect = maskCanvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = (e as React.MouseEvent).clientX;
          clientY = (e as React.MouseEvent).clientY;
        }
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        [maskCtx, logicCtx].forEach(ctx => {
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        });

        if (mode === 'brush') {
            maskCtx.globalCompositeOperation = 'source-over';
            maskCtx.strokeStyle = 'rgba(106, 122, 90, 0.7)'; 
            logicCtx.globalCompositeOperation = 'source-over';
            logicCtx.strokeStyle = '#FFFFFF'; 
        } else {
            maskCtx.globalCompositeOperation = 'destination-out';
            logicCtx.globalCompositeOperation = 'destination-out';
        }

        maskCtx.lineTo(x, y);
        maskCtx.stroke();
        maskCtx.beginPath();
        maskCtx.moveTo(x, y);
        logicCtx.lineTo(x, y);
        logicCtx.stroke();
        logicCtx.beginPath();
        logicCtx.moveTo(x, y);
    }

    const start = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        onMaskUpdate(true);
        maskCanvasRef.current?.getContext('2d')?.beginPath();
        logicCanvasRef.current?.getContext('2d')?.beginPath();
        draw(e);
    };

    const end = () => {
        setIsDrawing(false);
        maskCanvasRef.current?.getContext('2d')?.beginPath();
        logicCanvasRef.current?.getContext('2d')?.beginPath();
    }

    return (
        <div className="relative overflow-hidden bg-black/20 rounded-2xl" style={{ width: dimensions.width, height: dimensions.height }}>
            <canvas ref={bgCanvasRef} className="absolute inset-0 z-10 opacity-70" />
            <canvas ref={logicCanvasRef} className="absolute inset-0 z-0 opacity-0 pointer-events-none" /> 
            <canvas ref={overlayCanvasRef} className="absolute inset-0 z-30 pointer-events-none" /> 
            <canvas 
                ref={maskCanvasRef}
                className="absolute inset-0 z-20 cursor-crosshair touch-none"
                onMouseDown={start}
                onMouseMove={draw}
                onMouseUp={end}
                onMouseLeave={end}
                onTouchStart={start}
                onTouchMove={draw}
                onTouchEnd={end}
            />
        </div>
    )
});

MaskCanvas.displayName = "MaskCanvas";
MaskLayer.displayName = "MaskLayer";

export default MaskCanvas;
