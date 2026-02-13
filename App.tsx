
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { Cubes } from './components/Cubes';
import { TextureSelector } from './components/TextureSelector';
import { useStore } from './hooks/useStore';
import { useKeyboard } from './hooks/useKeyboard';
import { Menu } from './components/Menu';
import { Joystick } from './components/Joystick';
import { AIAgent } from './components/AIAgent';
import { HealthBar } from './components/HealthBar';
import { BlockType } from './types';

const App: React.FC = () => {
  const store = useStore();
  const keyboard = useKeyboard();
  const [isMobile, setIsMobile] = useState(false);
  const [isThirdPerson, setIsThirdPerson] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  // Keyboard shortcut switching for textures
  useEffect(() => {
    if (keyboard.dirt) store.setTexture(BlockType.Dirt);
    if (keyboard.grass) store.setTexture(BlockType.Grass);
    if (keyboard.glass) store.setTexture(BlockType.Glass);
    if (keyboard.wood) store.setTexture(BlockType.Wood);
    if (keyboard.log) store.setTexture(BlockType.Log);
    if (keyboard.cobblestone) store.setTexture(BlockType.Cobblestone);
    if (keyboard.stone) store.setTexture(BlockType.Stone);
    if (keyboard.plank) store.setTexture(BlockType.Plank);
    if (keyboard.leaves) store.setTexture(BlockType.Leaves);
  }, [keyboard]);

  useEffect(() => {
    if (store.health === 0) {
      setTimeout(() => {
        alert("You have died! Respawning...");
        store.resetWorld(); // Reset health and clear world on death
        window.location.reload(); 
      }, 500);
    }
  }, [store.health, store]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-900 select-none touch-none overflow-hidden font-sans">
      <Canvas shadows camera={{ fov: 45, position: [0, 5, 10] }}>
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={2} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={0.8} castShadow />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
        
        <Physics gravity={[0, -9.81, 0]}>
          <Player 
            isThirdPerson={isThirdPerson} 
            onTakeDamage={store.takeDamage}
            health={store.health}
          />
          <Cubes 
            cubes={store.cubes} 
            removeCube={store.removeCube} 
            addCube={store.addCube} 
          />
          <Ground addCube={store.addCube} />
        </Physics>

        {!isMobile && <PointerLockControls />}
      </Canvas>

      {/* Crosshair */}
      {!isMobile && !isThirdPerson && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none text-2xl font-light opacity-30 select-none">
          +
        </div>
      )}

      {/* Top Left: UI Menu */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Menu 
          saveWorld={store.saveWorld} 
          resetWorld={store.resetWorld}
          cubeCount={store.cubes.length}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsThirdPerson(!isThirdPerson)}
            className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-white text-[10px] font-bold hover:bg-white/20 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            <span>👁️</span> {isThirdPerson ? '3rd Person' : '1st Person'}
          </button>
          {isMobile && (
            <button
              onClick={toggleFullscreen}
              className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-white text-[10px] font-bold hover:bg-white/20 transition-colors uppercase tracking-widest"
            >
              {isFullscreen ? 'Exit Full' : 'Fullscreen'}
            </button>
          )}
        </div>
      </div>

      {/* Top Center: Health Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <HealthBar health={store.health} />
      </div>

      {/* Top Right: AI Agent */}
      <div className="absolute top-4 right-4 z-10">
        <AIAgent onApplyPatch={store.applyAIPatch} />
      </div>

      {/* Bottom Center: Texture Selector */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[90%] md:w-auto overflow-x-auto">
        <TextureSelector 
          activeTexture={store.texture} 
          setTexture={store.setTexture} 
        />
      </div>

      {/* Mobile Movement Controls */}
      {isMobile && (
        <>
          <div className="absolute bottom-12 left-12 z-10 scale-90 md:scale-100 origin-bottom-left">
            <Joystick />
          </div>
          <div className="absolute bottom-12 right-12 z-10 flex flex-col gap-6 items-center">
             <button 
                className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/20 flex items-center justify-center text-white text-sm font-black shadow-2xl active:scale-90 active:bg-white/20 transition-all"
                onPointerDown={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
                }}
                onPointerUp={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
                }}
             >
                JUMP
             </button>
             <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Mobile Control v1.0</div>
          </div>
        </>
      )}

      {/* Keyboard info for Desktop */}
      {!isMobile && (
        <div className="absolute bottom-4 right-4 text-white font-mono text-[9px] opacity-40 bg-black/40 p-3 rounded-xl pointer-events-none border border-white/10">
          WASD MOVE • SPACE JUMP • V VIEW • 1-9 BLOCKS
        </div>
      )}
    </div>
  );
};

export default App;
