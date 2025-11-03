import { PerspectiveCamera, Vector3 } from "three";

import type { App } from "@app";
import { BaseGame } from "@core/index";
import { PlacedItem, GardenStateType } from "./types";

import { GardenModel } from "./model/GardenModel";
import { GardenController } from "./controller/GardenController";
import { GardenUIManager } from "./view/ui/GardenUIManager";
import { GardenScene } from "./view/scene/GardenScene";
import { LightingManager } from "./view/scene/LightingManager";
import { CameraController } from "./view/scene/CameraController";
import { GardenItemFactory } from "./factory/GardenItemFactory";

import { LoadingState } from "./states/LoadingState";
import { LevelAnimalState } from "./states/LevelAnimalState";
import { LevelFenceState } from "./states/LevelFenceState";
import { LevelGardenState } from "./states/LevelGardenState";
import { WinState } from "./states/WinState";
import { AnimateSpawn, AnimateRemove } from "./view/scene/AnimationManager";

export class GardenGame extends BaseGame {
  private model!: GardenModel;
  private controller!: GardenController;
  private uiManager!: GardenUIManager;
  private sceneManager!: GardenScene;
  private lightingManager!: LightingManager;
  private cameraController!: CameraController;
  private itemFactory!: GardenItemFactory;
  private camera: PerspectiveCamera;

  constructor(app: App) {
    super(app);
    this.camera = app.getThreeCamera();
  }

  init(): void {
    this.setupStates();
    this.setupEventListeners();
  }

  async setupGameSystems(): Promise<void> {
    this.model = new GardenModel();
    this.controller = new GardenController(this.app, this.model);

    this.uiManager = new GardenUIManager(this.app);
    this.uiManager.init();

    this.sceneManager = new GardenScene(this.app);
    this.sceneManager.init();

    this.threeScene.add(this.sceneManager.getScene());

    this.lightingManager = new LightingManager(this.app, this.threeScene);
    this.lightingManager.init();
    this.lightingManager.setSkybox(this.sceneManager.getSkybox());

    this.cameraController = new CameraController(this.app);
    this.cameraController.setIsometricView();

    this.itemFactory = new GardenItemFactory(this.app);

    this.app.resize();
  }

  private setupStates(): void {
    this.stateMachine.addState(
      new LoadingState(
        this.stateMachine,
        this.assetLoader,
        this.audioManager,
        this.pixiStage,
        this
      )
    );
  }

  addLevelStates(): void {
    this.stateMachine.addState(
      new LevelAnimalState(
        this.sceneManager,
        this.lightingManager,
        this.cameraController,
        this.eventBus
      )
    );
    this.stateMachine.addState(
      new LevelFenceState(
        this.sceneManager,
        this.lightingManager,
        this.cameraController,
        this.eventBus
      )
    );
    this.stateMachine.addState(
      new LevelGardenState(
        this.sceneManager,
        this.lightingManager,
        this.cameraController,
        this.eventBus,
        this.stateMachine
      )
    );
    this.stateMachine.addState(
      new WinState(this.uiManager, this.cameraController, this.lightingManager)
    );
  }

  private setupEventListeners(): void {
    this.eventBus.add("model:item-added", this.onItemAdded.bind(this));
    this.eventBus.add("model:item-removed", this.onItemRemoved.bind(this));
    this.eventBus.add("model:level-changed", this.onLevelChanged.bind(this));
    this.eventBus.add("game:restart", this.onGameRestart.bind(this));

    window.addEventListener("keydown", (e) => {
      if (e.key === "o" || e.key === "O") {
        if (this.cameraController) {
          this.cameraController.toggleOrbitControls();
        }
      }
    });
  }

  private async onItemAdded(placedItem: PlacedItem): Promise<void> {
    const object3D = this.itemFactory.createThreeComponent(placedItem.config);

    const position = new Vector3(
      placedItem.position.x,
      -placedItem.position.y,
      placedItem.position.z
    );

    this.sceneManager.addItem(
      placedItem.id,
      object3D,
      position,
      placedItem.rotation
    );

    if (object3D.userData.mixer)
      this.itemFactory.registerMixer(placedItem.id, object3D.userData.mixer);

    await AnimateSpawn(object3D, position, this.app);
  }

  private async onItemRemoved(itemId: string): Promise<void> {
    const object3D = this.sceneManager.getItem(itemId);
    if (!object3D) return;

    await AnimateRemove(object3D);

    this.itemFactory.removeMixer(itemId);
    this.sceneManager.removeItem(itemId);
  }

  private onLevelChanged(level: number): void {
    let stateType: GardenStateType;
    switch (level) {
      case 1:
        stateType = GardenStateType.LEVEL_ANIMAL;
        break;
      case 2:
        stateType = GardenStateType.LEVEL_FENCE;
        break;
      case 3:
        stateType = GardenStateType.LEVEL_GARDEN;
        break;
      default:
        return;
    }

    const audio = this.app.getAudioManager();
    if (audio) {
      audio.playSound("level", 1);
    }

    this.stateMachine.changeState(stateType);
  }

  private onGameRestart(): void {
    this.sceneManager.clearItems();
    this.stateMachine.changeState(GardenStateType.LEVEL_ANIMAL);
  }

  getApp(): App {
    return this.app;
  }

  start(): void {
    this.stateMachine.changeState("LOADING");
  }

  update(deltaTime: number): void {
    this.stateMachine.update(deltaTime);
    if (this.cameraController) {
      this.cameraController.update(deltaTime);
    }
    if (this.sceneManager) {
      this.sceneManager.update(deltaTime);
    }
    if (this.itemFactory) {
      this.itemFactory.updateAnimations(deltaTime);
    }
  }

  dispose(): void {
    this.eventBus.removeAll("model:item-added");
    this.eventBus.removeAll("model:item-removed");

    this.controller?.dispose();
    this.uiManager?.dispose();
    this.sceneManager?.dispose();
    this.itemFactory?.dispose();
  }
}
