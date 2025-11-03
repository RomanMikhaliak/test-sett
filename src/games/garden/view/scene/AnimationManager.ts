import { Object3D, Mesh, Vector3, Group } from "three";
import gsap from "gsap";
import { App } from "@app";

import { GARDEN_CONFIG } from "../../config";

export function AnimateSpawn(
  object: Object3D | Group,
  targetPosition: Vector3,
  app?: App
): Promise<void> {
  return new Promise((resolve) => {
    const duration = GARDEN_CONFIG.garden.scene.itemDropDuration;
    const finalScale = object.userData.finalScale || 1;
    if (app) {
      const audio = app.getAudioManager();
      audio.playSound("place", 0.7);
    }

    if (object instanceof Group) {
      object.traverse((child) => {
        if (child instanceof Mesh) {
          child.scale.set(1, 1, 1);
        }
      });
    }

    object.scale.set(0, 0, 0);

    gsap.to(object.scale, {
      duration,
      x: finalScale,
      y: finalScale,
      z: finalScale,
      ease: "back.out(1.7)",
    });

    gsap.to(object.position, {
      duration,
      y: targetPosition.y,
      ease: "bounce.out",
      onComplete: () => resolve(),
    });
  });
}

export function AnimateRemove(object: Object3D): Promise<void> {
  return new Promise((resolve) => {
    const duration = 0.3;
    const finalScale = object.userData.finalScale || 1;
    object.scale.set(finalScale, finalScale, finalScale);

    gsap.to(object.scale, {
      duration,
      x: 0,
      y: 0,
      z: 0,
      ease: "back.in(1.7)",
    });

    gsap.to(object.position, {
      duration,
      y: object.position.y + 2,
      ease: "power2.in",
      onComplete: () => resolve(),
    });
  });
}
