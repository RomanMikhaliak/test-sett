export const CONFIG = {
  game: {
    name: "GardenMakeover",
    version: "1.0.0",
    screen: {
      landscape: { width: 1920, height: 1080 },
      portrait: { width: 1080, height: 1920 },
    },
    width: 1920,
    height: 1080,
    targetFPS: 60,
  },

  renderer: {
    antialias: true,
    clearColor: 0x000000,
    pixelRatio: window.devicePixelRatio || 1,
  },

  camera: {
    fov: 70,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 10, z: 20 },
  },

  performance: {
    maxDeltaTime: 0.1,
    autoResize: true,
    mobileOptimized: true,
  },

  audio: {
    masterVolume: 1.0,
    musicVolume: 0.7,
    sfxVolume: 1.0,
  },

  debug: {
    showFPS: false,
    showStats: false,
    enableTweakpane: true,
    fps: true,
  },

  paths: {
    assets: "./assets",
    models: "./assets/gltf",
    images: "./assets/images",
    sounds: "./assets/sounds",
  },
};

export type GameConfig = typeof CONFIG;
