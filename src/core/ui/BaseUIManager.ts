import { WebGLRenderer, Container } from "pixi.js";
import { EventBus } from "../index";

export abstract class BaseUIManager {
  protected renderer: WebGLRenderer;
  protected stage: Container;
  protected eventBus: EventBus;
  protected width!: number;
  protected height!: number;

  constructor(renderer: WebGLRenderer, eventBus: EventBus) {
    this.renderer = renderer;
    this.eventBus = eventBus;
    this.stage = new Container();
  }

  abstract init(): void;
  abstract update(deltaTime: number): void;

  getStage(): Container {
    return this.stage;
  }

  show(): void {
    this.stage.visible = true;
  }

  hide(): void {
    this.stage.visible = false;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  dispose(): void {
    this.stage.removeChildren();
    this.stage.destroy();
  }
}
