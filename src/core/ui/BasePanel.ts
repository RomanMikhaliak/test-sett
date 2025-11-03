import { Container, Graphics } from "pixi.js";

export abstract class BasePanel extends Container {
  protected background!: Graphics;

  constructor() {
    super();
    this.eventMode = "static";
  }

  abstract createBackground(): void;
  abstract layout(): void;

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  resize(): void {
    this.layout();
  }

  dispose(): void {
    this.removeChildren();
    this.destroy();
  }
}
