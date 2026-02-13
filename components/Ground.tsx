
import React from 'react';
import { usePlane } from '@react-three/cannon';

interface GroundProps {
  addCube: (x: number, y: number, z: number) => void;
}

export const Ground: React.FC<GroundProps> = ({ addCube }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  return (
    <mesh 
      ref={ref as any} 
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        // Use Math.round for better snapping to the 1x1 voxel grid
        const { x, z } = e.point;
        addCube(Math.round(x), 0, Math.round(z));
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#2d5a27" />
    </mesh>
  );
};
