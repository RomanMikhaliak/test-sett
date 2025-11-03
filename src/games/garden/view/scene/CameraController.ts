import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

import type { App } from "@app";
import { BaseCamera } from "@core/index";
import { GARDEN_CONFIG } from "../../config";

export class CameraController extends BaseCamera {
  private app: App;
  private targetPosition: Vector3;
  private targetLookAt: Vector3;
  private orbitControls: OrbitControls | null = null;
  private orbitControlsEnabled: boolean = false;
  private rotationTween: gsap.core.Tween | null = null;
  private rotationAngle: number = 0;

  constructor(app: App) {
    const camera = app.getThreeCamera();
    super(camera);
    this.app = app;
    this.targetPosition = camera.position.clone();
    this.targetLookAt = new Vector3(0, 0, 0);

    const domElement = app.getThreeRenderer().domElement;
    this.orbitControls = new OrbitControls(camera, domElement);
    this.orbitControls.enabled = false;
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.minDistance = GARDEN_CONFIG.garden.scene.cameraMinZoom;
    this.orbitControls.maxDistance = GARDEN_CONFIG.garden.scene.cameraMaxZoom;
    this.orbitControls.maxPolarAngle = Math.PI / 2;

    this.orbitControls.listenToKeyEvents(window);
  }

  update(_deltaTime: number): void {
    if (this.orbitControlsEnabled && this.orbitControls) {
      this.orbitControls.update();
    }
  }

  enableOrbitControls(): void {
    if (this.orbitControls) {
      this.orbitControlsEnabled = true;
      this.orbitControls.enabled = true;
    }
  }

  disableOrbitControls(): void {
    if (this.orbitControls) {
      this.orbitControlsEnabled = false;
      this.orbitControls.enabled = false;
    }
  }

  toggleOrbitControls(): void {
    if (this.orbitControlsEnabled) {
      this.disableOrbitControls();
    } else {
      this.enableOrbitControls();
    }
  }

  isOrbitControlsEnabled(): boolean {
    return this.orbitControlsEnabled;
  }

  async setIsometricView(): Promise<void> {
    return this.animateTo(new Vector3(12, 12, 12), new Vector3(0, 0, 0), 1);
  }

  async setGardenView(): Promise<void> {
    return this.animateTo(new Vector3(-4, 7, -6), new Vector3(-10, 3, 5), 2.5);
  }

  async setBarnView(): Promise<void> {
    return this.animateTo(new Vector3(0, 6, 0), new Vector3(8, 0, -12), 2.5);
  }

  async setUpgradeView(): Promise<void> {
    return this.animateTo(new Vector3(-1, 5, -1), new Vector3(8, 0, 4), 2.5);
  }

  async animateTo(
    position: Vector3,
    lookAt: Vector3,
    duration: number = 2.0
  ): Promise<void> {
    const camera = this.camera as PerspectiveCamera;

    this.targetPosition.copy(position);
    this.targetLookAt.copy(lookAt);

    const startLookAt = new Vector3();
    camera.getWorldDirection(startLookAt);
    startLookAt.multiplyScalar(camera.position.distanceTo(this.targetLookAt));
    startLookAt.add(camera.position);

    const animatedLookAt = {
      x: startLookAt.x,
      y: startLookAt.y,
      z: startLookAt.z,
    };

    return new Promise((resolve) => {
      gsap.to(camera.position, {
        duration,
        x: this.targetPosition.x,
        y: this.targetPosition.y,
        z: this.targetPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(animatedLookAt.x, animatedLookAt.y, animatedLookAt.z);
          camera.updateProjectionMatrix();
        },
        onComplete: () => {
          camera.position.set(
            this.targetPosition.x,
            this.targetPosition.y,
            this.targetPosition.z
          );
          camera.lookAt(this.targetLookAt);
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld();
          resolve();
        },
      });

      gsap.to(animatedLookAt, {
        duration,
        x: this.targetLookAt.x,
        y: this.targetLookAt.y,
        z: this.targetLookAt.z,
        ease: "power2.inOut",
        onComplete: () => {
          animatedLookAt.x = this.targetLookAt.x;
          animatedLookAt.y = this.targetLookAt.y;
          animatedLookAt.z = this.targetLookAt.z;
        },
      });
    });
  }

  animateTransition(duration: number): void {
    this.animateTo(this.targetPosition, this.targetLookAt, duration);
  }

  async animateToBirdView(): Promise<void> {
    return await this.animateTo(
      new Vector3(0, 20, 30),
      new Vector3(0, 0, 0),
      2.0
    );
  }

  startContinuousRotation(
    radius: number = 25,
    height: number = 15,
    duration: number = 20,
    lookAtY: number = 0
  ): void {
    this.stopContinuousRotation();

    const camera = this.camera as PerspectiveCamera;
    this.targetLookAt.set(0, lookAtY, 0);
    this.rotationAngle = Math.atan2(
      camera.position.z - this.targetLookAt.z,
      camera.position.x - this.targetLookAt.x
    );

    const rotationData = { angle: this.rotationAngle };

    this.rotationTween = gsap.to(rotationData, {
      angle: this.rotationAngle + Math.PI * 2,
      duration: duration,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        const x = this.targetLookAt.x + Math.cos(rotationData.angle) * radius;
        const z = this.targetLookAt.z + Math.sin(rotationData.angle) * radius;

        camera.position.set(x, height, z);
        camera.lookAt(this.targetLookAt);
        camera.updateMatrixWorld();
      },
    });
  }

  stopContinuousRotation(): void {
    if (this.rotationTween) {
      this.rotationTween.kill();
      this.rotationTween = null;
    }
  }
}
