import { Graphics } from "pixi.js";
import gsap from "gsap";
import { BaseProgressBar } from "./BaseProgressBar";

export class ProgressBar extends BaseProgressBar {
  private backgroundColor: number;
  private foregroundColor: number;
  private borderRadius: number;
  private currentAnimatedProgress: number = 0;
  private progressTween?: gsap.core.Tween;

  constructor(
    width: number,
    height: number,
    backgroundColor: number = 0x4a4a4a,
    foregroundColor: number = 0x7cb342,
    borderRadius: number = 5
  ) {
    super(width, height);
    this.backgroundColor = backgroundColor;
    this.foregroundColor = foregroundColor;
    this.borderRadius = borderRadius;

    this.createBackground();
    this.createFill();
  }

  createBackground(): void {
    if (!this.background) {
      this.background = new Graphics();
      this.addChild(this.background);
    }

    this.background.clear();
    this.background.roundRect(
      0,
      0,
      this._width,
      this._height,
      this.borderRadius
    );
    this.background.fill(this.backgroundColor);
  }

  setColors(backgroundColor: number, foregroundColor: number): void {
    this.backgroundColor = backgroundColor;
    this.foregroundColor = foregroundColor;
    this.createBackground();
    this.updateFill();
  }

  createFill(): void {
    this.fill = new Graphics();
    this.addChild(this.fill);
    this.updateFill();
  }

  protected updateFill(): void {
    this.fill.clear();
    const fillWidth = this._width * this.currentAnimatedProgress;
    if (fillWidth > 0) {
      this.fill.roundRect(0, 0, fillWidth, this._height, this.borderRadius);
      this.fill.fill(this.foregroundColor);
    }
  }

  setProgress(value: number): void {
    const targetProgress = Math.max(0, Math.min(1, value));
    this.progress = targetProgress;

    if (this.progressTween) {
      this.progressTween.kill();
    }

    this.progressTween = gsap.to(this, {
      currentAnimatedProgress: targetProgress,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        this.updateFill();
      },
    });
  }

  dispose(): void {
    if (this.progressTween) {
      this.progressTween.kill();
    }
    super.dispose();
  }
}
