
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const EXIT_TIME = 2500;
    const EXIT_DURATION = 500;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      
      const completeTimer = setTimeout(() => {
        onComplete();
      }, EXIT_DURATION);

      return () => clearTimeout(completeTimer);
    }, EXIT_TIME);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Organic animated background */}
      <div className="bg-animated absolute inset-0 z-0" />
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/20 z-10" />

      {/* Main Content */}
      <div className="relative z-20 text-center">
        {/* Brand Logo */}
        <div className="mb-8 opacity-0 animate-fade-down" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 mx-auto mb-3 glass-panel rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#AAC48C]" />
          </div>
          <p className="text-accent/60 text-xs uppercase tracking-[0.3em] font-light">
            Welcome to
          </p>
        </div>

        {/* Main Title */}
        <div className="relative">
          <h1 className="font-bold text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white to-accent/80 tracking-tight relative z-10 mb-3 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            LUMINA
          </h1>

          {/* Subtitle */}
          <div className="overflow-hidden">
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <h2 className="text-3xl md:text-4xl font-light text-white/90 flex items-center justify-center gap-3">
                SPACES
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#AAC48C]" />
              </h2>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <span className="text-accent/40 text-xs uppercase tracking-[0.3em]">ARCHITECTURE</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>
          <p className="text-accent/60 text-sm uppercase tracking-[0.15em] font-light">
            Redesigning Reality
          </p>
        </div>
      </div>

      {/* Subtle border accent */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#AAC48C]/30 to-transparent opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }} />
    </div>
  );
};

export default WelcomeScreen;
