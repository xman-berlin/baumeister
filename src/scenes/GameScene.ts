import * as Phaser from 'phaser';
import GridSystem from '../systems/GridSystem';
import BuildingSystem from '../systems/BuildingSystem';
import ResourceSystem from '../systems/ResourceSystem';
import NPCSystem from '../systems/NPCSystem';
import MissionSystem from '../systems/MissionSystem';
import SaveSystem from '../systems/SaveSystem';
import HUD from '../ui/HUD';
import BuildMenu from '../ui/BuildMenu';
import Toast from '../ui/Toast';
import MissionPanel from '../ui/MissionPanel';
import { BuildingType } from '../types';
import { AUTO_SAVE_INTERVAL } from '../config';

export default class GameScene extends Phaser.Scene {
  private gridSystem!: GridSystem;
  private buildingSystem!: BuildingSystem;
  private resourceSystem!: ResourceSystem;
  private npcSystem!: NPCSystem;
  private missionSystem!: MissionSystem;
  private saveSystem!: SaveSystem;
  private hud!: HUD;
  private toast!: Toast;
  private missionPanel!: MissionPanel;
  private autoSaveTimer!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { loadSave?: boolean }): void {
    this.registry.set('loadSave', data.loadSave ?? false);
  }

  create(): void {
    this.gridSystem = new GridSystem(this);
    this.gridSystem.renderGrid();

    this.resourceSystem = new ResourceSystem(this);
    this.toast = new Toast(this);
    this.resourceSystem.setToast(this.toast);

    this.npcSystem = new NPCSystem(this, this.gridSystem);
    this.buildingSystem = new BuildingSystem(this, this.gridSystem, this.resourceSystem);

    this.missionSystem = new MissionSystem(this, this.gridSystem, this.resourceSystem, this.npcSystem);
    this.saveSystem = new SaveSystem(this.gridSystem, this.resourceSystem, this.npcSystem, this.missionSystem);

    this.missionPanel = new MissionPanel(this);
    this.updateMissionPanel();

    this.missionSystem.setOnComplete((mission) => {
      this.toast.show(`Mission erledigt: ${mission.title}!`);
      this.hud.updateResources(this.resourceSystem.getResources());
      this.updateMissionPanel();
    });

    this.hud = new HUD(this);
    this.hud.updateResources(this.resourceSystem.getResources());

    this.resourceSystem.setOnChange((resources) => {
      this.hud.updateResources(resources);
    });

    new BuildMenu(this, (type: BuildingType | null) => {
      this.buildingSystem.selectBuilding(type);
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.gridSystem.updateHover(pointer.worldX, pointer.worldY);
      this.buildingSystem.updatePreview(pointer.worldX, pointer.worldY);
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        this.handleRightClick(pointer);
        return;
      }
      this.handleClick(pointer);
    });

    this.input.mouse?.disableContextMenu();

    this.autoSaveTimer = this.time.addEvent({
      delay: AUTO_SAVE_INTERVAL,
      loop: true,
      callback: () => this.saveSystem.save(),
    });

    this.saveSystem.startPlaytimeTracking();

    window.addEventListener('beforeunload', () => {
      this.saveSystem.save();
    });

    if (this.registry.get('loadSave')) {
      this.loadGame();
    }

    (window as unknown as { __scene: GameScene }).__scene = this;
  }

  private loadGame(): void {
    const data = SaveSystem.loadRaw();
    if (!data) return;

    this.resourceSystem.spend(this.resourceSystem.getResources());
    this.resourceSystem.add(data.resources);

    for (const [key, type] of Object.entries(data.grid)) {
      const parts = key.split(',');
      const col = parseInt(parts[0] ?? '0', 10);
      const row = parseInt(parts[1] ?? '0', 10);
      this.gridSystem.placeBuilding(col, row, type);
      this.resourceSystem.startProduction(type);
    }

    this.missionSystem.loadState(data.missions);

    if (data.npcs && data.npcs.length > 0) {
      this.npcSystem.loadNPCs(data.npcs);
    }

    this.hud.updateResources(this.resourceSystem.getResources());
    this.updateMissionPanel();
    this.toast.show('Spielstand geladen!');
  }

  private handleClick(pointer: Phaser.Input.Pointer): void {
    const { col, row } = this.gridSystem.getTilePosition(pointer.worldX, pointer.worldY);
    if (!this.gridSystem.isWithinBounds(col, row)) return;

    const selectedType = this.buildingSystem.getSelectedBuilding();
    const placed = this.buildingSystem.place(col, row);
    if (placed) {
      this.toast.show('Gebaeude platziert!');
      this.playBuildAnimation(col, row);

      if (selectedType === BuildingType.House) {
        const npcId = this.npcSystem.spawn(col, row);
        if (npcId) {
          this.toast.show('Ein Bewohner ist angekommen!');
        }
      }

      if (selectedType === BuildingType.Road) {
        this.spawnNPCsForAdjacentHouses(col, row);
      }

      this.missionSystem.checkProgress();
      this.updateMissionPanel();
    }
  }

  private playBuildAnimation(col: number, row: number): void {
    const sprite = this.gridSystem.getSpriteAt(col, row);
    if (!sprite) return;

    this.tweens.add({
      targets: sprite,
      scaleX: 1.15,
      scaleY: 0.85,
      duration: 100,
      yoyo: true,
      repeat: 1,
      ease: 'Bounce',
    });
  }

  private spawnNPCsForAdjacentHouses(roadCol: number, roadRow: number): void {
    const directions = [
      { dc: -1, dr: 0 },
      { dc: 1, dr: 0 },
      { dc: 0, dr: -1 },
      { dc: 0, dr: 1 },
    ];
    for (const { dc, dr } of directions) {
      const c = roadCol + dc;
      const r = roadRow + dr;
      if (this.gridSystem.getBuildingType(c, r) === BuildingType.House) {
        const npcId = this.npcSystem.spawn(c, r);
        if (npcId) {
          this.toast.show('Ein Bewohner ist angekommen!');
        }
      }
    }
  }

  private handleRightClick(pointer: Phaser.Input.Pointer): void {
    const { col, row } = this.gridSystem.getTilePosition(pointer.worldX, pointer.worldY);
    if (!this.gridSystem.isWithinBounds(col, row)) return;

    const buildingType = this.gridSystem.getBuildingType(col, row);
    this.npcSystem.removeNearBuilding(col, row);
    const removed = this.buildingSystem.remove(col, row);
    if (removed) {
      this.toast.show('Gebaeude entfernt');
      if (buildingType === BuildingType.House) {
        this.toast.show('Bewohner verschwunden');
      }
    }
  }

  private updateMissionPanel(): void {
    const mission = this.missionSystem.getActiveMission();
    this.missionPanel.updateMission(mission, this.missionSystem.getProgress(), this.missionSystem.getGoal());
  }

  shutdown(): void {
    this.saveSystem.save();
    this.saveSystem.stopPlaytimeTracking();
    this.autoSaveTimer.destroy();
  }
}
