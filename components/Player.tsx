
import React, { useEffect, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { Text } from '@react-three/drei';

const JUMP_FORCE = 4;
const SPEED = 5;
const FALL_DAMAGE_THRESHOLD = -10;

interface PlayerProps {
  isThirdPerson?: boolean;
  onTakeDamage?: (amount: number) => void;
  health: number;
}

export const Player: React.FC<PlayerProps> = ({ isThirdPerson = false, onTakeDamage, health }) => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 2, 0],
    args: [0.4], 
  }));

  const velocity = useRef([0, 0, 0]);
  const lastYVelocity = useRef(0);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      if (lastYVelocity.current < FALL_DAMAGE_THRESHOLD && v[1] > -1) {
        const damage = Math.floor(Math.abs(lastYVelocity.current) / 5);
        if (onTakeDamage) onTakeDamage(damage);
      }
      velocity.current = v;
      lastYVelocity.current = v[1];
    });
    return unsubscribe;
  }, [api.velocity, onTakeDamage]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => (pos.current = p));
    return unsubscribe;
  }, [api.position]);

  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard();

  useFrame(() => {
    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, Number(moveBackward) - Number(moveForward));
    const sideVector = new Vector3(Number(moveLeft) - Number(moveRight), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.01) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    const p = pos.current;
    if (isThirdPerson) {
      const offset = new Vector3(0, 2, 5).applyEuler(camera.rotation);
      camera.position.lerp(new Vector3(p[0] + offset.x, p[1] + offset.y, p[2] + offset.z), 0.1);
      camera.lookAt(p[0], p[1] + 0.5, p[2]);
    } else {
      camera.position.copy(new Vector3(p[0], p[1] + 0.7, p[2]));
    }
  });

  return (
    <group ref={ref as any}>
      {/* Visual representation of the character */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 1.6, 0.4]} />
        <meshStandardMaterial color={health > 3 ? "#3b82f6" : "#ef4444"} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      
      {/* Floating heart for player - visible in 3rd person */}
      {isThirdPerson && (
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {health > 0 ? "❤️" : "💀"}
        </Text>
      )}
    </group>
  );
};
