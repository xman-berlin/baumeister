import * as Phaser from 'phaser';
import { GRID_COLS, TILE_SIZE } from '../config';
import type { Mission } from '../types';

export default class MissionPanel {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private titleText: Phaser.GameObjects.Text;
  private descText: Phaser.GameObjects.Text;
  private progressText: Phaser.GameObjects.Text;
  private progressBarBg: Phaser.GameObjects.Rectangle;
  private progressBarFill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const panelWidth = 220;
    const panelHeight = 90;
    const x = GRID_COLS * TILE_SIZE - panelWidth / 2 - 10;
    const y = panelHeight / 2 + 10;

    this.container = this.scene.add.container(x, y).setDepth(200).setScrollFactor(0);

    const bg = this.scene.add
      .rectangle(0, 0, panelWidth, panelHeight, 0x000000, 0.7)
      .setStrokeStyle(1, 0xffffff, 0.3);
    this.container.add(bg);

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '16px',
      color: '#ffcc00',
      fontFamily: 'Fredoka One, sans-serif',
    };

    const descStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '13px',
      color: '#cccccc',
      fontFamily: 'sans-serif',
    };

    const progressStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
    };

    this.titleText = this.scene.add.text(-panelWidth / 2 + 10, -panelHeight / 2 + 8, 'Mission', titleStyle);
    this.container.add(this.titleText);

    this.descText = this.scene.add.text(-panelWidth / 2 + 10, -panelHeight / 2 + 28, '', descStyle);
    this.container.add(this.descText);

    this.progressBarBg = this.scene.add
      .rectangle(-panelWidth / 2 + 10, -panelHeight / 2 + 52, panelWidth - 20, 14, 0x333333)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x555555);
    this.container.add(this.progressBarBg);

    this.progressBarFill = this.scene.add
      .rectangle(-panelWidth / 2 + 11, -panelHeight / 2 + 53, 0, 12, 0x4caf50)
      .setOrigin(0, 0);
    this.container.add(this.progressBarFill);

    this.progressText = this.scene.add.text(0, -panelHeight / 2 + 53, '0/0', progressStyle).setOrigin(0.5, 0);
    this.container.add(this.progressText);
  }

  updateMission(mission: Mission | null, progress: number, goal: number): void {
    if (!mission) {
      this.titleText.setText('Alle Missionen erledigt!');
      this.descText.setText('Glueckwunsch!');
      this.progressBarFill.setSize(0, 12);
      this.progressText.setText('');
      return;
    }

    this.titleText.setText(mission.title);
    this.descText.setText(mission.description);

    const barWidth = 198;
    const ratio = goal > 0 ? Math.min(progress / goal, 1) : 0;
    this.progressBarFill.setSize(barWidth * ratio, 12);
    this.progressText.setText(`${Math.min(progress, goal)}/${goal}`);
  }

  destroy(): void {
    this.container.destroy();
  }
}
