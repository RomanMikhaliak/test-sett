import { Container } from "pixi.js";
import gsap from "gsap";

import type { GardenGame } from "../GardenGame";
import { GardenStateType } from "../types";
import { StateMachine } from "@core/statemachine";
import { BaseState } from "@core/state/BaseState";
import { AssetLoader } from "@core/managers";
import { AudioManager } from "@core/managers";
import { LoadingScreen } from "../view/ui/LoadingScreen";
import { GARDEN_CONFIG } from "../config";

export class LoadingState extends BaseState {
  private game: GardenGame;
  private stateMachine: StateMachine;

  private audioManager: AudioManager;
  private assetLoader: AssetLoader;
  private assetsLoaded: boolean = false;

  private pixiStage: Container | null = null;
  private hasTransitioned: boolean = false;

  private loadingScreen: LoadingScreen | null = null;
  private loadingTime: number = 0;
  private readonly MIN_LOADING_DURATION = 1.0;

  constructor(
    stateMachine: StateMachine,
    assetLoader: AssetLoader,
    audioManager: AudioManager,
    pixiStage: Container | undefined,
    game: GardenGame
  ) {
    super(GardenStateType.LOADING);
    this.stateMachine = stateMachine;
    this.assetLoader = assetLoader;
    this.audioManager = audioManager;
    this.pixiStage = pixiStage ?? null;
    this.game = game;
  }

  async enter(): Promise<void> {
    this.loadingTime = 0;
    this.hasTransitioned = false;
    this.assetsLoaded = false;

    if (this.pixiStage) {
      this.loadingScreen = new LoadingScreen(this.game.getApp());
      this.pixiStage.addChild(this.loadingScreen);
      this.loadingScreen.show();
      this.game.getApp().resize();

      this.loadingScreen.setOnStartCallback(() => this.onStartButtonClicked());

      this.hideHTMLPreloader();
    }
    await this.loadAssets();
  }

  private hideHTMLPreloader(): void {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
      gsap.delayedCall(0.5, () => preloader.remove());
    }
  }

  private async loadAssets(): Promise<void> {
    try {
      const assetsConfig = GARDEN_CONFIG.assets;

      await this.assetLoader.loadAll({
        gltf: assetsConfig.gltf,
      });

      await this.assetLoader.loadFromConfig({
        images: assetsConfig.images,
        sounds: assetsConfig.sounds,
        music: assetsConfig.music,
      });

      await this.audioManager.init(this.assetLoader);

      this.assetsLoaded = true;

      await this.game.setupGameSystems();
      this.game.addLevelStates();
    } catch (error) {
      this.assetsLoaded = true;
    }
  }

  update(deltaTime: number): void {
    this.loadingTime += deltaTime;

    const assetProgress = this.assetLoader.getProgress();
    const timeProgress = Math.min(
      this.loadingTime / this.MIN_LOADING_DURATION,
      1
    );
    const progress = Math.min(assetProgress, timeProgress);

    if (this.loadingScreen) {
      this.loadingScreen.updateProgress(progress);
    }
  }

  private onStartButtonClicked(): void {
    if (this.hasTransitioned) return;

    this.audioManager.playMusic("theme");
    this.hasTransitioned = true;

    if (this.loadingScreen) {
      this.loadingScreen
        .hide()
        .then(() =>
          this.stateMachine.changeState(GardenStateType.LEVEL_ANIMAL)
        );
    } else {
      this.stateMachine.changeState(GardenStateType.LEVEL_ANIMAL);
    }
  }

  exit(): void {
    if (this.loadingScreen && this.pixiStage) {
      this.pixiStage.removeChild(this.loadingScreen);
      this.loadingScreen = null;
    }
  }
}
