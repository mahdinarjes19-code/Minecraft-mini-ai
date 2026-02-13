
import React, { useState } from 'react';
import { getArchitectAdvice } from '../services/gemini';
import { BlockType } from '../types';

interface AIAgentProps {
  onApplyPatch: (commands: {pos: [number, number, number], texture: BlockType}[]) => void;
}

const STYLES = ['None', 'Modern', 'Medieval', 'Fantasy', 'Sci-Fi', 'Rustic', 'Futuristic', 'Underwater'];

export const AIAgent: React.FC<AIAgentProps> = ({ onApplyPatch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('None');
  const [loading, setLoading] = useState(false);

  const handleBuild = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await getArchitectAdvice(prompt, selectedStyle);
      if (result && result.length > 0) {
        onApplyPatch(result);
        setIsOpen(false);
        setPrompt('');
      } else {
        alert("The architect is busy. Try a different request!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-80 bg-black/80 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold text-base">Architect Panel</div>
            <div className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-blue-500/30">Gemini 3</div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Select Style</span>
            <div className="flex flex-wrap gap-1.5">
              {STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                    selectedStyle === style
                      ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Request Structure</span>
            <textarea 
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 ring-blue-500/50 transition-all placeholder:text-white/20"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A small cozy cottage with a chimney..."
            />
          </div>

          <button 
            disabled={loading}
            onClick={handleBuild}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-blue-900/50 text-white/50 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                CONSTRUCTING...
              </>
            ) : (
              'GENERATE STRUCTURE'
            )}
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border border-white/20 text-white text-3xl transition-all duration-300 ${
          isOpen ? 'bg-red-600 rotate-90 scale-90' : 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
};
