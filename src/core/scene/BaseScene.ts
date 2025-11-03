import { Scene, Object3D } from "three";

export abstract class BaseScene {
  protected scene: Scene;
  protected objects: Map<string, Object3D>;

  constructor() {
    this.scene = new Scene();
    this.objects = new Map();
  }

  abstract init(): void;
  abstract update(deltaTime: number): void;

  getScene(): Scene {
    return this.scene;
  }

  addObject(id: string, object: Object3D): void {
    this.objects.set(id, object);
    this.scene.add(object);
  }

  removeObject(id: string): void {
    const object = this.objects.get(id);
    if (object) {
      this.scene.remove(object);
      this.objects.delete(id);
    }
  }

  getObject(id: string): Object3D | undefined {
    return this.objects.get(id);
  }

  clearObjects(): void {
    this.objects.forEach((object) => {
      this.scene.remove(object);
    });
    this.objects.clear();
  }

  dispose(): void {
    this.clearObjects();
    this.scene.clear();
  }
}
