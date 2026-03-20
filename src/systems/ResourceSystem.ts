import * as Phaser from 'phaser';
import { BUILDINGS, STARTING_RESOURCES } from '../config';
import { BuildingType, type Resources } from '../types';
import type Toast from '../ui/Toast';

type ResourceChangeCallback = (resources: Resources) => void;

export default class ResourceSystem {
  private scene: Phaser.Scene;
  private resources: Resources;
  private timers: Phaser.Time.TimerEvent[] = [];
  private onChange: ResourceChangeCallback | null = null;
  private toast: Toast | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.resources = { ...STARTING_RESOURCES };
  }

  setOnChange(callback: ResourceChangeCallback): void {
    this.onChange = callback;
  }

  setToast(toast: Toast): void {
    this.toast = toast;
  }

  add(amount: Partial<Resources>): void {
    this.resources.wood += amount.wood ?? 0;
    this.resources.stone += amount.stone ?? 0;
    this.resources.coins += amount.coins ?? 0;
    this.notifyChange();
  }

  canAfford(cost: Partial<Resources>): boolean {
    return (
      this.resources.wood >= (cost.wood ?? 0) &&
      this.resources.stone >= (cost.stone ?? 0) &&
      this.resources.coins >= (cost.coins ?? 0)
    );
  }

  spend(cost: Partial<Resources>): boolean {
    if (!this.canAfford(cost)) return false;
    this.resources.wood -= cost.wood ?? 0;
    this.resources.stone -= cost.stone ?? 0;
    this.resources.coins -= cost.coins ?? 0;
    this.notifyChange();
    return true;
  }

  getResources(): Resources {
    return { ...this.resources };
  }

  startProduction(buildingType: BuildingType): void {
    const config = BUILDINGS[buildingType];
    if (!config.productionInterval || Object.keys(config.production).length === 0) return;

    const timer = this.scene.time.addEvent({
      delay: config.productionInterval,
      loop: true,
      callback: () => {
        this.add(config.production);

        if (this.toast) {
          const parts: string[] = [];
          if (config.production.wood) parts.push(`+${config.production.wood} Holz`);
          if (config.production.stone) parts.push(`+${config.production.stone} Steine`);
          if (config.production.coins) parts.push(`+${config.production.coins} Muenzen`);
          this.toast.show(parts.join(', '));
        }
      },
    });

    this.timers.push(timer);
  }

  stopAllTimers(): void {
    this.timers.forEach((t) => t.destroy());
    this.timers = [];
  }

  private notifyChange(): void {
    if (this.onChange) {
      this.onChange(this.getResources());
    }
  }
}
