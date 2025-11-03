import { Text, Ticker } from "pixi.js";

import type { App } from "@app";
import { BasePanel, ProgressBar } from "@core/index";
import { UIPositionHelper } from "@utils/index";
import { GARDEN_CONFIG } from "../../config";

export class HUD extends BasePanel {
  private app: App;
  private scoreText!: Text;
  private levelText!: Text;
  private progressBar!: ProgressBar;
  private progressText!: Text;

  constructor(app: App) {
    super();
    this.app = app;
    this.visible = false;
  }

  init(): void {
    this.createBackground();
    this.layout();
  }

  createBackground(): void {
    const config = GARDEN_CONFIG.garden.ui.hud;

    this.levelText = new Text({
      text: "Level 1",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: config.fontSize,
        fill: config.levelColor,
        fontWeight: "bold",
        dropShadow: {
          alpha: 0.8,
          angle: 45,
          blur: 4,
          distance: 2,
        },
      },
    });
    this.levelText.anchor.set(0.5);

    this.scoreText = new Text({
      text: "Score: 0",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: config.fontSize,
        fill: config.levelColor,
        fontWeight: "bold",
        dropShadow: {
          alpha: 0.8,
          angle: 45,
          blur: 4,
          distance: 2,
        },
      },
    });
    this.scoreText.anchor.set(0, 0.5);

    this.progressBar = new ProgressBar(700, 30);
    this.progressBar.setColors(0x6d7067, 0xdb7515);
    this.progressBar.pivot.set(350, 15);

    this.progressText = new Text({
      text: "0/3",
      style: {
        fontFamily: "Arial Rounded MT Bold",
        fontSize: 20,
        fill: 0x000000,
        fontWeight: "bold",
      },
    });
    this.progressText.anchor.set(0.5);
  }

  layout(): void {
    this.addChild(this.levelText);
    this.addChild(this.scoreText);
    this.addChild(this.progressBar);
    this.addChild(this.progressText);
  }

  updateScore(score: number): void {
    this.scoreText.text = `Score: ${score}`;
  }

  updateLevel(level: number): void {
    this.levelText.text = `Level ${level}`;
  }

  updateProgressBarColors(
    backgroundColor: number,
    foregroundColor: number
  ): void {
    this.progressBar.setColors(backgroundColor, foregroundColor);
  }

  updateProgress(current: number, goal: number): void {
    const progress = goal > 0 ? current / goal : 0;
    this.progressBar.setProgress(progress);
    this.progressText.text = `${current}/${goal}`;
  }

  async show(): Promise<void> {
    this.visible = true;
    this.alpha = 0;

    return new Promise((resolve) => {
      const ticker = Ticker.shared;
      const duration = 0.5;
      let elapsed = 0;

      const update = (delta: Ticker) => {
        elapsed += delta.deltaTime / 60;
        const t = Math.min(elapsed / duration, 1);
        this.alpha = t;

        if (t >= 1) {
          ticker.remove(update);
          resolve();
        }
      };
      ticker.add(update);
    });
  }

  async hide(): Promise<void> {
    return new Promise((resolve) => {
      const ticker = Ticker.shared;
      const duration = 0.3;
      let elapsed = 0;

      const update = (delta: Ticker) => {
        elapsed += delta.deltaTime / 60;
        const t = Math.min(elapsed / duration, 1);
        this.alpha = 1 - t;

        if (t >= 1) {
          ticker.remove(update);
          this.visible = false;
          resolve();
        }
      };

      ticker.add(update);
    });
  }

  updateOrientation(
    orientation: "landscape" | "portrait",
    containerWidth: number,
    containerHeight: number
  ): void {
    const config = GARDEN_CONFIG.garden.ui.hud;
    const posConfig =
      orientation === "landscape" ? config.landscape : config.portrait;

    const levelPos = UIPositionHelper.calculatePosition(
      posConfig.levelText,
      containerWidth,
      containerHeight,
      this.levelText.width,
      this.levelText.height
    );
    this.levelText.x = levelPos.x;
    this.levelText.y = levelPos.y;

    const scorePos = UIPositionHelper.calculatePosition(
      posConfig.scoreText,
      containerWidth,
      containerHeight,
      this.scoreText.width,
      this.scoreText.height
    );
    this.scoreText.x = scorePos.x;
    this.scoreText.y = scorePos.y;

    const barWidth = 700;
    const barHeight = 30;
    const progressPos = UIPositionHelper.calculatePosition(
      posConfig.progressBar,
      containerWidth,
      containerHeight,
      500,
      barHeight
    );
    this.progressBar.x = progressPos.x;
    this.progressBar.y = progressPos.y;

    this.progressText.x = this.progressBar.x;
    this.progressText.y = this.progressBar.y;
  }
}
