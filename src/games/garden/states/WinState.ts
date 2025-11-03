import { BaseState } from "@core/index";
import { GardenStateType } from "../types";

import { GardenUIManager } from "../view/ui/GardenUIManager";
import { CameraController } from "../view/scene/CameraController";
import { LightingManager } from "../view/scene/LightingManager";

export class WinState extends BaseState {
  private elapsedTime: number = 0;
  private uiManager: GardenUIManager;
  private cameraController: CameraController;
  private lightingManager: LightingManager;

  constructor(
    uiManager: GardenUIManager,
    cameraController: CameraController,
    lightingManager: LightingManager
  ) {
    super(GardenStateType.WIN);
    this.uiManager = uiManager;
    this.cameraController = cameraController;
    this.lightingManager = lightingManager;

    this.uiManager
      .getEventBus()
      .add("lighting:toggle", this.onToggleLighting.bind(this));
  }

  private onToggleLighting(): void {
    this.lightingManager.toggleDayNight();
  }

  async enter(): Promise<void> {
    this.elapsedTime = 0;

    this.lightingManager.setNightMode();
    await this.cameraController.animateToBirdView();

    this.cameraController.startContinuousRotation(30, 20, 20, 0);

    this.uiManager
      .getWinScreen()
      .setLightingMode(this.lightingManager.getCurrentMode());

    this.uiManager.getWinScreen().show();
    this.uiManager.getEventBus().dispatch("tutorial:off");
  }

  update(deltaTime: number): void {
    this.elapsedTime += deltaTime;
  }

  exit(): void {
    this.cameraController.stopContinuousRotation();
    this.uiManager.getWinScreen().hide();
  }
}
