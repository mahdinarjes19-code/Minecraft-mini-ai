
import { useState, useCallback } from 'react';
import { BlockType, CubeData } from '../types';

const getLocalStorage = (key: string) => JSON.parse(window.localStorage.getItem(key) || 'null');
const setLocalStorage = (key: string, value: any) => window.localStorage.setItem(key, JSON.stringify(value));

export const useStore = () => {
  const [cubes, setCubes] = useState<CubeData[]>(getLocalStorage('world') || []);
  const [texture, setTexture] = useState<BlockType>(BlockType.Grass);
  const [health, setHealth] = useState<number>(getLocalStorage('health') ?? 10);

  const addCube = useCallback((x: number, y: number, z: number) => {
    setCubes((prev) => {
      const exists = prev.some(c => c.pos[0] === x && c.pos[1] === y && c.pos[2] === z);
      if (exists) return prev;
      return [...prev, { pos: [x, y, z], texture }];
    });
  }, [texture]);

  const removeCube = useCallback((x: number, y: number, z: number) => {
    setCubes((prev) => prev.filter(cube => {
      const [cx, cy, cz] = cube.pos;
      return cx !== x || cy !== y || cz !== z;
    }));
  }, []);

  const saveWorld = useCallback(() => {
    setLocalStorage('world', cubes);
    setLocalStorage('health', health);
  }, [cubes, health]);

  const resetWorld = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the entire world?")) {
      setCubes([]);
      setHealth(10);
    }
  }, []);

  const takeDamage = useCallback((amount: number) => {
    setHealth((prev) => Math.max(0, prev - amount));
  }, []);

  const heal = useCallback((amount: number) => {
    setHealth((prev) => Math.min(10, prev + amount));
  }, []);

  const applyAIPatch = useCallback((commands: {pos: [number, number, number], texture: BlockType}[]) => {
    setCubes(prev => {
      const newCubes = [...prev];
      commands.forEach(cmd => {
        const roundedPos: [number, number, number] = [
          Math.round(cmd.pos[0]), 
          Math.round(cmd.pos[1]), 
          Math.round(cmd.pos[2])
        ];
        const exists = newCubes.some(c => 
          c.pos[0] === roundedPos[0] && 
          c.pos[1] === roundedPos[1] && 
          c.pos[2] === roundedPos[2]
        );
        if (!exists) {
          newCubes.push({ pos: roundedPos, texture: cmd.texture });
        }
      });
      return newCubes;
    });
  }, []);

  return {
    cubes,
    texture,
    health,
    addCube,
    removeCube,
    setTexture,
    saveWorld,
    resetWorld,
    applyAIPatch,
    takeDamage,
    heal
  };
};
