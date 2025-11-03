import { Container, Graphics } from "pixi.js";

export abstract class BaseProgressBar extends Container {
  protected _width: number;
  protected _height: number;

  protected background!: Graphics;
  protected fill!: Graphics;
  protected progress: number = 0;

  constructor(width: number, height: number) {
    super();
    this._width = width;
    this._height = height;
  }

  abstract createBackground(): void;
  abstract createFill(): void;

  setProgress(value: number): void {
    this.progress = Math.max(0, Math.min(1, value));
    this.updateFill();
  }

  getProgress(): number {
    return this.progress;
  }

  protected abstract updateFill(): void;

  dispose(): void {
    this.destroy();
  }
}
