import { Object3D, Mesh, AnimationMixer, LoopRepeat, Group } from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { Container, Graphics, Sprite } from "pixi.js";

import type { App } from "@app";
import { AssetLoader, ComponentFactory } from "@core/index";
import { ItemConfig } from "../types";
import { GARDEN_CONFIG } from "../config";
import { createPlaceholder, calculateVertext } from "@utils/ThreeUtills";

export class GardenItemFactory extends ComponentFactory {
  private app: App;
  private assetLoader: AssetLoader;
  private animationMixers: Map<string, AnimationMixer> = new Map();

  constructor(app: App) {
    super(app.getPixiStage(), app.getThreeScene());
    this.app = app;
    this.assetLoader = app.getAssetLoader();
  }

  createThreeComponent(config: ItemConfig): Object3D {
    const original = this.assetLoader.getGLTFObject(config.id);

    if (!original) return createPlaceholder(config);

    let clone: Object3D;
    if (original.type === "Object3D") {
      clone = SkeletonUtils.clone(original);
    } else {
      clone = original.clone();
    }

    const finalScale = config.scale || 1;
    clone.scale.setScalar(finalScale);
    clone.userData.finalScale = finalScale;
    clone.updateMatrix();

    if (config.animation) {
      const animations = this.assetLoader.animations;

      if (animations && animations.length > 0) {
        const clip = animations.find((anim) => anim.name === config.animation);

        if (clip) {
          const mixer = new AnimationMixer(clone);

          const action = mixer.clipAction(clip);
          action.setLoop(LoopRepeat, Infinity);
          action.play();

          if (config.sound) this.app.getAudioManager().playSound(config.sound);

          clone.userData.mixer = mixer;
        }
      }
    }
    calculateVertext(clone);

    const spawnHeight = GARDEN_CONFIG.garden.scene.itemSpawnHeight;
    clone.scale.setScalar(0);
    clone.position.y = spawnHeight;

    return clone;
  }

  createPixiComponent(config: ItemConfig): Container {
    const container = new Container();

    const texture = this.assetLoader.getTexture(config.id);
    if (texture) {
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);

      const uiSize = GARDEN_CONFIG.garden.ui.itemPanel.itemSize;
      const scale = Math.min(uiSize / sprite.width, uiSize / sprite.height);
      sprite.scale.set(scale);

      container.addChild(sprite);
    } else {
      const placeholder = new Graphics();
      placeholder.rect(-50, -50, 100, 100);
      placeholder.fill({ color: 0xff00ff });
      container.addChild(placeholder);
    }

    return container;
  }

  updateAnimations(deltaTime: number): void {
    this.animationMixers.forEach((mixer) => {
      mixer.update(deltaTime);
    });
  }

  registerMixer(itemId: string, mixer: AnimationMixer): void {
    this.animationMixers.set(itemId, mixer);
  }

  removeMixer(itemId: string): void {
    const mixer = this.animationMixers.get(itemId);
    if (mixer) {
      mixer.stopAllAction();
      this.animationMixers.delete(itemId);
    }
  }

  getMixer(itemId: string): AnimationMixer | undefined {
    return this.animationMixers.get(itemId);
  }

  dispose(): void {
    this.animationMixers.forEach((mixer) => {
      mixer.stopAllAction();
    });
    this.animationMixers.clear();
  }
}
