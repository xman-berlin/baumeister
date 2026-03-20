import { BuildingType, type BuildingConfig, type Mission, type Resources } from './types';

export const TILE_SIZE = 64;
export const GRID_COLS = 20;
export const GRID_ROWS = 15;
export const MAX_NPCS = 10;
export const SAVE_KEY = 'baumeister_save';
export const AUTO_SAVE_INTERVAL = 30_000;

export const STARTING_RESOURCES: Readonly<Resources> = {
  wood: 20,
  stone: 15,
  coins: 10,
};

export const BUILDINGS: Readonly<Record<BuildingType, BuildingConfig>> = {
  [BuildingType.House]: {
    type: BuildingType.House,
    label: 'Haus',
    cost: { wood: 5, stone: 3, coins: 0 },
    production: {},
    productionInterval: 0,
    tileSize: { width: 1, height: 1 },
    spriteKey: 'house',
  },
  [BuildingType.Road]: {
    type: BuildingType.Road,
    label: 'Strasse',
    cost: { wood: 0, stone: 1, coins: 0 },
    production: {},
    productionInterval: 0,
    tileSize: { width: 1, height: 1 },
    spriteKey: 'road',
  },
  [BuildingType.Sawmill]: {
    type: BuildingType.Sawmill,
    label: 'Saegewerk',
    cost: { wood: 8, stone: 0, coins: 0 },
    production: { wood: 2 },
    productionInterval: 10_000,
    tileSize: { width: 2, height: 2 },
    spriteKey: 'sawmill',
  },
  [BuildingType.Quarry]: {
    type: BuildingType.Quarry,
    label: 'Steinbruch',
    cost: { wood: 0, stone: 5, coins: 0 },
    production: { stone: 2 },
    productionInterval: 10_000,
    tileSize: { width: 2, height: 2 },
    spriteKey: 'quarry',
  },
  [BuildingType.Market]: {
    type: BuildingType.Market,
    label: 'Markt',
    cost: { wood: 10, stone: 10, coins: 0 },
    production: { coins: 3 },
    productionInterval: 15_000,
    tileSize: { width: 2, height: 2 },
    spriteKey: 'market',
  },
  [BuildingType.Park]: {
    type: BuildingType.Park,
    label: 'Park',
    cost: { wood: 0, stone: 0, coins: 3 },
    production: {},
    productionInterval: 0,
    tileSize: { width: 1, height: 1 },
    spriteKey: 'park',
  },
};

export const MISSIONS: ReadonlyArray<Mission> = [
  {
    id: 1,
    title: 'Erstes Haus',
    description: 'Baue 1 Haus',
    goal: 1,
    reward: { wood: 10, stone: 5 },
  },
  {
    id: 2,
    title: 'Strasse bauen',
    description: 'Lege 3 Strassen-Tiles',
    goal: 3,
    reward: { coins: 5 },
  },
  {
    id: 3,
    title: 'Holz produzieren',
    description: 'Baue 1 Saegewerk',
    goal: 1,
    reward: { stone: 10 },
  },
  {
    id: 4,
    title: 'Kleine Stadt',
    description: 'Baue 3 Haeuser',
    goal: 3,
    reward: {},
  },
  {
    id: 5,
    title: 'Marktplatz',
    description: 'Baue 1 Markt',
    goal: 1,
    reward: { coins: 15 },
  },
  {
    id: 6,
    title: 'Grüne Stadt',
    description: 'Platziere 5 Parks',
    goal: 5,
    reward: { wood: 20 },
  },
  {
    id: 7,
    title: 'Grosse Stadt',
    description: 'Erreiche 5 Bewohner',
    goal: 5,
    reward: {},
  },
];
