import { SAVE_KEY } from '../config';
import { BuildingType, type SaveData } from '../types';
import type GridSystem from './GridSystem';
import type ResourceSystem from './ResourceSystem';
import type NPCSystem from './NPCSystem';
import type MissionSystem from './MissionSystem';

const SAVE_VERSION = 1;

export default class SaveSystem {
  private gridSystem: GridSystem;
  private resourceSystem: ResourceSystem;
  private npcSystem: NPCSystem;
  private missionSystem: MissionSystem;
  private playtime = 0;
  private playtimeTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    gridSystem: GridSystem,
    resourceSystem: ResourceSystem,
    npcSystem: NPCSystem,
    missionSystem: MissionSystem,
  ) {
    this.gridSystem = gridSystem;
    this.resourceSystem = resourceSystem;
    this.npcSystem = npcSystem;
    this.missionSystem = missionSystem;
  }

  startPlaytimeTracking(): void {
    this.playtimeTimer = setInterval(() => {
      this.playtime++;
    }, 1000);
  }

  stopPlaytimeTracking(): void {
    if (this.playtimeTimer) {
      clearInterval(this.playtimeTimer);
      this.playtimeTimer = null;
    }
  }

  save(): void {
    const grid: Record<string, BuildingType> = {};
    for (const [key, type] of this.gridSystem.getOccupiedKeys()) {
      grid[key] = type;
    }

    const saveData: SaveData = {
      version: SAVE_VERSION,
      resources: this.resourceSystem.getResources(),
      grid,
      npcs: this.npcSystem.getNPCData(),
      missions: this.missionSystem.getSaveState(),
      playtime: this.playtime,
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch {
      console.warn('Speichern fehlgeschlagen');
    }
  }

  load(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;

      const data = JSON.parse(raw) as SaveData;
      if (data.version !== SAVE_VERSION) return false;

      this.playtime = data.playtime ?? 0;
      return true;
    } catch {
      return false;
    }
  }

  hasSave(): boolean {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  deleteSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // ignore
    }
  }

  getPlaytime(): number {
    return this.playtime;
  }

  static loadRaw(): SaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SaveData;
    } catch {
      return null;
    }
  }
}
