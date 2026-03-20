import * as Phaser from 'phaser';

export default class Toast {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private activeToasts: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0).setDepth(300).setScrollFactor(0);
  }

  show(message: string): void {
    const { width } = this.scene.cameras.main;

    const toast = this.scene.add.container(width / 2, 100 + this.activeToasts.length * 40);

    const bg = this.scene.add.rectangle(0, 0, 200, 32, 0x000000, 0.8).setStrokeStyle(1, 0xffffff, 0.4);
    toast.add(bg);

    const text = this.scene.add
      .text(0, 0, message, {
        fontSize: '16px',
        color: '#4caf50',
        fontFamily: 'Fredoka One, sans-serif',
      })
      .setOrigin(0.5);
    toast.add(text);

    bg.setSize(Math.max(text.width + 24, 120), 32);

    this.container.add(toast);
    this.activeToasts.push(toast);

    this.scene.tweens.add({
      targets: toast,
      y: toast.y - 20,
      alpha: 0,
      duration: 2000,
      delay: 800,
      ease: 'Power2',
      onComplete: () => {
        const idx = this.activeToasts.indexOf(toast);
        if (idx !== -1) this.activeToasts.splice(idx, 1);
        toast.destroy();
      },
    });
  }

  destroy(): void {
    this.activeToasts.forEach((t) => t.destroy());
    this.activeToasts = [];
    this.container.destroy();
  }
}
