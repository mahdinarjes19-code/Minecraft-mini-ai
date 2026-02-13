
import React from 'react';
import { CubeData } from '../types';
import { Cube } from './Cube';

interface CubesProps {
  cubes: CubeData[];
  removeCube: (x: number, y: number, z: number) => void;
  addCube: (x: number, y: number, z: number) => void;
}

export const Cubes: React.FC<CubesProps> = ({ cubes, removeCube, addCube }) => {
  return (
    <>
      {cubes.map((cube, idx) => (
        <Cube 
          key={`${cube.pos.join('-')}-${idx}`} 
          position={cube.pos} 
          texture={cube.texture} 
          removeCube={removeCube}
          addCube={addCube}
        />
      ))}
    </>
  );
};
