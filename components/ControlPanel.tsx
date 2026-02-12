
import React, { useState } from 'react';
import { StylePreset, LightingOption, GenerationSettings, DesignSuggestion, RoomType, UserProfile, SavedPreset } from '../types';
import { Sparkles, Zap, Sun, Palette, Wand2, BrainCircuit, Plus, MousePointerClick, LayoutTemplate, Bookmark, Save, ChevronRight, Maximize, Ruler } from 'lucide-react';

interface ControlPanelProps {
  settings: GenerationSettings;
  onChange: (newSettings: GenerationSettings) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isValid: boolean;
  suggestions: DesignSuggestion[];
  isAnalyzing: boolean;
  onApplySuggestion: (suggestion: DesignSuggestion) => void;
  onPreviewSuggestion: (box: [number, number, number, number] | null) => void;
  user: UserProfile | null;
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: SavedPreset) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  onChange, 
  isGenerating, 
  onGenerate, 
  isValid,
  suggestions,
  isAnalyzing,
  onApplySuggestion,
  onPreviewSuggestion,
  user,
  onSavePreset,
  onLoadPreset
}) => {
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...settings, prompt: e.target.value });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim());
      setPresetName('');
      setShowPresetInput(false);
    }
  };

  const updateDimension = (key: 'length' | 'width' | 'height', val: string) => {
    const num = val === '' ? undefined : Number(val);
    onChange({
      ...settings,
      dimensions: {
        ...(settings.dimensions || {}),
        [key]: num
      }
    });
  };

  const hasDimensions = settings.dimensions && (settings.dimensions.length || settings.dimensions.width || settings.dimensions.height);

  return (
    <div className="space-y-8 lg:space-y-10">
      
      {/* Presets Bar */}
      {user && (
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs lg:text-sm font-bold text-accent uppercase tracking-widest">
              <Bookmark size={14} className="text-secondary lg:w-4 lg:h-4" />
              Presets
            </label>
            <button 
              onClick={() => setShowPresetInput(!showPresetInput)}
              className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors"
            >
              {showPresetInput ? 'Cancel' : 'Save New'}
            </button>
          </div>

          {showPresetInput && (
            <div className="flex gap-2 animate-fade-down">
              <input 
                type="text" 
                placeholder="Preset Name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <button 
                onClick={handleSavePreset}
                className="bg-secondary text-background p-2 rounded-xl hover:bg-pale transition-all"
              >
                <Save size={16} />
              </button>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {user.preferences.savedPresets.map(p => (
              <button
                key={p.id}
                onClick={() => onLoadPreset(p)}
                className="flex-shrink-0 px-3 lg:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] lg:text-[10px] font-bold text-accent/70 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
              >
                {p.name}
              </button>
            ))}
            {user.preferences.savedPresets.length === 0 && !showPresetInput && (
              <p className="text-[9px] lg:text-[10px] text-accent/20 uppercase tracking-widest py-2">No presets saved yet</p>
            )}
          </div>
        </div>
      )}

      {/* Metric Room Dimensions */}
      <div className="space-y-3 lg:space-y-4">
        <label className="flex items-center gap-2 text-xs lg:text-sm font-bold text-accent uppercase tracking-widest">
          <Ruler size={14} className="text-secondary lg:w-4 lg:h-4" />
          Structural Dimensions (meters)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <input 
              type="number" 
              placeholder="L"
              step="0.1"
              value={settings.dimensions?.length || ''}
              onChange={(e) => updateDimension('length', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-accent/30 uppercase">m</span>
          </div>
          <div className="relative">
            <input 
              type="number" 
              placeholder="W"
              step="0.1"
              value={settings.dimensions?.width || ''}
              onChange={(e) => updateDimension('width', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-accent/30 uppercase">m</span>
          </div>
          <div className="relative">
            <input 
              type="number" 
              placeholder="H"
              step="0.1"
              value={settings.dimensions?.height || ''}
              onChange={(e) => updateDimension('height', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-accent/30 uppercase">m</span>
          </div>
        </div>
        {hasDimensions && (
          <div className="px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">1:1 Metric Scale Enforcement Active</span>
          </div>
        )}
      </div>

      {/* Auto Suggestor */}
      <div className="p-4 lg:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 lg:space-y-4 relative overflow-hidden">
         {settings.autoSuggest && (
             <div className="absolute top-0 right-0 w-24 lg:w-32 h-24 lg:h-32 bg-secondary/10 blur-[40px] lg:blur-[50px] rounded-full pointer-events-none" />
         )}

         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={`p-1.5 lg:p-2 rounded-lg ${settings.autoSuggest ? 'bg-secondary text-background' : 'bg-white/10 text-accent/50'}`}>
                  <BrainCircuit size={16} className="lg:w-[18px] lg:h-[18px]" />
               </div>
               <div>
                  <h3 className="text-xs lg:text-sm font-bold text-white leading-none">Auto Suggest</h3>
                  <p className="text-[9px] lg:text-[10px] text-accent/40 mt-1">AI spatial scans</p>
               </div>
            </div>
            
            <button 
              onClick={() => onChange({ ...settings, autoSuggest: !settings.autoSuggest })}
              className={`w-10 lg:w-12 h-6 lg:h-7 rounded-full transition-colors relative ${settings.autoSuggest ? 'bg-secondary' : 'bg-white/10'}`}
            >
               <div className={`absolute top-1 left-1 w-4 lg:w-5 h-4 lg:h-5 bg-white rounded-full transition-transform ${settings.autoSuggest ? 'translate-x-4 lg:translate-x-5' : 'translate-x-0'}`} />
            </button>
         </div>

         <div className="transition-all duration-500">
             {settings.autoSuggest && isAnalyzing && (
                 <div className="flex flex-col items-center justify-center py-4 gap-2">
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                         <div className="absolute inset-0 bg-secondary animate-[shimmer_1s_infinite] w-1/2" />
                     </div>
                     <span className="text-[9px] text-secondary font-mono animate-pulse">ORCHESTRATING DATA...</span>
                 </div>
             )}

             {settings.autoSuggest && !isAnalyzing && suggestions.length > 0 && (
                 <div className="grid grid-cols-1 gap-2 mt-2">
                    {suggestions.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => onApplySuggestion(s)}
                          onMouseEnter={() => s.box_2d && onPreviewSuggestion(s.box_2d)}
                          onMouseLeave={() => onPreviewSuggestion(null)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl bg-background/40 hover:bg-white/10 border border-white/5 hover:border-secondary/50 text-left transition-all relative overflow-hidden"
                        >
                           <div className="absolute inset-0 bg-secondary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                           <div className="mt-0.5 text-secondary group-hover:scale-110 transition-transform relative z-10">
                              {s.box_2d ? <MousePointerClick size={12} className="lg:w-[14px] lg:h-[14px]" /> : <Plus size={12} className="lg:w-[14px] lg:h-[14px]" />}
                           </div>
                           <div className="relative z-10">
                               <span className="text-[11px] lg:text-xs text-slate-300 group-hover:text-white leading-snug block">{s.text}</span>
                               {s.box_2d && <span className="text-[8px] lg:text-[9px] text-secondary/40 uppercase tracking-widest font-bold">Auto-Select</span>}
                           </div>
                        </button>
                    ))}
                 </div>
             )}
         </div>
      </div>

      {/* Room Type */}
      <div className="space-y-3 lg:space-y-4">
        <label className="flex items-center gap-2 text-xs lg:text-sm font-bold text-accent uppercase tracking-widest">
          <LayoutTemplate size={14} className="text-secondary lg:w-4 lg:h-4" />
          Room Type
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 lg:max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {Object.values(RoomType).map(t => (
            <button
              key={t}
              onClick={() => onChange({...settings, roomType: t})}
              className={`
                px-3 py-2 lg:py-2.5 text-[10px] lg:text-xs rounded-xl font-medium transition-all duration-200 text-left flex items-center gap-2
                ${settings.roomType === t
                  ? 'bg-pale text-background shadow-[0_0_15px_rgba(190,210,186,0.3)]' 
                  : 'bg-white/5 text-accent/60 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${settings.roomType === t ? 'bg-secondary' : 'bg-white/20'}`} />
              <span className="truncate">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vision Brief */}
      <div className="space-y-3 lg:space-y-4">
        <label className="flex items-center justify-between text-xs lg:text-sm font-bold text-accent uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Sparkles size={14} className="text-secondary lg:w-4 lg:h-4" />
            Vision
          </span>
          <span className="text-[9px] lg:text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-accent/50 border border-white/10">
            {settings.prompt.length}/500
          </span>
        </label>
        <div className="relative group">
          <textarea
            value={settings.prompt}
            onChange={handleTextChange}
            placeholder="Describe the organic flow..."
            className="w-full h-24 lg:h-32 p-4 lg:p-5 rounded-2xl border border-white/10 bg-background/40 focus:bg-background/60 focus:ring-1 focus:ring-secondary focus:border-secondary transition-all resize-none text-white placeholder:text-accent/30 text-xs lg:text-sm leading-relaxed shadow-inner"
            maxLength={500}
          />
        </div>
      </div>

      {/* Aesthetic */}
      <div className="space-y-3 lg:space-y-4">
         <label className="flex items-center gap-2 text-xs lg:text-sm font-bold text-accent uppercase tracking-widest">
           <Palette size={14} className="text-secondary lg:w-4 lg:h-4" />
           Aesthetic
         </label>
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
           {Object.values(StylePreset).map(s => (
             <button
               key={s}
               onClick={() => onChange({...settings, style: s})}
               className={`
                 relative px-2 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs rounded-xl font-medium transition-all duration-300 flex items-center justify-center text-center overflow-hidden group
                 ${settings.style === s
                   ? 'bg-primary text-white border border-secondary shadow-[0_0_15px_rgba(106,122,90,0.4)]' 
                   : 'bg-white/5 text-accent/60 border border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'
                 }
               `}
             >
               <span className="relative z-10 truncate">{s}</span>
             </button>
           ))}
         </div>
      </div>
      
      {/* Lighting */}
      <div className="space-y-3 lg:space-y-4">
         <label className="flex items-center gap-2 text-xs lg:text-sm font-bold text-accent uppercase tracking-widest">
           <Sun size={14} className="text-secondary lg:w-4 lg:h-4" />
           Lighting
         </label>
         <div className="grid grid-cols-2 gap-2">
            {Object.values(LightingOption).map(l => (
               <button
                 key={l}
                 onClick={() => onChange({...settings, lighting: l})}
                 className={`
                   px-2 py-2 lg:py-2.5 rounded-xl text-[10px] lg:text-xs font-medium border transition-all duration-300
                   ${settings.lighting === l
                     ? 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_10px_rgba(170,196,140,0.3)]' 
                     : 'border-white/5 bg-transparent text-accent/40 hover:bg-white/5 hover:text-white hover:border-white/10'
                   }
                 `}
               >
                 <span className="truncate">{l}</span>
               </button>
            ))}
         </div>
      </div>

      {/* Creativity */}
      <div className="space-y-4 lg:space-y-5 pt-2 lg:pt-4 p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/5">
         <div className="justify-between items-center hidden lg:flex">
            <label className="text-[10px] lg:text-xs font-bold text-accent uppercase tracking-widest">Creativity</label>
            <span className="text-[10px] lg:text-xs font-mono font-bold text-secondary bg-secondary/10 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full border border-secondary/20">
                {settings.creativity}%
            </span>
         </div>
         <input 
            type="range"
            min="0"
            max="100"
            value={settings.creativity}
            onChange={(e) => onChange({...settings, creativity: Number(e.target.value)})}
            className="w-full h-1 lg:h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-secondary hover:accent-pale focus:outline-none"
         />
      </div>

      {/* Action Bar */}
      <div className="pt-2 lg:pt-4 sticky bottom-2 lg:bottom-4 z-30">
        <button
          onClick={onGenerate}
          disabled={!isValid || isGenerating}
          className={`
            w-full py-3.5 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden group
            ${!isValid || isGenerating 
              ? 'bg-white/5 text-accent/20 cursor-not-allowed border border-white/5' 
              : 'bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-[right_center] text-white shadow-[0_0_30px_-5px_rgba(106,122,90,0.5)] border border-secondary/30 hover:scale-[1.02]'
            }
          `}
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm lg:text-base">Orchestrating Architecture...</span>
            </div>
          ) : (
            <>
              <Zap size={18} className="fill-current lg:w-5 lg:h-5" />
              <span>Generate Design</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ControlPanel;
