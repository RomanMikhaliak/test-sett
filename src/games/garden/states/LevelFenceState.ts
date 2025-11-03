import { EventBus, BaseState } from "@core/index";
import { GardenStateType } from "../types";

import { GardenScene } from "../view/scene/GardenScene";
import { LightingManager } from "../view/scene/LightingManager";
import { CameraController } from "../view/scene/CameraController";

export class LevelFenceState extends BaseState {
  private lightingManager: LightingManager;
  private cameraController: CameraController;
  private eventBus: EventBus;

  constructor(
    _gardenScene: GardenScene,
    lightingManager: LightingManager,
    cameraController: CameraController,
    eventBus: EventBus
  ) {
    super(GardenStateType.LEVEL_FENCE);
    this.lightingManager = lightingManager;
    this.cameraController = cameraController;
    this.eventBus = eventBus;
  }

  async enter(): Promise<void> {
    this.lightingManager.setDayMode();
    await this.cameraController.setUpgradeView();
    this.eventBus.dispatch("ui:show-level", 2);
    this.eventBus.dispatch("tutorial:on");
  }

  update(_deltaTime: number): void {}

  exit(): void {
    this.eventBus.dispatch("ui:hide-level");
    this.eventBus.dispatch("tutorial:off");
  }
}
