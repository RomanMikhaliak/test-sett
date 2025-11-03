import { Scene, Light } from "three";

export abstract class BaseLighting {
  protected scene: Scene;
  protected lights: Map<string, Light>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.lights = new Map();
  }

  abstract init(): void;
  abstract update(deltaTime: number): void;

  addLight(id: string, light: Light): void {
    this.lights.set(id, light);
    this.scene.add(light);
  }

  removeLight(id: string): void {
    const light = this.lights.get(id);
    if (light) {
      this.scene.remove(light);
      this.lights.delete(id);
    }
  }

  getLight(id: string): Light | undefined {
    return this.lights.get(id);
  }

  setIntensity(id: string, intensity: number): void {
    const light = this.lights.get(id);
    if (light) {
      light.intensity = intensity;
    }
  }

  dispose(): void {
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights.clear();
  }
}
