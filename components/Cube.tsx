
import React, { useState } from 'react';
import { useBox } from '@react-three/cannon';
import { BlockType } from '../types';

interface CubeProps {
  position: [number, number, number];
  texture: BlockType;
  removeCube: (x: number, y: number, z: number) => void;
  addCube: (x: number, y: number, z: number) => void;
}

const colorMap: Record<BlockType, string> = {
  [BlockType.Dirt]: '#7c2d12',
  [BlockType.Grass]: '#166534',
  [BlockType.Glass]: '#93c5fd',
  [BlockType.Wood]: '#92400e',
  [BlockType.Log]: '#451a03',
  [BlockType.Cobblestone]: '#57534e',
  [BlockType.Stone]: '#78716c',
  [BlockType.Plank]: '#d97706',
  [BlockType.Leaves]: '#15803d',
};

export const Cube: React.FC<CubeProps> = ({ position, texture, removeCube, addCube }) => {
  const [hover, setHover] = useState<number | null>(null);
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }));

  const opacity = texture === BlockType.Glass ? 0.6 : 1;
  const transparent = texture === BlockType.Glass;

  const handleClick = (e: any) => {
    e.stopPropagation();
    const clickedFace = Math.floor(e.faceIndex / 2);
    const { x, y, z } = e.point;
    
    // Alt key or Right Click removes block
    if (e.altKey || e.nativeEvent.button === 2) {
      removeCube(...position);
      return;
    }

    // Logic to determine neighbor position based on clicked face
    // Face mapping: 0: Right, 1: Left, 2: Top, 3: Bottom, 4: Front, 5: Back
    const [px, py, pz] = position;
    let nx = px, ny = py, nz = pz;

    if (clickedFace === 0) nx++;
    else if (clickedFace === 1) nx--;
    else if (clickedFace === 2) ny++;
    else if (clickedFace === 3) ny--;
    else if (clickedFace === 4) nz++;
    else if (clickedFace === 5) nz--;

    addCube(nx, ny, nz);
  };

  return (
    <mesh
      ref={ref as any}
      castShadow
      onPointerMove={(e) => {
        e.stopPropagation();
        setHover(Math.floor(e.faceIndex! / 2));
      }}
      onPointerOut={() => setHover(null)}
      onClick={handleClick}
    >
      <boxGeometry />
      <meshStandardMaterial 
        color={colorMap[texture]} 
        opacity={opacity}
        transparent={transparent}
        emissive={hover !== null ? colorMap[texture] : 'black'}
        emissiveIntensity={hover !== null ? 0.15 : 0}
      />
    </mesh>
  );
};
