
import React from 'react';

interface HealthBarProps {
  health: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
  const maxHealth = 10;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1 items-center bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        {/* Main large heart for the "Player" feel */}
        <div className={`text-3xl mr-2 ${health > 0 ? 'animate-pulse' : ''}`}>
          {health > 0 ? '❤️' : '💀'}
        </div>
        
        {/* Minecraft style heart containers */}
        <div className="flex gap-0.5">
          {[...Array(maxHealth)].map((_, i) => {
            const isFull = i < health;
            return (
              <span 
                key={i} 
                className={`text-sm transition-all duration-300 ${isFull ? 'scale-100 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]' : 'opacity-20 grayscale scale-75'}`}
              >
                ❤️
              </span>
            );
          })}
        </div>
      </div>
      
      {health <= 3 && health > 0 && (
        <div className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded uppercase animate-bounce border border-red-500/20">
          Critical Health
        </div>
      )}
    </div>
  );
};
