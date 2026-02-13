
export enum BlockType {
  Dirt = 'dirt',
  Grass = 'grass',
  Glass = 'glass',
  Wood = 'wood',
  Log = 'log',
  Cobblestone = 'cobblestone',
  Stone = 'stone',
  Plank = 'plank',
  Leaves = 'leaves',
}

export interface CubeData {
  pos: [number, number, number];
  texture: BlockType;
}

export interface StoreState {
  texture: BlockType;
  cubes: CubeData[];
  health: number;
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (x: number, y: number, z: number) => void;
  setTexture: (texture: BlockType) => void;
  saveWorld: () => void;
  resetWorld: () => void;
  applyAIPatch: (commands: {pos: [number, number, number], texture: BlockType}[]) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
}

export interface AIBuildCommand {
  action: 'add' | 'remove';
  pos: [number, number, number];
  texture: BlockType;
}
