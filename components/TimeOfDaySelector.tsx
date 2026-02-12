
import React from 'react';
import { TimePeriod } from '../types';
import { Sunrise, Sun, Sunset, Moon, Sparkles, Clock } from 'lucide-react';

interface TimeOfDaySelectorProps {
  onSelect: (time: TimePeriod) => void;
  activeTime: TimePeriod | null;
  isLoading: boolean;
}

const TimeOfDaySelector: React.FC<TimeOfDaySelectorProps> = ({ onSelect, activeTime, isLoading }) => {
  const options = [
    { id: TimePeriod.MORNING, label: 'Morning', icon: Sunrise, color: 'text-orange-300' },
    { id: TimePeriod.AFTERNOON, label: 'Afternoon', icon: Sun, color: 'text-yellow-400' },
    { id: TimePeriod.EVENING, label: 'Evening', icon: Sunset, color: 'text-red-400' },
    { id: TimePeriod.NIGHT, label: 'Night', icon: Moon, color: 'text-blue-300' },
  ];

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-2">
        <Clock size={14} className="text-secondary" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60">Chronos Lighting</span>
      </div>

      <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = activeTime === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={isLoading}
              className={`
                relative flex flex-col items-center gap-2 p-4 lg:p-6 rounded-[2rem] border transition-all duration-500 min-w-[100px] lg:min-w-[140px] overflow-hidden group
                ${isActive 
                  ? 'bg-secondary text-background border-secondary shadow-[0_0_30px_rgba(170,196,140,0.4)] scale-105' 
                  : 'bg-black/40 text-accent/60 border-white/10 hover:border-white/30 hover:bg-white/5'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
              )}
              
              <div className={`transition-transform duration-500 group-hover:scale-125 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={isActive ? 28 : 24} className={isActive ? 'text-background' : option.color} />
              </div>
              
              <span className={`text-[10px] lg:text-xs font-black uppercase tracking-widest ${isActive ? 'text-background' : 'text-slate-300'}`}>
                {option.label}
              </span>

              {isActive && isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/80">
                   <Sparkles className="animate-spin text-background" size={20} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {isLoading && (
        <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-secondary animate-[shimmer_2s_infinite] w-1/2" />
        </div>
      )}
    </div>
  );
};

export default TimeOfDaySelector;
