import { WebGLRenderer, Container } from "pixi.js";
import { Scene } from "three";

import type { App } from "@app";

import { EventBus } from "./eventbus/EventBus";
import { StateMachine } from "./statemachine/StateMachine";
import { AssetLoader } from "./managers/AssetLoader";
import { AudioManager } from "./managers/AudioManager";

export abstract class BaseGame {
  protected app: App;
  protected pixiRenderer: WebGLRenderer;
  protected pixiStage: Container;
  protected threeScene: Scene;
  protected eventBus: EventBus;
  protected stateMachine: StateMachine;
  protected assetLoader: AssetLoader;
  protected audioManager: AudioManager;

  constructor(app: App) {
    this.app = app;
    this.pixiRenderer = app.getPixiRenderer();
    this.pixiStage = app.getPixiStage();
    this.threeScene = app.getThreeScene();
    this.eventBus = app.getEventBus();
    this.assetLoader = app.getAssetLoader();
    this.audioManager = app.getAudioManager();
    this.stateMachine = new StateMachine(this.eventBus);
  }

  abstract init(): void;
  abstract start(): void;
  abstract update(deltaTime: number): void;
  abstract dispose(): void;
}
