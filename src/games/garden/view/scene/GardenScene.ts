import {
  Scene,
  Object3D,
  Mesh,
  Vector3,
  Color,
  SphereGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  BackSide,
} from "three";

import type { App } from "@app";
import { EventBus, BaseScene, AssetLoader } from "@core/index";
import { GARDEN_CONFIG } from "../../config";
import { CloudManager } from "./CloudManager";
import { calculateVertext } from "../../../../utils";

export class GardenScene extends BaseScene {
  private app: App;
  private ground: Object3D | null = null;
  private skybox: Mesh | null = null;
  private cloudManager: CloudManager;
  private eventBus: EventBus;
  private assetLoader: AssetLoader;
  private currentGroundSize: "small" | "medium" | "large" = "small";
  private items: Map<string, Object3D> = new Map();

  constructor(app: App) {
    super();
    this.app = app;
    this.eventBus = app.getEventBus();
    this.assetLoader = app.getAssetLoader();
    this.cloudManager = new CloudManager(this.scene);
  }

  init(): void {
    this.setupScene();
  }

  async setupScene(): Promise<void> {
    const skyboxGeometry = new SphereGeometry(100, 32, 32);
    const skyboxMaterial = new MeshBasicMaterial({
      color: 0x87ceeb,
      side: BackSide,
      fog: false,
    });
    this.skybox = new Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(this.skybox);

    this.scene.background = new Color(0x87ceeb);

    this.cloudManager.init(50);

    await this.loadGround("small");
  }

  update(deltaTime: number): void {
    this.cloudManager.update(deltaTime);
  }

  async loadGround(size: "small" | "medium" | "large"): Promise<void> {
    this.currentGroundSize = size;

    if (this.ground) {
      this.scene.remove(this.ground);
      this.ground = null;
    }

    const groundPath =
      size === "small"
        ? `${GARDEN_CONFIG.paths.models}/ground.glb`
        : `${GARDEN_CONFIG.paths.models}/ground2.glb`;

    const gltf = this.assetLoader.getAsset(groundPath);

    if (!gltf) return;

    const groundModel = gltf.scene.clone();

    const scale = GARDEN_CONFIG.garden.scene.groundScale;
    groundModel.scale.set(scale.x, scale.y, scale.z);
    groundModel.position.set(0, -4.3, 0);

    groundModel.traverse((child: Object3D) => {
      calculateVertext(child);
    });

    groundModel.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scene.add(groundModel);
    this.ground = groundModel;

    this.eventBus.dispatch("scene:ground-loaded", {
      size,
      ground: groundModel,
    });
  }

  addItem(
    id: string,
    object: Object3D,
    position?: Vector3,
    rotation?: number
  ): void {
    if (this.items.has(id)) return;

    if (position) object.position.copy(position);

    object.traverse((child: Object3D) => {
      calculateVertext(child);
    });

    object.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = false;
      }
    });

    if (rotation) object.rotateY(rotation);

    this.scene.add(object);
    this.items.set(id, object);
    this.addObject(id, object);
  }

  removeItem(id: string): void {
    const object = this.items.get(id);
    if (object) {
      this.scene.remove(object);
      this.items.delete(id);
      this.removeObject(id);
    }
  }

  getItem(id: string): Object3D | undefined {
    return this.items.get(id);
  }

  clearItems(): void {
    this.items.forEach((object) => {
      this.scene.remove(object);
    });
    this.items.clear();
    this.clearObjects();
  }

  getGroundSize(): "small" | "medium" | "large" {
    return this.currentGroundSize;
  }

  getScene(): Scene {
    return this.scene;
  }

  getSkybox(): Mesh | null {
    return this.skybox;
  }

  dispose(): void {
    this.clearItems();
    this.cloudManager.dispose();
    if (this.ground) {
      this.scene.remove(this.ground);
      this.ground = null;
    }
    if (this.skybox) {
      this.scene.remove(this.skybox);
      this.skybox.geometry.dispose();
      (
        this.skybox.material as MeshBasicMaterial | MeshStandardMaterial
      ).dispose();
      this.skybox = null;
    }
  }
}
