import React, { useState } from 'react';
import { X, Save, User, Settings, LayoutTemplate, Palette, Sun, CheckCircle2, Bookmark, Plus, Trash2, PlayCircle, Check } from 'lucide-react';
import { UserProfile, RoomType, StylePreset, LightingOption, Gender, SavedPreset, AvatarStyle } from '../types';

interface SettingsModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdate: (updatedUser: UserProfile) => void;
}

const AVATAR_STYLES = [
  { id: AvatarStyle.AVATAAARS, name: 'Architect' },
  { id: AvatarStyle.LORELEI, name: 'Realistic' },
  { id: AvatarStyle.BOTTTS, name: 'Cyber-B' },
  { id: AvatarStyle.NOTIONISTS, name: 'Modern' },
  { id: AvatarStyle.PIXEL_ART, name: 'Retro' }
];

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState<Gender>(user.gender);
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(user.avatarStyle || AvatarStyle.AVATAAARS);
  const [prefs, setPrefs] = useState(user.preferences);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getAvatarUrl = (style: AvatarStyle, g: Gender, e: string) => {
    const seed = `${g.toLowerCase()}-${e}`;
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const handleSave = () => {
    setIsSaving(true);
    const avatarUrl = getAvatarUrl(selectedStyle, gender, user.email);

    setTimeout(() => {
      onUpdate({
        ...user,
        name,
        gender,
        avatar: avatarUrl,
        avatarStyle: selectedStyle,
        preferences: prefs
      });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  const handleAddPreset = () => {
    if (!newPresetName.trim()) return;
    // Fix: Added missing properties 'creativity' and 'prompt' required by the SavedPreset interface
    const newPreset: SavedPreset = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPresetName.trim(),
      roomType: prefs.defaultRoomType,
      style: prefs.defaultStyle,
      lighting: prefs.defaultLighting,
      creativity: 50,
      prompt: ''
    };
    setPrefs({
      ...prefs,
      savedPresets: [...prefs.savedPresets, newPreset]
    });
    setNewPresetName('');
  };

  const handleDeletePreset = (id: string) => {
    setPrefs({
      ...prefs,
      savedPresets: prefs.savedPresets.filter(p => p.id !== id)
    });
  };

  const handleApplyPreset = (p: SavedPreset) => {
    setPrefs({
      ...prefs,
      defaultRoomType: p.roomType,
      defaultStyle: p.style,
      defaultLighting: p.lighting
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl glass-panel p-10 rounded-[4rem] border border-white/10 shadow-2xl animate-fade-down overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-[1.5rem] bg-primary/20 text-primary border border-primary/20 shadow-xl">
              <Settings size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Studio Profile</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Configure your architectural suite</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-12">
          {/* Identity Section */}
          <section className="space-y-8">
            <h3 className="flex items-center gap-3 text-xs font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/5 pb-5">
              <User size={14} className="text-primary" /> Visual Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Architect Alias</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender Focus</label>
                  <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/10 rounded-[1.5rem]">
                    {Object.values(Gender).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                          gender === g 
                            ? 'bg-white text-black shadow-xl' 
                            : 'text-slate-600 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Studio Aesthetic</label>
                <div className="grid grid-cols-5 gap-3">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`relative group p-2 rounded-2xl border transition-all ${
                        selectedStyle === style.id 
                          ? 'bg-primary/20 border-primary shadow-2xl shadow-primary/30' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <img 
                        src={getAvatarUrl(style.id, gender, user.email)} 
                        alt={style.name} 
                        className={`w-full aspect-square rounded-xl object-cover transition-transform duration-500 ${selectedStyle === style.id ? 'scale-110' : 'group-hover:scale-105'}`} 
                      />
                      {selectedStyle === style.id && (
                        <div className="absolute -top-1 -right-1 bg-primary text-white p-0.5 rounded-full shadow-lg border border-white/20">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                  Choose a style that reflects your professional architectural persona.
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="space-y-8">
            <h3 className="flex items-center gap-3 text-xs font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/5 pb-5">
              <Palette size={14} className="text-secondary" /> Workspace Defaults
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <LayoutTemplate size={14} className="text-secondary" /> Default Room
                </label>
                <select 
                  value={prefs.defaultRoomType}
                  onChange={(e) => setPrefs({...prefs, defaultRoomType: e.target.value as RoomType})}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 text-white text-xs font-bold outline-none appearance-none cursor-pointer hover:border-white/20 transition-all shadow-inner"
                >
                  {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Palette size={14} className="text-primary" /> Aesthetic
                </label>
                <select 
                  value={prefs.defaultStyle}
                  onChange={(e) => setPrefs({...prefs, defaultStyle: e.target.value as StylePreset})}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 text-white text-xs font-bold outline-none appearance-none cursor-pointer hover:border-white/20 transition-all shadow-inner"
                >
                  {Object.values(StylePreset).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Sun size={14} className="text-yellow-500" /> Lighting
                </label>
                <select 
                  value={prefs.defaultLighting}
                  onChange={(e) => setPrefs({...prefs, defaultLighting: e.target.value as LightingOption})}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 text-white text-xs font-bold outline-none appearance-none cursor-pointer hover:border-white/20 transition-all shadow-inner"
                >
                  {Object.values(LightingOption).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Presets Section */}
          <section className="space-y-8">
            <h3 className="flex items-center gap-3 text-xs font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/5 pb-5">
              <Bookmark size={14} className="text-primary" /> Design Presets
            </h3>
            
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="New Preset Name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-[1.5rem] py-5 px-6 text-white text-sm font-bold focus:ring-1 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-700 shadow-inner"
              />
              <button 
                onClick={handleAddPreset}
                disabled={!newPresetName.trim()}
                className="px-10 py-5 rounded-[1.5rem] bg-secondary text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3 shadow-xl shadow-secondary/20"
              >
                <Plus size={18} /> Save Current
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prefs.savedPresets.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                   <Bookmark className="mx-auto mb-5 text-slate-800" size={48} />
                   <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">No presets saved in studio cloud.</p>
                </div>
              ) : (
                prefs.savedPresets.map((p) => (
                  <div key={p.id} className="group p-6 rounded-[2rem] bg-black/40 border border-white/10 hover:border-secondary/50 transition-all flex items-center justify-between shadow-lg">
                    <div>
                      <h4 className="text-sm font-black text-white tracking-tight mb-2 uppercase">{p.name}</h4>
                      <div className="flex items-center gap-3 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                        <span className="px-2 py-0.5 rounded bg-white/5">{p.style}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5">{p.roomType}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleApplyPreset(p)}
                        className="p-3 rounded-xl bg-white/5 text-secondary hover:bg-secondary/20 transition-all"
                        title="Load Preset"
                      >
                        <PlayCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeletePreset(p.id)}
                        className="p-3 rounded-xl bg-white/5 text-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        title="Delete Preset"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="pt-10 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
              {showSuccess ? (
                <span className="text-secondary flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 size={16} /> Data Synced
                </span>
              ) : "Cloud Studio Active"}
            </div>
            <div className="flex gap-5">
               <button 
                 onClick={onClose}
                 className="px-10 py-4 rounded-[1.5rem] bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-3 px-12 py-4 rounded-[1.5rem] bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:bg-pink-500 active:scale-95 transition-all disabled:opacity-50"
               >
                 {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                 Sync Profile
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;