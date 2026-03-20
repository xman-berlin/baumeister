import * as Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const { width, height } = this.cameras.main;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Laden...', {
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00cc44, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Placeholder: generate simple colored textures
    this.generatePlaceholderTextures();
  }

  private generatePlaceholderTextures(): void {
    const gfx = this.make.graphics({});
    const ts = 64;

    gfx.fillStyle(0x4caf50, 1);
    gfx.fillRect(0, 0, ts, ts);
    gfx.generateTexture('grass', ts, ts);
    gfx.clear();

    gfx.fillStyle(0x795548, 1);
    gfx.fillRect(8, 8, ts - 16, ts - 16);
    gfx.generateTexture('house', ts, ts);
    gfx.clear();

    gfx.fillStyle(0x9e9e9e, 1);
    gfx.fillRect(4, 28, ts - 8, 8);
    gfx.generateTexture('road', ts, ts);
    gfx.clear();

    gfx.fillStyle(0xffa726, 1);
    gfx.fillRect(0, 0, ts * 2, ts * 2);
    gfx.generateTexture('sawmill', ts * 2, ts * 2);
    gfx.clear();

    gfx.fillStyle(0x757575, 1);
    gfx.fillRect(0, 0, ts * 2, ts * 2);
    gfx.generateTexture('quarry', ts * 2, ts * 2);
    gfx.clear();

    gfx.fillStyle(0x2196f3, 1);
    gfx.fillRect(0, 0, ts * 2, ts * 2);
    gfx.generateTexture('market', ts * 2, ts * 2);
    gfx.clear();

    gfx.fillStyle(0x66bb6a, 1);
    gfx.fillRect(16, 16, ts - 32, ts - 32);
    gfx.generateTexture('park', ts, ts);
    gfx.clear();

    gfx.fillStyle(0xfdd835, 1);
    gfx.fillCircle(ts / 2, ts / 2, ts / 3);
    gfx.generateTexture('npc', ts, ts);
    gfx.clear();

    gfx.destroy();
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
