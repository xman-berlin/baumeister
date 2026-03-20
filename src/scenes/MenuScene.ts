import * as Phaser from 'phaser';
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from '../config';
import SaveSystem from '../systems/SaveSystem';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = (GRID_COLS * TILE_SIZE) / 2;
    const centerY = (GRID_ROWS * TILE_SIZE) / 2;

    this.add.rectangle(centerX, centerY, GRID_COLS * TILE_SIZE, GRID_ROWS * TILE_SIZE, 0x1a1a2e);

    this.add
      .text(centerX, centerY - 120, 'Baumeister', {
        fontSize: '48px',
        color: '#ffcc00',
        fontFamily: 'Fredoka One, sans-serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY - 70, 'Kindergerechte Aufbausimulation', {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5);

    const newGameBtn = this.createButton(centerX, centerY + 20, 'Neues Spiel', () => {
      if (SaveSystem.loadRaw()) {
        localStorage.removeItem('baumeister_save');
      }
      this.scene.start('GameScene', { loadSave: false });
    });

    const hasSave = SaveSystem.loadRaw() !== null;

    if (hasSave) {
      const continueBtn = this.createButton(centerX, centerY + 80, 'Weiterspielen', () => {
        this.scene.start('GameScene', { loadSave: true });
      });
      this.add.existing(continueBtn);
    }

    this.add.existing(newGameBtn);
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const width = 220;
    const height = 50;

    const bg = this.add
      .rectangle(0, 0, width, height, 0x333333, 0.9)
      .setStrokeStyle(2, 0x666666)
      .setInteractive({ useHandCursor: true });
    container.add(bg);

    const text = this.add
      .text(0, 0, label, {
        fontSize: '22px',
        color: '#ffffff',
        fontFamily: 'Fredoka One, sans-serif',
      })
      .setOrigin(0.5);
    container.add(text);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x444444, 0.9);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x333333, 0.9);
    });
    bg.on('pointerdown', onClick);

    return container;
  }
}
