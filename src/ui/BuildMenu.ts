import * as Phaser from 'phaser';
import { BUILDINGS } from '../config';
import { BuildingType } from '../types';

export default class BuildMenu {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private onSelect: (type: BuildingType | null) => void;
  private buttons: Phaser.GameObjects.Container[] = [];
  private selectedHighlight: Phaser.GameObjects.Rectangle | null = null;

  constructor(scene: Phaser.Scene, onSelect: (type: BuildingType | null) => void) {
    this.scene = scene;
    this.onSelect = onSelect;
    this.create();
  }

  private create(): void {
    const { width } = this.scene.cameras.main;
    const types = Object.values(BuildingType);
    const btnSize = 64;
    const padding = 8;
    const totalWidth = types.length * (btnSize + padding) - padding;
    const startX = (width - totalWidth) / 2;

    this.container = this.scene.add
      .container(0, 0)
      .setDepth(200)
      .setScrollFactor(0);

    const bg = this.scene.add
      .rectangle(0, 0, width, btnSize + padding * 2 + 30, 0x000000, 0.6)
      .setOrigin(0, 1)
      .setPosition(0, this.scene.cameras.main.height);
    this.container.add(bg);

    types.forEach((type, i) => {
      const x = startX + i * (btnSize + padding) + btnSize / 2;
      const y = this.scene.cameras.main.height - padding - btnSize / 2 - 15;

      const btn = this.scene.add.container(x, y);
      btn.setSize(btnSize, btnSize);

      const bgRect = this.scene.add
        .rectangle(0, 0, btnSize, btnSize, 0x333333, 0.8)
        .setStrokeStyle(2, 0x666666);
      btn.add(bgRect);

      const sprite = this.scene.add.image(0, 0, BUILDINGS[type].spriteKey).setScale(0.8);
      btn.add(sprite);

      const label = this.scene.add
        .text(0, btnSize / 2 + 8, BUILDINGS[type].label, {
          fontSize: '14px',
          color: '#ffffff',
          fontFamily: 'Fredoka One, sans-serif',
        })
        .setOrigin(0.5);
      btn.add(label);

      const cost = BUILDINGS[type].cost;
      const costParts: string[] = [];
      if (cost.wood > 0) costParts.push(`${cost.wood}H`);
      if (cost.stone > 0) costParts.push(`${cost.stone}S`);
      if (cost.coins > 0) costParts.push(`${cost.coins}M`);
      const costText = this.scene.add
        .text(0, btnSize / 2 + 22, costParts.join(' '), {
          fontSize: '12px',
          color: '#aaaaaa',
          fontFamily: 'sans-serif',
        })
        .setOrigin(0.5);
      btn.add(costText);

      const hitArea = this.scene.add
        .rectangle(0, 0, btnSize, btnSize + 20, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });
      btn.add(hitArea);

      hitArea.on('pointerdown', () => {
        this.onSelect(type);
        this.highlightButton(btn);
      });

      this.buttons.push(btn);
      this.container.add(btn);
    });
  }

  private highlightButton(btn: Phaser.GameObjects.Container): void {
    if (this.selectedHighlight) {
      this.selectedHighlight.destroy();
    }
    this.selectedHighlight = this.scene.add
      .rectangle(btn.x, btn.y, 68, 68)
      .setStrokeStyle(3, 0x00ff00);
    this.container.add(this.selectedHighlight);
  }

  clearSelection(): void {
    if (this.selectedHighlight) {
      this.selectedHighlight.destroy();
      this.selectedHighlight = null;
    }
    this.onSelect(null);
  }

  destroy(): void {
    this.container.destroy();
  }
}
