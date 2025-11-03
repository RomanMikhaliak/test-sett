import {
  WebGLRenderer,
  PCFSoftShadowMap,
  Scene,
  PerspectiveCamera,
} from "three";
import { CONFIG } from "@config";
import { detectMobile } from "@utils/index";

export class ThreeRenderer {
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private width: number;
  private height: number;
  private resizeTimeout: number | null = null;
  private isMobile: boolean;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.isMobile = detectMobile();
  }

  init(): void {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
  }

  private setupRenderer(): void {
    this.renderer = new WebGLRenderer({
      antialias: this.isMobile ? false : CONFIG.renderer.antialias,
      stencil: true,
      powerPreference: this.isMobile ? "low-power" : "high-performance",
    });

    const maxPixelRatio = this.isMobile ? 1.5 : 2;
    const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);
    this.renderer.setPixelRatio(pixelRatio);

    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(CONFIG.renderer.clearColor, 1);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;

    document.body.appendChild(this.renderer.domElement);
  }

  private setupScene(): void {
    this.scene = new Scene();
  }

  private setupCamera(): void {
    this.camera = new PerspectiveCamera(
      CONFIG.camera.fov,
      this.width / this.height,
      CONFIG.camera.near,
      CONFIG.camera.far
    );
    this.camera.position.set(
      CONFIG.camera.position.x,
      CONFIG.camera.position.y,
      CONFIG.camera.position.z
    );
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  resizeDebounced(width: number, height: number, delay: number = 150): void {
    if (this.resizeTimeout !== null) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      this.resize(width, height);
      this.resizeTimeout = null;
    }, delay);
  }

  render(): void {
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
  }

  getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  getScene(): Scene {
    return this.scene;
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  dispose(): void {
    if (this.resizeTimeout !== null) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(
        this.renderer.domElement
      );
    }
  }
}
