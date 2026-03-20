import * as Phaser from 'phaser';
import { MISSIONS } from '../config';
import { BuildingType, type Mission } from '../types';
import type GridSystem from './GridSystem';
import type ResourceSystem from './ResourceSystem';
import type NPCSystem from './NPCSystem';

type MissionCompleteCallback = (mission: Mission) => void;

export default class MissionSystem {
  private gridSystem: GridSystem;
  private resourceSystem: ResourceSystem;
  private npcSystem: NPCSystem;
  private activeIndex = 0;
  private completed: number[] = [];
  private onComplete: MissionCompleteCallback | null = null;

  constructor(
    _scene: Phaser.Scene,
    gridSystem: GridSystem,
    resourceSystem: ResourceSystem,
    npcSystem: NPCSystem,
  ) {
    this.gridSystem = gridSystem;
    this.resourceSystem = resourceSystem;
    this.npcSystem = npcSystem;
  }

  setOnComplete(callback: MissionCompleteCallback): void {
    this.onComplete = callback;
  }

  getActiveMission(): Mission | null {
    if (this.activeIndex >= MISSIONS.length) return null;
    return MISSIONS[this.activeIndex] ?? null;
  }

  getProgress(): number {
    const mission = this.getActiveMission();
    if (!mission) return 0;
    return this.countProgress(mission);
  }

  getGoal(): number {
    const mission = this.getActiveMission();
    return mission?.goal ?? 0;
  }

  isAllComplete(): boolean {
    return this.activeIndex >= MISSIONS.length;
  }

  getCompletedCount(): number {
    return this.completed.length;
  }

  getSaveState(): { completed: number[]; active: number } {
    return { completed: [...this.completed], active: this.activeIndex };
  }

  loadState(state: { completed: number[]; active: number }): void {
    this.completed = [...state.completed];
    this.activeIndex = state.active;
  }

  checkProgress(): void {
    const mission = this.getActiveMission();
    if (!mission) return;

    const progress = this.countProgress(mission);
    if (progress >= mission.goal) {
      this.completeMission(mission);
    }
  }

  private countProgress(mission: Mission): number {
    const grid = this.gridSystem.getOccupiedKeys();

    switch (mission.id) {
      case 1: {
        let count = 0;
        for (const type of grid.values()) {
          if (type === BuildingType.House) count++;
        }
        return count;
      }
      case 2: {
        let count = 0;
        for (const type of grid.values()) {
          if (type === BuildingType.Road) count++;
        }
        return count;
      }
      case 3: {
        let count = 0;
        for (const type of grid.values()) {
          if (type === BuildingType.Sawmill) count++;
        }
        return count;
      }
      case 4: {
        let count = 0;
        for (const type of grid.values()) {
          if (type === BuildingType.House) count++;
        }
        return count;
      }
      case 5: {
        let count = 0;
        for (const type of grid.values()) {
          if (type === BuildingType.Market) count++;
        }
        return count;
      }
      case 6: {
        let count = 0;
        for (const type of grid.values()) {
          if (type === BuildingType.Park) count++;
        }
        return count;
      }
      case 7:
        return this.npcSystem.getNPCCount();
      default:
        return 0;
    }
  }

  private completeMission(mission: Mission): void {
    this.completed.push(mission.id);
    this.activeIndex++;

    this.resourceSystem.add(mission.reward);

    if (this.onComplete) {
      this.onComplete(mission);
    }
  }
}
