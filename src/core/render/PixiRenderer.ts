import { Container, WebGLRenderer } from "pixi.js";
import * as THREE from "three";
import { detectMobile } from "@utils/index";

export class PixiRenderer {
  private renderer!: WebGLRenderer;
  private stage!: Container;
  private width: number;
  private height: number;
  private eventsWarningShown = false;
  private isMobile: boolean;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.isMobile = detectMobile();
  }

  async init(threeRenderer: THREE.WebGLRenderer): Promise<void> {
    this.renderer = new WebGLRenderer();
    const maxPixelRatio = this.isMobile ? 1.5 : 2;
    const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);

    await this.renderer.init({
      context: threeRenderer.getContext() as WebGL2RenderingContext,
      width: this.width,
      height: this.height,
      backgroundAlpha: 0,
      clearBeforeRender: false,
      resolution: pixelRatio,
      canvas: threeRenderer.domElement as HTMLCanvasElement,
    });

    this.setupStage();
  }

  private setupStage(): void {
    this.stage = new Container();
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.renderer.resize(width, height);
  }

  updateStageLayout(
    width: number,
    height: number,
    baseDimensions: { width: number; height: number },
    scale: number
  ): void {
    this.stage.position.set(width / 2, height / 2);
    this.stage.pivot.set(baseDimensions.width / 2, baseDimensions.height / 2);
    this.stage.scale.set(scale, scale);
  }

  render(): void {
    this.renderer.resetState();
    this.renderer.render({ container: this.stage });
    if ((this.renderer as any).events) {
    } else {
      if (!this.eventsWarningShown) this.eventsWarningShown = true;
    }
  }

  getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  getStage(): Container {
    return this.stage;
  }

  dispose(): void {
    this.renderer.destroy();
  }
}
