import * as Phaser from 'phaser';
import { MAX_NPCS } from '../config';
import type { NPCData } from '../types';
import type GridSystem from './GridSystem';

interface NPC {
  id: string;
  sprite: Phaser.GameObjects.Image;
  col: number;
  row: number;
  timer: Phaser.Time.TimerEvent;
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export default class NPCSystem {
  private scene: Phaser.Scene;
  private gridSystem: GridSystem;
  private npcs: Map<string, NPC> = new Map();
  private idCounter = 0;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, gridSystem: GridSystem) {
    this.scene = scene;
    this.gridSystem = gridSystem;
    this.container = this.scene.add.container(0, 0).setDepth(50);
  }

  spawn(col: number, row: number): string | null {
    if (this.npcs.size >= MAX_NPCS) return null;

    const startTile = pickRandom(this.gridSystem.getAdjacentRoadTiles(col, row));
    if (!startTile) return null;

    const { x, y } = this.gridSystem.getWorldPosition(startTile.col, startTile.row);
    const id = `npc_${this.idCounter++}`;

    const sprite = this.scene.add.image(x, y, 'npc').setScale(0.6).setDepth(50);
    this.container.add(sprite);

    const timer = this.scene.time.addEvent({
      delay: 1000 + Math.random() * 1000,
      loop: true,
      callback: () => this.moveNPC(id),
    });

    const npc: NPC = {
      id,
      sprite,
      col: startTile.col,
      row: startTile.row,
      timer,
    };

    this.npcs.set(id, npc);
    return id;
  }

  private moveNPC(id: string): void {
    const npc = this.npcs.get(id);
    if (!npc) return;

    const next = pickRandom(this.gridSystem.getAdjacentRoadTiles(npc.col, npc.row));
    if (!next) return;

    npc.col = next.col;
    npc.row = next.row;

    const { x, y } = this.gridSystem.getWorldPosition(next.col, next.row);

    this.scene.tweens.add({
      targets: npc.sprite,
      x,
      y,
      duration: 800,
      ease: 'Linear',
    });
  }

  removeNearBuilding(col: number, row: number): void {
    const toRemove: string[] = [];

    for (const [id, npc] of this.npcs) {
      const adjacent = this.gridSystem.getAdjacentRoadTiles(col, row);
      const isOnAdjacent = adjacent.some((t) => t.col === npc.col && t.row === npc.row);
      if (isOnAdjacent) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      this.despawn(id);
    }
  }

  despawn(id: string): void {
    const npc = this.npcs.get(id);
    if (!npc) return;
    npc.timer.destroy();
    npc.sprite.destroy();
    this.npcs.delete(id);
  }

  getNPCCount(): number {
    return this.npcs.size;
  }

  getNPCData(): NPCData[] {
    const result: NPCData[] = [];
    for (const npc of this.npcs.values()) {
      result.push({ id: npc.id, x: npc.col, y: npc.row });
    }
    return result;
  }

  loadNPCs(npcData: NPCData[]): void {
    for (const data of npcData) {
      if (this.npcs.size >= MAX_NPCS) break;
      if (!this.gridSystem.isWithinBounds(data.x, data.y)) continue;

      const { x, y } = this.gridSystem.getWorldPosition(data.x, data.y);
      const id = `npc_${this.idCounter++}`;

      const sprite = this.scene.add.image(x, y, 'npc').setScale(0.6).setDepth(50);
      this.container.add(sprite);

      const timer = this.scene.time.addEvent({
        delay: 1000 + Math.random() * 1000,
        loop: true,
        callback: () => this.moveNPC(id),
      });

      const npc: NPC = {
        id,
        sprite,
        col: data.x,
        row: data.y,
        timer,
      };

      this.npcs.set(id, npc);
    }
  }

  cleanup(): void {
    for (const npc of this.npcs.values()) {
      npc.timer.destroy();
      npc.sprite.destroy();
    }
    this.npcs.clear();
    this.container.destroy();
  }
}
