import { EventBus, BaseState } from "@core/index";
import { GardenStateType } from "../types";

import { GardenScene } from "../view/scene/GardenScene";
import { LightingManager } from "../view/scene/LightingManager";
import { CameraController } from "../view/scene/CameraController";

export class LevelAnimalState extends BaseState {
  private lightingManager: LightingManager;
  private cameraController: CameraController;
  private eventBus: EventBus;

  constructor(
    _gardenScene: GardenScene,
    lightingManager: LightingManager,
    cameraController: CameraController,
    eventBus: EventBus
  ) {
    super(GardenStateType.LEVEL_ANIMAL);
    this.lightingManager = lightingManager;
    this.cameraController = cameraController;
    this.eventBus = eventBus;
  }

  async enter(): Promise<void> {
    this.lightingManager.setMorningMode();
    await this.cameraController.setBarnView();

    this.eventBus.dispatch("ui:show-level", 1);
    this.eventBus.dispatch("tutorial:on");
  }

  update(_deltaTime: number): void {}

  exit(): void {
    this.eventBus.dispatch("ui:hide-level");
    this.eventBus.dispatch("tutorial:off");
  }
}
