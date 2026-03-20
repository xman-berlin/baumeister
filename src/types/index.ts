export enum BuildingType {
  House = 'House',
  Road = 'Road',
  Sawmill = 'Sawmill',
  Quarry = 'Quarry',
  Market = 'Market',
  Park = 'Park',
}

export interface Resources {
  wood: number;
  stone: number;
  coins: number;
}

export interface BuildingConfig {
  type: BuildingType;
  label: string;
  cost: Resources;
  production: Partial<Resources>;
  productionInterval: number;
  tileSize: { width: number; height: number };
  spriteKey: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  goal: number;
  reward: Partial<Resources>;
}

export interface NPCData {
  id: string;
  x: number;
  y: number;
}

export interface SaveData {
  version: number;
  resources: Resources;
  grid: Record<string, BuildingType>;
  npcs: NPCData[];
  missions: {
    completed: number[];
    active: number;
  };
  playtime: number;
}

export type ResourceType = keyof Resources;
