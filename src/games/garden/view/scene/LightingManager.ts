import {
  Scene,
  AmbientLight,
  DirectionalLight,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import gsap from "gsap";

import type { App } from "@app";
import { BaseLighting } from "@core/index";
import { GARDEN_CONFIG } from "../../config";

export class LightingManager extends BaseLighting {
  private app: App;
  private ambientLight: AmbientLight;
  private directionalLight: DirectionalLight;
  private currentMode: "morning" | "day" | "evening" | "night";
  private isTransitioning: boolean = false;
  private skybox: Mesh | null = null;

  constructor(app: App, scene: Scene) {
    super(scene);
    this.app = app;
    this.currentMode = "day";

    this.ambientLight = new AmbientLight();
    this.directionalLight = new DirectionalLight();
  }

  setSkybox(skybox: Mesh | null): void {
    this.skybox = skybox;
  }

  init(): void {
    const dayConfig = GARDEN_CONFIG.garden.lighting.day.ambient;
    this.ambientLight.color = new Color(dayConfig.color);
    this.ambientLight.intensity = dayConfig.intensity;
    this.scene.add(this.ambientLight);

    const dirConfig = GARDEN_CONFIG.garden.lighting.day.directional;
    this.directionalLight.color = new Color(dirConfig.color);
    this.directionalLight.intensity = dirConfig.intensity;
    this.directionalLight.position.set(
      dirConfig.position.x,
      dirConfig.position.y,
      dirConfig.position.z
    );

    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 4096;
    this.directionalLight.shadow.mapSize.height = 4096;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 80;
    this.directionalLight.shadow.camera.left = -80;
    this.directionalLight.shadow.camera.right = 80;
    this.directionalLight.shadow.camera.top = 80;
    this.directionalLight.shadow.camera.bottom = -80;
    this.directionalLight.shadow.bias = -0.0009;
    this.directionalLight.shadow.normalBias = 0.1;

    this.scene.add(this.directionalLight);
    this.setDebug();
  }

  setDebug() {
    if (this.app.pane) {
      this.app.pane
        .addFolder("Lighting", { expanded: false })
        .addButton({ title: "Set Morning Mode" })
        .on("click", () => this.setMorningMode());
      this.app.pane
        .getFolder("Lighting")!
        .addButton({ title: "Set Day Mode" })
        .on("click", () => this.setDayMode());
      this.app.pane
        .getFolder("Lighting")!
        .addButton({ title: "Set Evening Mode" })
        .on("click", () => this.setEveningMode());
      this.app.pane
        .getFolder("Lighting")!
        .addButton({ title: "Set Night Mode" })
        .on("click", () => this.setNightMode());
      this.app.pane
        .getFolder("Lighting")!
        .addButton({ title: "Toggle Day/Night" })
        .on("click", () => this.toggleDayNight());
    }
  }

  update(deltaTime: number): void {}

  setMorningMode(): void {
    if (this.currentMode === "morning" || this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentMode = "morning";
    this.app.getEventBus().dispatch("lighting:mode-changed", "morning");

    const morningAmbient = GARDEN_CONFIG.garden.lighting.morning.ambient;
    const morningDir = GARDEN_CONFIG.garden.lighting.morning.directional;
    const morningSkybox = GARDEN_CONFIG.garden.lighting.morning.skybox;
    const duration = GARDEN_CONFIG.garden.lighting.transitionDuration;

    gsap.to(this.ambientLight, {
      duration,
      intensity: morningAmbient.intensity,
      onUpdate: () => {
        this.ambientLight.color.setHex(morningAmbient.color);
      },
      onComplete: () => {
        this.isTransitioning = false;
      },
    });

    gsap.to(this.directionalLight, {
      duration,
      intensity: morningDir.intensity,
      onUpdate: () => {
        this.directionalLight.color.setHex(morningDir.color);
      },
    });

    gsap.to(this.directionalLight.position, {
      duration,
      x: morningDir.position.x,
      y: morningDir.position.y,
      z: morningDir.position.z,
    });

    if (this.skybox) {
      const material = this.skybox.material as
        | MeshBasicMaterial
        | MeshStandardMaterial;
      gsap.to(
        {},
        {
          duration,
          onUpdate: function (this: { progress: () => number }) {
            material.color.setHex(morningSkybox.color);
          },
        }
      );
    }
  }

  setDayMode(): void {
    if (this.currentMode === "day" || this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentMode = "day";
    this.app.getEventBus().dispatch("lighting:mode-changed", "day");

    const dayAmbient = GARDEN_CONFIG.garden.lighting.day.ambient;
    const dayDir = GARDEN_CONFIG.garden.lighting.day.directional;
    const daySkybox = GARDEN_CONFIG.garden.lighting.day.skybox;
    const duration = GARDEN_CONFIG.garden.lighting.transitionDuration;

    gsap.to(this.ambientLight, {
      duration,
      intensity: dayAmbient.intensity,
      onUpdate: () => {
        this.ambientLight.color.setHex(dayAmbient.color);
      },
      onComplete: () => {
        this.isTransitioning = false;
      },
    });

    gsap.to(this.directionalLight, {
      duration,
      intensity: dayDir.intensity,
      onUpdate: () => {
        this.directionalLight.color.setHex(dayDir.color);
      },
    });

    gsap.to(this.directionalLight.position, {
      duration,
      x: dayDir.position.x,
      y: dayDir.position.y,
      z: dayDir.position.z,
    });

    if (this.skybox) {
      const material = this.skybox.material as
        | MeshBasicMaterial
        | MeshStandardMaterial;
      gsap.to(
        {},
        {
          duration,
          onUpdate: function (this: { progress: () => number }) {
            material.color.setHex(daySkybox.color);
          },
        }
      );
    }
  }

  setEveningMode(): void {
    if (this.currentMode === "evening" || this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentMode = "evening";
    this.app.getEventBus().dispatch("lighting:mode-changed", "evening");

    const eveningAmbient = GARDEN_CONFIG.garden.lighting.evening.ambient;
    const eveningDir = GARDEN_CONFIG.garden.lighting.evening.directional;
    const eveningSkybox = GARDEN_CONFIG.garden.lighting.evening.skybox;
    const duration = GARDEN_CONFIG.garden.lighting.transitionDuration;

    gsap.to(this.ambientLight, {
      duration,
      intensity: eveningAmbient.intensity,
      onUpdate: () => {
        this.ambientLight.color.setHex(eveningAmbient.color);
      },
      onComplete: () => {
        this.isTransitioning = false;
      },
    });

    gsap.to(this.directionalLight, {
      duration,
      intensity: eveningDir.intensity,
      onUpdate: () => {
        this.directionalLight.color.setHex(eveningDir.color);
      },
    });

    gsap.to(this.directionalLight.position, {
      duration,
      x: eveningDir.position.x,
      y: eveningDir.position.y,
      z: eveningDir.position.z,
    });

    if (this.skybox) {
      const material = this.skybox.material as MeshBasicMaterial;
      gsap.to(
        {},
        {
          duration,
          onUpdate: function (this: { progress: () => number }) {
            material.color.setHex(eveningSkybox.color);
          },
        }
      );
    }
  }

  setNightMode(): void {
    if (this.currentMode === "night" || this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentMode = "night";
    this.app.getEventBus().dispatch("lighting:mode-changed", "night");

    const nightAmbient = GARDEN_CONFIG.garden.lighting.night.ambient;
    const nightDir = GARDEN_CONFIG.garden.lighting.night.directional;
    const nightSkybox = GARDEN_CONFIG.garden.lighting.night.skybox;
    const duration = GARDEN_CONFIG.garden.lighting.transitionDuration;

    gsap.to(this.ambientLight, {
      duration,
      intensity: nightAmbient.intensity,
      onUpdate: () => {
        this.ambientLight.color.setHex(nightAmbient.color);
      },
      onComplete: () => {
        this.isTransitioning = false;
      },
    });

    gsap.to(this.directionalLight, {
      duration,
      intensity: nightDir.intensity,
      onUpdate: () => {
        this.directionalLight.color.setHex(nightDir.color);
      },
    });

    gsap.to(this.directionalLight.position, {
      duration,
      x: nightDir.position.x,
      y: nightDir.position.y,
      z: nightDir.position.z,
    });

    if (this.skybox) {
      const material = this.skybox.material as MeshBasicMaterial;
      gsap.to(
        {},
        {
          duration,
          onUpdate: function (this: { progress: () => number }) {
            material.color.setHex(nightSkybox.color);
          },
        }
      );
    }
  }

  toggleDayNight(): void {
    const modes: Array<"morning" | "day" | "evening" | "night"> = [
      "morning",
      "day",
      "evening",
      "night",
    ];
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];

    switch (nextMode) {
      case "morning":
        this.setMorningMode();
        break;
      case "day":
        this.setDayMode();
        break;
      case "evening":
        this.setEveningMode();
        break;
      case "night":
        this.setNightMode();
        break;
    }
  }

  getCurrentMode(): "morning" | "day" | "evening" | "night" {
    return this.currentMode;
  }

  dispose(): void {
    if (this.ambientLight) {
      this.scene.remove(this.ambientLight);
    }
    if (this.directionalLight) {
      this.scene.remove(this.directionalLight);
    }
  }
}
