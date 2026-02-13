
import React from 'react';
import { BlockType } from '../types';

interface TextureSelectorProps {
  activeTexture: BlockType;
  setTexture: (texture: BlockType) => void;
}

const icons: Record<BlockType, string> = {
  [BlockType.Dirt]: '🟫',
  [BlockType.Grass]: '🌱',
  [BlockType.Glass]: '💎',
  [BlockType.Wood]: '🪵',
  [BlockType.Log]: '🌲',
  [BlockType.Cobblestone]: '🧱',
  [BlockType.Stone]: '🪨',
  [BlockType.Plank]: '🟧',
  [BlockType.Leaves]: '🍃',
};

export const TextureSelector: React.FC<TextureSelectorProps> = ({ activeTexture, setTexture }) => {
  return (
    <div className="flex gap-2 p-3 bg-black/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
      {Object.entries(icons).map(([k, icon]) => (
        <button
          key={k}
          className={`w-12 h-12 flex items-center justify-center text-2xl transition-all rounded-2xl ${
            activeTexture === k 
              ? 'bg-white/40 ring-2 ring-white scale-110 shadow-lg' 
              : 'hover:bg-white/10 opacity-60 hover:opacity-100'
          }`}
          onClick={() => setTexture(k as BlockType)}
          title={k}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};
