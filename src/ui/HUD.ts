import * as Phaser from 'phaser';
import type { Resources } from '../types';

export default class HUD {
  private scene: Phaser.Scene;
  private woodText!: Phaser.GameObjects.Text;
  private stoneText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private container!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create(): void {
    this.container = this.scene.add.container(0, 0).setDepth(200).setScrollFactor(0);

    const bg = this.scene.add
      .rectangle(0, 0, 400, 50, 0x000000, 0.6)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xffffff, 0.3);
    this.container.add(bg);

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Fredoka One, sans-serif',
    };

    this.woodText = this.scene.add.text(16, 13, '', textStyle);
    this.stoneText = this.scene.add.text(140, 13, '', textStyle);
    this.coinsText = this.scene.add.text(270, 13, '', textStyle);

    this.container.add(this.woodText);
    this.container.add(this.stoneText);
    this.container.add(this.coinsText);
  }

  updateResources(resources: Resources): void {
    this.woodText.setText(`Holz: ${resources.wood}`);
    this.stoneText.setText(`Steine: ${resources.stone}`);
    this.coinsText.setText(`Muenzen: ${resources.coins}`);
  }

  destroy(): void {
    this.container.destroy();
  }
}
