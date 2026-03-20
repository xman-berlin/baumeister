import * as Phaser from 'phaser';
import { TILE_SIZE, GRID_COLS, GRID_ROWS } from '../config';
import { BuildingType } from '../types';

export default class GridSystem {
  private scene: Phaser.Scene;
  private grid: Map<string, BuildingType>;
  private tileSprites: Map<string, Phaser.GameObjects.Image>;
  private hoverHighlight: Phaser.GameObjects.Rectangle | null = null;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.grid = new Map();
    this.tileSprites = new Map();
    this.container = this.scene.add.container(0, 0);
  }

  renderGrid(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = col * TILE_SIZE + TILE_SIZE / 2;
        const y = row * TILE_SIZE + TILE_SIZE / 2;
        const key = `${col},${row}`;

        const tile = this.scene.add.image(x, y, 'grass').setInteractive();
        this.tileSprites.set(key, tile);
        this.container.add(tile);
      }
    }

    this.hoverHighlight = this.scene.add
      .rectangle(0, 0, TILE_SIZE, TILE_SIZE, 0xffffff, 0.3)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false);
    this.container.add(this.hoverHighlight);
  }

  getTilePosition(worldX: number, worldY: number): { col: number; row: number } {
    const col = Math.floor(worldX / TILE_SIZE);
    const row = Math.floor(worldY / TILE_SIZE);
    return { col, row };
  }

  getWorldPosition(col: number, row: number): { x: number; y: number } {
    return {
      x: col * TILE_SIZE + TILE_SIZE / 2,
      y: row * TILE_SIZE + TILE_SIZE / 2,
    };
  }

  isWithinBounds(col: number, row: number): boolean {
    return col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS;
  }

  isOccupied(col: number, row: number): boolean {
    return this.grid.has(`${col},${row}`);
  }

  placeBuilding(col: number, row: number, type: BuildingType): void {
    const key = `${col},${row}`;
    this.grid.set(key, type);

    const existing = this.tileSprites.get(key);
    if (existing) {
      existing.destroy();
    }

    const { x, y } = this.getWorldPosition(col, row);
    const buildingTypeToTexture: Record<BuildingType, string> = {
      [BuildingType.House]: 'house',
      [BuildingType.Road]: 'road',
      [BuildingType.Sawmill]: 'sawmill',
      [BuildingType.Quarry]: 'quarry',
      [BuildingType.Market]: 'market',
      [BuildingType.Park]: 'park',
    };

    const sprite = this.scene.add.image(x, y, buildingTypeToTexture[type]);
    this.tileSprites.set(key, sprite);
    this.container.add(sprite);
  }

  updateHover(worldX: number, worldY: number): void {
    if (!this.hoverHighlight) return;
    const { col, row } = this.getTilePosition(worldX, worldY);

    if (this.isWithinBounds(col, row)) {
      this.hoverHighlight.setPosition(
        col * TILE_SIZE + TILE_SIZE / 2,
        row * TILE_SIZE + TILE_SIZE / 2,
      );
      this.hoverHighlight.setVisible(true);
    } else {
      this.hoverHighlight.setVisible(false);
    }
  }

  getOccupiedKeys(): Map<string, BuildingType> {
    return new Map(this.grid);
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  removeBuilding(col: number, row: number): void {
    const key = `${col},${row}`;
    const sprite = this.tileSprites.get(key);
    if (sprite) {
      sprite.destroy();
      this.tileSprites.delete(key);
    }
    this.grid.delete(key);

    const { x, y } = this.getWorldPosition(col, row);
    const grassSprite = this.scene.add.image(x, y, 'grass');
    this.tileSprites.set(key, grassSprite);
    this.container.add(grassSprite);
  }

  getBuildingType(col: number, row: number): BuildingType | undefined {
    return this.grid.get(`${col},${row}`);
  }

  getSpriteAt(col: number, row: number): Phaser.GameObjects.Image | undefined {
    return this.tileSprites.get(`${col},${row}`);
  }

  getAdjacentRoadTiles(col: number, row: number): Array<{ col: number; row: number }> {
    const directions = [
      { dc: -1, dr: 0 },
      { dc: 1, dr: 0 },
      { dc: 0, dr: -1 },
      { dc: 0, dr: 1 },
    ];
    const result: Array<{ col: number; row: number }> = [];
    for (const { dc, dr } of directions) {
      const c = col + dc;
      const r = row + dr;
      if (this.isWithinBounds(c, r) && this.getBuildingType(c, r) === BuildingType.Road) {
        result.push({ col: c, row: r });
      }
    }
    return result;
  }

  clear(): void {
    this.grid.clear();
    this.tileSprites.forEach((sprite) => sprite.destroy());
    this.tileSprites.clear();
  }
}
