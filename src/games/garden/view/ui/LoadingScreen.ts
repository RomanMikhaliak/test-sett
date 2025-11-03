import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";

import type { App } from "@app";
import { EventBus, ProgressBar } from "@core/index";
import { UIPositionHelper } from "@utils/index";
import { GARDEN_CONFIG } from "../../config";

export class LoadingScreen extends Container {
  private app?: App;
  private eventBus?: EventBus;
  private onStartCallback?: () => void;

  private _width: number;
  private _height: number;

  private background!: Graphics;
  private progressBar!: ProgressBar;
  private titleText!: Text;
  private loadingText!: Text;
  private percentText!: Text;
  private startButton!: Container;
  private startButtonBG: Graphics | undefined;

  constructor(app?: App) {
    super();

    this.app = app;
    this.eventBus = app?.getEventBus();

    const config = GARDEN_CONFIG.garden.loading;
    this._width = config.props["landscape"].width;
    this._height = config.props["landscape"].height;

    this.init();
    this.setEvents();
    this.layout();
  }

  private init(): void {
    const config = GARDEN_CONFIG.garden.loading;

    this.createBackground(config);
    this.createTitle();
    this.createLoadingText();
    this.createPercentText();
    this.createProgressBar(config);
    this.createStartButton();

    this.updateProgress(0);
  }

  private createBackground(config: any): void {
    this.background = new Graphics();
    this.background
      .rect(-this._width / 2, -this._height / 2, this._width, this._height)
      .fill(config.backgroundColor);
  }

  private createTitle(): void {
    this.titleText = new Text({
      text: "🌷 GARDEN MAKEOVER 🐮",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: 68,
        fill: 0xffffff,
        stroke: { color: 0x4c6d23, width: 3 },
        letterSpacing: 1,
        dropShadow: {
          alpha: 0.5,
          angle: Math.PI / 2,
          blur: 6,
          color: 0x4c6d23,
          distance: 2,
        },
      },
    });
    this.titleText.anchor.set(0.5);
  }

  private createLoadingText(): void {
    this.loadingText = new Text({
      text: "🌱 Planting your garden...",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: 26,
        fill: 0xe8f5e9,
        letterSpacing: 0.5,
        dropShadow: {
          alpha: 0.4,
          blur: 3,
          color: 0x1b5e20,
          distance: 2,
        },
      },
    });
    this.loadingText.anchor.set(0.5);
  }

  private createPercentText(): void {
    this.percentText = new Text({
      text: "0%",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: 22,
        fontWeight: "bold",
        fill: 0x000000,
        letterSpacing: 0.5,
      },
    });
    this.percentText.anchor.set(0.5);
  }

  private createProgressBar(config: any): void {
    this.progressBar = new ProgressBar(
      config.progressBarWidth,
      config.progressBarHeight,
      config.backgroundColor,
      config.foregroundColor
    );
    this.progressBar.pivot.set(
      this.progressBar.width / 2,
      this.progressBar.height / 2
    );
  }

  private createStartButton(): void {
    const buttonWidth = 350;
    const buttonHeight = 80;

    this.startButton = new Container();
    this.startButton.eventMode = "static";
    this.startButton.cursor = "pointer";
    this.startButton.alpha = 0;

    this.startButtonBG = new Graphics();
    this.startButtonBG.roundRect(0, 0, buttonWidth, buttonHeight, 20);
    this.startButtonBG.fill({ color: 0x2f2727, alpha: 0.5 });
    this.startButtonBG.stroke({
      color: 0x501e00,
      width: 4,
      alpha: 0.6,
      alignment: 0.5,
    });
    this.startButton.addChild(this.startButtonBG);

    const buttonText = new Text({
      text: "START",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: 35,
        fill: 0xffffff,
        fontWeight: "bold",
        letterSpacing: 0.5,
        dropShadow: {
          alpha: 0.5,
          blur: 2,
          color: 0x2e7d32,
          distance: 2,
        },
      },
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(buttonWidth / 2, buttonHeight / 2);
    this.startButton.addChild(buttonText);

    this.startButton.pivot.set(
      this.startButton.width / 2,
      this.startButton.height / 2
    );
  }

  private setEvents(): void {
    this.eventBus?.add("resize", this.handleResize.bind(this));

    this.startButton.on("pointerover", this.handleButtonOver.bind(this));
    this.startButton.on("pointerout", this.handleButtonOut.bind(this));
    this.startButton.on("pointerdown", this.handleButtonClick.bind(this));
  }

  private handleButtonOver(): void {
    this.startButtonBG!.tint = 0xddffdd;
  }

  private handleButtonOut(): void {
    gsap.to(this.startButton.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)",
    });
    this.startButtonBG!.tint = 0xffffff;
  }

  private handleButtonClick(): void {
    gsap.to(this.startButton.scale, {
      x: 0.95,
      y: 0.95,
      duration: 0.2,
      ease: "elastic.out(1, 0.5)",
    });
    this.app?.getAudioManager().playSound("click");
    this.onStartCallback?.();
  }

  private layout(): void {
    this.addChild(this.background);
    this.addChild(this.titleText);
    this.addChild(this.progressBar);
    this.addChild(this.loadingText);
    this.addChild(this.percentText);
    this.addChild(this.startButton);

    this.updateOrientation("landscape", this._width, this._height);
  }

  private handleResize(data: { width: number; height: number }): void {
    const { width, height } = data;
    const orientation = UIPositionHelper.getOrientation(width, height);
    this.updateOrientation(orientation, width, height);
  }

  updateOrientation(
    orientation: "landscape" | "portrait",
    containerWidth: number,
    containerHeight: number
  ): void {
    const config = GARDEN_CONFIG.garden.loading;
    const posConfig =
      orientation === "landscape" ? config.landscape : config.portrait;

    this._width = containerWidth;
    this._height = containerHeight;

    this.background
      .clear()
      .rect(
        -containerWidth / 2,
        -containerHeight / 2,
        containerWidth,
        containerHeight
      )
      .fill(config.backgroundColor);
    const backgroundPos = UIPositionHelper.calculatePosition(
      posConfig.background,
      containerWidth,
      containerHeight,
      this.background.width,
      this.background.height
    );
    this.background.scale.set(5);
    this.background.position.set(backgroundPos.x, backgroundPos.y);

    const titlePos = UIPositionHelper.calculatePosition(
      posConfig.title,
      containerWidth,
      containerHeight,
      this.titleText.width,
      this.titleText.height
    );
    this.titleText.position.set(titlePos.x, titlePos.y);

    const progressPos = UIPositionHelper.calculatePosition(
      posConfig.progressBar,
      containerWidth,
      containerHeight,
      config.progressBarWidth,
      config.progressBarHeight
    );
    this.progressBar.position.set(progressPos.x, progressPos.y);

    const loadingPos = UIPositionHelper.calculatePosition(
      posConfig.loadingText,
      containerWidth,
      containerHeight,
      this.loadingText.width,
      this.loadingText.height
    );
    this.loadingText.position.set(loadingPos.x, loadingPos.y);

    const percentPos = UIPositionHelper.calculatePosition(
      posConfig.percentText,
      containerWidth,
      containerHeight,
      this.percentText.width,
      this.percentText.height
    );
    this.percentText.position.set(percentPos.x, percentPos.y);

    const buttonWidth = 320;
    const buttonHeight = 75;
    const startButtonPos = UIPositionHelper.calculatePosition(
      posConfig.startButton,
      containerWidth,
      containerHeight,
      buttonWidth,
      buttonHeight
    );
    this.startButton.position.set(startButtonPos.x, startButtonPos.y);
  }

  updateProgress(progress: number): void {
    const percent = Math.round(progress * 100);
    this.progressBar.setProgress(progress);
    this.percentText.text = `${percent}%`;

    const messages = [
      "🌱 Planting seeds...",
      "🌿 Watering plants...",
      "🌻 Growing flowers...",
      "🌳 Planting trees...",
      "🦋 Attracting butterflies...",
      "🌸 Garden blooming...",
    ];
    const messageIndex = Math.min(
      Math.floor(progress * messages.length),
      messages.length - 1
    );
    this.loadingText.text = messages[messageIndex];

    if (progress >= 1 && this.startButton.alpha === 0) this.showStartButton();
  }

  private showStartButton(): void {
    gsap.to(this.loadingText, { alpha: 0, duration: 0.3 });
    gsap.to(this.percentText, { alpha: 0, duration: 0.3 });
    gsap.to(this.progressBar, { alpha: 0, duration: 0.3 });
    gsap.to(this.startButton, { alpha: 1, duration: 0.5, ease: "power2.out" });
  }

  setOnStartCallback(callback: () => void): void {
    this.onStartCallback = callback;
  }

  show(): void {
    this.visible = true;
    this.alpha = 0;
    gsap.to(this, { alpha: 1, duration: 0.5, ease: "power2.out" });
  }

  hide(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this, {
        alpha: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          this.visible = false;
          resolve();
        },
      });
    });
  }
}
