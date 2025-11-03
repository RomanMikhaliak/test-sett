import { WebGLRenderer, Scene, PerspectiveCamera } from "three";
import { Stats } from "pixi-stats";

import { EventBus, BaseGame, AssetLoader, AudioManager } from "@core/index";
import { ThreeRenderer, PixiRenderer } from "@core/render/index";
import { PaneUtils, setupFPSMonitor } from "@utils/index";
import { CONFIG } from "@config";

import gsap from "gsap";

export class App {
  private width: number;
  private height: number;
  private renderInfo!: {
    width: number;
    height: number;
    scale: number;
    orientation: string;
  };

  private threeRenderer!: ThreeRenderer;
  private pixiRenderer!: PixiRenderer;
  private eventBus!: EventBus;
  private assetLoader!: AssetLoader;
  private audioManager!: AudioManager;
  private stats: Stats | null = null;
  private statsToggleHandler: ((e: KeyboardEvent) => void) | null = null;

  private currentGame: BaseGame | null = null;

  public pane = PaneUtils;

  public orientation: "landscape" | "portrait" = "landscape";

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  async init(): Promise<void> {
    this.setupThree();
    await this.setupPixi();
    this.setupCore();
    this.setupEventListeners();

    if (CONFIG.debug.enableTweakpane) {
      PaneUtils.createPane({
        title: CONFIG.game.name,
        expanded: true,
      });
      PaneUtils.setupCameraControls(this.threeRenderer.getCamera());
      PaneUtils.setupKeyboardToggle("p");
    }

    if (CONFIG.debug.fps) {
      const { stats, handler } = setupFPSMonitor(
        Stats,
        this.pixiRenderer.getRenderer()
      );
      this.stats = stats;
      this.statsToggleHandler = handler;
    }

    this.startGameLoop();
  }

  private setupThree(): void {
    this.threeRenderer = new ThreeRenderer(this.width, this.height);
    this.threeRenderer.init();
  }

  private async setupPixi(): Promise<void> {
    this.pixiRenderer = new PixiRenderer(this.width, this.height);
    await this.pixiRenderer.init(this.threeRenderer.getRenderer());
  }

  private setupCore(): void {
    this.eventBus = EventBus.getInstance();
    this.assetLoader = new AssetLoader();
    this.audioManager = new AudioManager();
    this.renderInfo = {
      width: this.width,
      height: this.height,
      scale: 1,
      orientation: this.orientation,
    };
  }

  setGame(game: BaseGame): void {
    this.currentGame = game;
  }

  getPixiRenderer() {
    return this.pixiRenderer.getRenderer();
  }

  getRenderInfo(): typeof this.renderInfo {
    return this.renderInfo;
  }

  getPixiStage() {
    return this.pixiRenderer.getStage();
  }

  getThreeScene(): Scene {
    return this.threeRenderer.getScene();
  }

  getThreeCamera(): PerspectiveCamera {
    return this.threeRenderer.getCamera();
  }

  getThreeRenderer(): WebGLRenderer {
    return this.threeRenderer.getRenderer();
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }

  getAssetLoader(): AssetLoader {
    return this.assetLoader;
  }

  getAudioManager(): AudioManager {
    return this.audioManager;
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("orientationchange", () =>
      gsap.delayedCall(0.2, () => this.onResize())
    );
  }

  public resize() {
    this.onResize();
  }

  private onResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.threeRenderer.resize(this.width, this.height);
    this.pixiRenderer.resize(this.width, this.height);

    const orientation = this.width > this.height ? "landscape" : "portrait";
    const baseDimensions = CONFIG.game.screen[orientation];
    this.orientation = orientation;

    const scaleX = this.width / baseDimensions.width;
    const scaleY = this.height / baseDimensions.height;
    const scale = Math.min(scaleX, scaleY);

    this.pixiRenderer.updateStageLayout(
      this.width,
      this.height,
      baseDimensions,
      scale
    );

    this.renderInfo = {
      width: this.width,
      height: this.height,
      scale: scale,
      orientation: this.orientation,
    };

    this.eventBus.dispatch("resize", {
      width: this.width,
      height: this.height,
      orientation,
    });
  }

  private startGameLoop(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private gameLoop(): void {
    const deltaTime = 1 / CONFIG.game.targetFPS;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number): void {
    this.currentGame?.update(deltaTime);
  }

  private render(): void {
    this.threeRenderer.render();
    this.pixiRenderer.render();
  }

  dispose(): void {
    this.eventBus.removeAll();
    window.removeEventListener("resize", this.onResize.bind(this));

    if (this.statsToggleHandler) {
      window.removeEventListener("keydown", this.statsToggleHandler);
    }

    this.threeRenderer.dispose();
    this.pixiRenderer.dispose();
    PaneUtils.dispose();
  }
}
