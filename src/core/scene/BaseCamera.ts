import { Camera, PerspectiveCamera } from "three";

export abstract class BaseCamera {
  protected camera: Camera;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  abstract update(deltaTime: number): void;

  getCamera(): Camera {
    return this.camera;
  }

  setPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  lookAt(x: number, y: number, z: number): void {
    this.camera.lookAt(x, y, z);
  }

  updateAspect(width: number, height: number): void {
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}
