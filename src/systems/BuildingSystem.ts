import { BUILDINGS } from '../config';
import { BuildingType } from '../types';
import type GridSystem from './GridSystem';
import type ResourceSystem from './ResourceSystem';

export default class BuildingSystem {
  private gridSystem: GridSystem;
  private resourceSystem: ResourceSystem;
  private selectedBuilding: BuildingType | null = null;
  private previewSprite: Phaser.GameObjects.Image | null = null;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gridSystem: GridSystem, resourceSystem: ResourceSystem) {
    this.scene = scene;
    this.gridSystem = gridSystem;
    this.resourceSystem = resourceSystem;
  }

  selectBuilding(type: BuildingType | null): void {
    this.selectedBuilding = type;
    if (this.previewSprite) {
      this.previewSprite.destroy();
      this.previewSprite = null;
    }
    if (type) {
      this.previewSprite = this.scene.add
        .image(0, 0, BUILDINGS[type].spriteKey)
        .setAlpha(0.5)
        .setDepth(100)
        .setVisible(false);
    }
  }

  updatePreview(worldX: number, worldY: number): void {
    if (!this.previewSprite || !this.selectedBuilding) return;

    const { col, row } = this.gridSystem.getTilePosition(worldX, worldY);
    if (!this.gridSystem.isWithinBounds(col, row)) {
      this.previewSprite.setVisible(false);
      return;
    }

    const valid = this.canPlace(col, row, this.selectedBuilding);
    const { x, y } = this.gridSystem.getWorldPosition(col, row);

    this.previewSprite
      .setPosition(x, y)
      .setVisible(true)
      .setTint(valid ? 0xffffff : 0xff4444);
  }

  canPlace(col: number, row: number, type: BuildingType): boolean {
    const config = BUILDINGS[type];
    if (!this.resourceSystem.canAfford(config.cost)) return false;

    for (let dc = 0; dc < config.tileSize.width; dc++) {
      for (let dr = 0; dr < config.tileSize.height; dr++) {
        const c = col + dc;
        const r = row + dr;
        if (!this.gridSystem.isWithinBounds(c, r)) return false;
        if (this.gridSystem.isOccupied(c, r)) return false;
      }
    }
    return true;
  }

  place(col: number, row: number): boolean {
    if (!this.selectedBuilding) return false;
    if (!this.canPlace(col, row, this.selectedBuilding)) return false;

    const config = BUILDINGS[this.selectedBuilding];
    this.resourceSystem.spend(config.cost);
    this.gridSystem.placeBuilding(col, row, this.selectedBuilding);
    this.resourceSystem.startProduction(this.selectedBuilding);
    return true;
  }

  remove(col: number, row: number): boolean {
    if (!this.gridSystem.isOccupied(col, row)) return false;
    this.gridSystem.removeBuilding(col, row);
    return true;
  }

  getSelectedBuilding(): BuildingType | null {
    return this.selectedBuilding;
  }

  cleanup(): void {
    if (this.previewSprite) {
      this.previewSprite.destroy();
      this.previewSprite = null;
    }
  }
}
