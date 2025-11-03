import { EventBus, BaseState } from "@core/index";
import { GardenStateType } from "../types";

import { GardenScene } from "../view/scene/GardenScene";
import { LightingManager } from "../view/scene/LightingManager";
import { CameraController } from "../view/scene/CameraController";
import { StateMachine } from "@core/statemachine";

export class LevelGardenState extends BaseState {
  private elapsedTime: number = 0;
  private lightingManager: LightingManager;
  private cameraController: CameraController;
  private eventBus: EventBus;
  private stateMachine: StateMachine;

  constructor(
    _gardenScene: GardenScene,
    lightingManager: LightingManager,
    cameraController: CameraController,
    eventBus: EventBus,
    stateMachine: StateMachine
  ) {
    super(GardenStateType.LEVEL_GARDEN);
    this.lightingManager = lightingManager;
    this.cameraController = cameraController;
    this.eventBus = eventBus;
    this.stateMachine = stateMachine;
  }

  async enter(): Promise<void> {
    this.elapsedTime = 0;

    this.lightingManager.setEveningMode();
    await this.cameraController.setGardenView();
    this.setupEvents();
    this.eventBus.dispatch("ui:show-level", 3);
    this.eventBus.dispatch("tutorial:on");
  }

  private setupEvents(): void {
    this.eventBus.add("game:complete", this.onGameComplete.bind(this));
  }

  private onGameComplete(): void {
    this.eventBus.dispatch("ui:hide-level");
    this.stateMachine.changeState(GardenStateType.WIN);
  }

  update(deltaTime: number): void {
    this.elapsedTime += deltaTime;
  }

  exit(): void {
    this.eventBus.removeAll("game:complete");
    this.eventBus.dispatch("tutorial:off");
  }
}
