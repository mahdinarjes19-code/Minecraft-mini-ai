
import React, { useRef, useState, useEffect } from 'react';

export const Joystick: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.TouchEvent) => {
    if (!active || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = rect.width / 2;
    
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    
    setPos({ x: dx, y: dy });

    // Map to keyboard events for the useKeyboard hook to pick up
    const threshold = 15;
    window.dispatchEvent(new KeyboardEvent(dy < -threshold ? 'keydown' : 'keyup', { code: 'KeyW' }));
    window.dispatchEvent(new KeyboardEvent(dy > threshold ? 'keydown' : 'keyup', { code: 'KeyS' }));
    window.dispatchEvent(new KeyboardEvent(dx < -threshold ? 'keydown' : 'keyup', { code: 'KeyA' }));
    window.dispatchEvent(new KeyboardEvent(dx > threshold ? 'keydown' : 'keyup', { code: 'KeyD' }));
  };

  const handleEnd = () => {
    setActive(false);
    setPos({ x: 0, y: 0 });
    ['KeyW', 'KeyS', 'KeyA', 'KeyD'].forEach(code => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code }));
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/20 relative flex items-center justify-center touch-none"
      onTouchStart={() => setActive(true)}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div 
        className="w-12 h-12 bg-white/40 rounded-full border-2 border-white/40 shadow-xl transition-transform duration-75"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      />
    </div>
  );
};
