
import React from 'react';

interface MenuProps {
  saveWorld: () => void;
  resetWorld: () => void;
  cubeCount: number;
}

export const Menu: React.FC<MenuProps> = ({ saveWorld, resetWorld, cubeCount }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white flex items-center gap-4">
        <span className="font-bold text-lg tracking-tight">Gemini Craft</span>
        <div className="flex gap-2">
            <button 
                onClick={saveWorld}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm font-medium transition-colors"
            >
                SAVE
            </button>
            <button 
                onClick={resetWorld}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-colors"
            >
                RESET
            </button>
        </div>
      </div>
    </div>
  );
};
