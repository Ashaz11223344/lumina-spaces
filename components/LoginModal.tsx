
import React, { useState } from 'react';
import { Mail, ShieldCheck, Sparkles, LogIn, UserPlus, Lock, ArrowRight, Check } from 'lucide-react';
import { UserProfile, RoomType, StylePreset, LightingOption, Gender, AvatarStyle } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const AVATAR_STYLES = [
  { id: AvatarStyle.AVATAAARS, name: 'Architect' },
  { id: AvatarStyle.LORELEI, name: 'Realistic' },
  { id: AvatarStyle.BOTTTS, name: 'Cyber-B' },
  { id: AvatarStyle.NOTIONISTS, name: 'Modern' },
  { id: AvatarStyle.PIXEL_ART, name: 'Retro' }
];

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.NEUTRAL);
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(AvatarStyle.AVATAAARS);
  const [error, setError] = useState<string | null>(null);

  const getAvatarUrl = (style: AvatarStyle, g: Gender, e: string) => {
    const seed = `${g.toLowerCase()}-${e || 'preview'}`;
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      try {
        const dbUsersStr = localStorage.getItem('lumina_db_users');
        const dbUsers = dbUsersStr ? JSON.parse(dbUsersStr) : [];

        if (isSignUp) {
          const existing = dbUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (existing) {
            setError("This architect email is already registered.");
            setIsSubmitting(false);
            return;
          }

          const newUser: UserProfile = {
            id: Math.random().toString(36).substr(2, 9),
            name: name || email.split('@')[0],
            email: email.toLowerCase(),
            avatar: getAvatarUrl(selectedStyle, gender, email),
            avatarStyle: selectedStyle,
            isPro: true,
            gender: gender,
            joinedAt: Date.now(),
            preferences: {
              defaultRoomType: RoomType.LIVING_ROOM,
              defaultStyle: StylePreset.MODERN,
              defaultLighting: LightingOption.DAYLIGHT,
              savedPresets: []
            }
          };

          dbUsers.push({ ...newUser, password }); 
          localStorage.setItem('lumina_db_users', JSON.stringify(dbUsers));
          onLogin(newUser);
        } else {
          const user = dbUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
          if (user) {
            const { password: _, ...safeUser } = user;
            onLogin(safeUser as UserProfile);
          } else {
            setError("Access denied. Please check your credentials.");
            setIsSubmitting(false);
          }
        }
      } catch (err) {
        setError("Storage error. Please refresh and try again.");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-lg glass-panel p-10 rounded-[3.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] animate-fade-down overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center mb-8 text-center relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-tertiary to-primary flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 group">
            <Sparkles size={40} className="text-white fill-white/20 group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <h2 className="text-4xl font-display font-bold text-white tracking-tighter mb-2">
            {isSignUp ? "Initialize Profile" : "Studio Access"}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Architectural Design Suite</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-black text-center animate-shake flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {isSignUp && (
            <>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  <UserPlus size={18} />
                </span>
                <input 
                  type="text" 
                  required
                  placeholder="Architect Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl">
                  {Object.values(Gender).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        gender === g 
                          ? 'bg-white text-black shadow-lg' 
                          : 'text-slate-600 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`relative group flex flex-col items-center gap-2 p-2 rounded-2xl border transition-all ${
                        selectedStyle === style.id 
                          ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <img 
                        src={getAvatarUrl(style.id, gender, email)} 
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
                <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest">Select Persona Aesthetic</p>
              </div>
            </>
          )}

          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
              <Mail size={18} />
            </span>
            <input 
              type="email" 
              required
              placeholder="Studio Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
              <Lock size={18} />
            </span>
            <input 
              type="password" 
              required
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary hover:bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,72,185,0.3)] transition-all active:scale-[0.97] group disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? "Register Profile" : "Initialize Session"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center relative z-10 border-t border-white/5 pt-8">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            {isSignUp ? "Already a member of the studio?" : "Not registered with Lumina yet?"}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="ml-2 text-primary hover:text-white transition-colors"
            >
              {isSignUp ? "Log In Instead" : "Create Account"}
            </button>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-[9px] text-slate-600 uppercase tracking-widest font-black">
          <ShieldCheck size={12} className="text-secondary" />
          Encrypted Data Layer
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
