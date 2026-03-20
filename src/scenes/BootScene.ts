import * as Phaser from 'phaser';

const TILE_SIZE = 16;
const TILE_COLS = 12;

function frameAt(col: number, row: number): number {
  return row * TILE_COLS + col;
}

const FRAMES = {
  grass: frameAt(1, 0),
  road: frameAt(3, 1),
  house: frameAt(4, 3),
  sawmill: frameAt(0, 4),
  quarry: frameAt(2, 4),
  market: frameAt(4, 4),
  park: frameAt(0, 2),
  npc: frameAt(0, 9),
};

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

    this.load.spritesheet('tilemap', 'assets/tiles/tilemap.png', {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
      margin: 0,
      spacing: 1,
    });
  }

  create(): void {
    const sheet = this.textures.get('tilemap');
    sheet.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const gfx = this.make.graphics({});
    const scale = 4;

    for (const [key, frame] of Object.entries(FRAMES)) {
      gfx.clear();
      const size = key === 'sawmill' || key === 'quarry' || key === 'market' ? TILE_SIZE * 2 : TILE_SIZE;
      const outputSize = size * scale;

      for (let dy = 0; dy < (size / TILE_SIZE); dy++) {
        for (let dx = 0; dx < (size / TILE_SIZE); dx++) {
          const f = frame + dx + dy * TILE_COLS;
          const frameData = sheet.get(f);
          if (!frameData) continue;

          const srcX = (frameData as Phaser.Textures.Frame).cutX;
          const srcY = (frameData as Phaser.Textures.Frame).cutY;

          gfx.save();
          for (let py = 0; py < TILE_SIZE; py++) {
            for (let px = 0; px < TILE_SIZE; px++) {
              const color = this.textures.getPixel(srcX + px, srcY + py, 'tilemap');
              if (color && color.alpha > 0) {
                gfx.fillStyle(color.color, color.alpha / 255);
                gfx.fillRect(dx * TILE_SIZE * scale + px * scale, dy * TILE_SIZE * scale + py * scale, scale, scale);
              }
            }
          }
          gfx.restore();
        }
      }

      gfx.generateTexture(key, outputSize, outputSize);
    }

    gfx.destroy();

    this.scene.start('MenuScene');
  }
}
