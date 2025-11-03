import { Container } from "pixi.js";

export abstract class BaseButton extends Container {
  protected background!: any;
  protected isEnabled: boolean = true;

  constructor() {
    super();
    this.eventMode = "static";
    this.cursor = "pointer";
  }

  abstract createBackground(): void;
  abstract onPointerDown(): void;
  abstract onPointerUp(): void;
  abstract onPointerOver(): void;
  abstract onPointerOut(): void;

  protected setupInteraction(): void {
    this.on("pointerdown", this.handlePointerDown.bind(this));
    this.on("pointerup", this.handlePointerUp.bind(this));
    this.on("pointerover", this.handlePointerOver.bind(this));
    this.on("pointerout", this.handlePointerOut.bind(this));
  }

  private handlePointerDown(): void {
    if (this.isEnabled) this.onPointerDown();
  }

  private handlePointerUp(): void {
    if (this.isEnabled) this.onPointerUp();
  }

  private handlePointerOver(): void {
    if (this.isEnabled) this.onPointerOver();
  }

  private handlePointerOut(): void {
    if (this.isEnabled) this.onPointerOut();
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.5;
  }

  dispose(): void {
    this.removeAllListeners();
    this.destroy();
  }
}
