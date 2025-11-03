import { CONFIG as BASE_CONFIG } from "@config";
import { ItemConfig, ItemCategory, LevelConfig } from "./types";

export const ITEMS: ItemConfig[] = [
  {
    id: "strawberry_3",
    category: ItemCategory.STRAWBERRY,
    scale: 1,
  },
  {
    id: "corn_3",
    category: ItemCategory.CORN,
    scale: 1,
  },
  {
    id: "grape_3",
    category: ItemCategory.GRAPE,
    scale: 1,
  },
  {
    id: "tomato_3",
    category: ItemCategory.TOMATO,
    scale: 1,
  },
  {
    id: "chicken_1",
    category: ItemCategory.CHICKEN,
    scale: 1,
    animation: "idle_chicken",
    sound: "chicken",
  },
  {
    id: "cow_1",
    category: ItemCategory.COW,
    scale: 1,
    animation: "idle_cow",
    sound: "cow",
  },
  {
    id: "tree",
    category: ItemCategory.TREE,
    scale: 0.15,
    sound: "place",
  },
  {
    id: "ground",
    category: ItemCategory.GROUND,
    scale: 0.3,
    sound: "remove",
  },
  {
    id: "fence",
    category: ItemCategory.FENCE,
    scale: 1,
  },
];

export function getItemById(id: string): ItemConfig | undefined {
  return ITEMS.find((item) => item.id === id);
}

export function getItemByCategory(
  category: ItemCategory
): ItemConfig | undefined {
  return ITEMS.find((item) => item.category === category);
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "LEVEL_ANIMAL",
    goalItems: 15,
    placements: [
      {
        itemId: "chicken_1",
        position: { x: 7.4, y: -1, z: -10.7 },
        rotation: -Math.PI / 1.5,
      },
      {
        itemId: "chicken_1",
        position: { x: 11.5, y: 0.2, z: -10 },
        rotation: Math.PI / 3.5,
      },
      {
        itemId: "chicken_1",
        position: { x: 11.5, y: 0.2, z: -5 },
        rotation: 0,
      },
      {
        itemId: "chicken_1",
        position: { x: 10, y: 0.2, z: -7 },
        rotation: -Math.PI / 2,
      },
      {
        itemId: "chicken_1",
        position: { x: 13.5, y: -3.4, z: -16.3 },
        rotation: Math.PI / 4,
      },
      {
        itemId: "cow_1",
        position: { x: -1.7, y: 0.2, z: -14 },
        rotation: Math.PI / 3,
      },
      {
        itemId: "cow_1",
        position: { x: 4, y: 0.2, z: -16 },
        rotation: -Math.PI / 4,
      },
      {
        itemId: "ground",
        position: { x: 1.5, y: -0.05, z: -12 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: 4.5, y: -0.05, z: -12 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: 7.5, y: -0.05, z: -12 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: 10.5, y: -0.05, z: -12 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "tree",
        position: { x: 14, y: 0, z: -12 },
        rotation: -Math.PI / 2,
      },
      {
        itemId: "tree",
        position: { x: 14, y: 0, z: -3 },
        rotation: Math.PI / 2,
      },
      { itemId: "strawberry_3", position: { x: 12, y: 0, z: -3 } },
      { itemId: "strawberry_3", position: { x: 9, y: 0, z: -3 } },
    ],
    lightingMode: "morning",
    progressBarColors: {
      background: 0xefece3,
      foreground: 0x84994f,
    },
  },
  {
    id: 2,
    name: "LEVEL_FENCE",
    goalItems: 15,
    placements: [
      { itemId: "grape_3", position: { x: 12, y: 0, z: 2 } },
      { itemId: "grape_3", position: { x: 9, y: 0, z: 2 } },
      { itemId: "grape_3", position: { x: 6, y: 0, z: 2 } },
      { itemId: "tree", position: { x: 15, y: 0, z: 2 } },
      { itemId: "tree", position: { x: 15, y: 0, z: 7 } },
      { itemId: "tree", position: { x: 14, y: 0, z: 12 } },
      { itemId: "tree", position: { x: 8, y: 0, z: 12 } },
      { itemId: "tree", position: { x: 3, y: 0, z: 12 } },
      {
        itemId: "ground",
        position: { x: 13, y: -0.05, z: -0.5 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: 9.5, y: -0.05, z: -0.5 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: 6, y: -0.05, z: -0.5 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: 2.5, y: -0.05, z: -0.5 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "fence",
        position: { x: 8, y: 0, z: 7 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "cow_1",
        position: { x: 4, y: 0.2, z: 5.5 },
        rotation: Math.PI / 3,
      },
      {
        itemId: "cow_1",
        position: { x: 11, y: 0.2, z: 9 },
        rotation: Math.PI,
      },
    ],
    lightingMode: "day",
    progressBarColors: {
      background: 0xefece3,
      foreground: 0xfcb53b,
    },
  },
  {
    id: 3,
    name: "LEVEL_GARDEN",
    goalItems: 20,
    placements: [
      { itemId: "tomato_3", position: { x: -15, y: 0, z: 6 } },
      { itemId: "tomato_3", position: { x: -12, y: 0, z: 6 } },
      { itemId: "tomato_3", position: { x: -9, y: 0, z: 3 } },
      { itemId: "tomato_3", position: { x: -6, y: 0, z: 3 } },
      { itemId: "corn_3", position: { x: -6, y: 0, z: 6 } },
      { itemId: "corn_3", position: { x: -9, y: 0, z: 6 } },
      { itemId: "corn_3", position: { x: -12, y: 0, z: 3 } },
      { itemId: "corn_3", position: { x: -15, y: 0, z: 3 } },
      {
        itemId: "ground",
        position: { x: -5.3, y: -0.05, z: 0 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: -8.8, y: -0.05, z: 0 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: -12.3, y: -0.05, z: 0 },
        rotation: Math.PI / 2,
      },
      {
        itemId: "ground",
        position: { x: -15.8, y: -0.05, z: 0 },
        rotation: Math.PI / 2,
      },
      { itemId: "grape_3", position: { x: -15, y: 0, z: -6 } },
      { itemId: "grape_3", position: { x: -12, y: 0, z: -6 } },
      { itemId: "grape_3", position: { x: -9, y: 0, z: -3 } },
      { itemId: "grape_3", position: { x: -6, y: 0, z: -3 } },
      { itemId: "strawberry_3", position: { x: -6, y: 0, z: -6 } },
      { itemId: "strawberry_3", position: { x: -9, y: 0, z: -6 } },
      { itemId: "strawberry_3", position: { x: -12, y: 0, z: -3 } },
      { itemId: "strawberry_3", position: { x: -15, y: 0, z: -3 } },
    ],
    lightingMode: "evening",
    progressBarColors: {
      background: 0xefece3,
      foreground: 0xb45253,
    },
  },
];

export function getLevelConfig(levelId: number): LevelConfig | undefined {
  return LEVELS.find((level) => level.id === levelId);
}

export const AUDIO_CONFIG = {
  music: {
    theme: "assets/sounds/theme.mp3",
  },
  sfx: {
    click: "assets/sounds/click_003.mp3",
    place: "assets/sounds/place.mp3",
    remove: "assets/sounds/remove.mp3",
    chicken: "assets/sounds/chicken.mp3",
    cow: "assets/sounds/cow.mp3",
    popup: "assets/sounds/popup.mp3",
    level: "assets/sounds/level.mp3",
  },
};

export const GARDEN_CONFIG = {
  ...BASE_CONFIG,

  paths: {
    ...BASE_CONFIG.paths,
    models: "assets/gltf",
    textures: "assets/images",
    audio: "assets/sounds",
  },

  garden: {
    items: ITEMS,
    levels: LEVELS,
    audio: AUDIO_CONFIG,

    loading: {
      backgroundColor: 0x87ceeb,
      progressBarWidth: 500,
      progressBarHeight: 30,
      foregroundColor: 0xd1d1d6,
      props: {
        landscape: { width: 1920, height: 1080 },
        portrait: { width: 1080, height: 1920 },
      },
      landscape: {
        background: { x: 960, y: 560 },
        title: { x: 960, y: 350 },
        loadingText: { x: 960, y: 520 },
        progressBar: { x: 960, y: 560 },
        percentText: { x: 960, y: 560 },
        startButton: { x: 960, y: 700 },
      },
      portrait: {
        background: { x: 540, y: 960 },
        title: { x: 540, y: 500 },
        loadingText: { x: 540, y: 820 },
        progressBar: { x: 540, y: 860 },
        percentText: { x: 540, y: 860 },
        startButton: { x: 540, y: 1300 },
      },
    },
    ui: {
      itemPanel: {
        itemSize: 120,
        itemSpacing: 20,
        backgroundColor: 0x4a4a4a,
        borderRadius: 15,
        landscape: { x: 1000, y: 1120 },
        portrait: { x: 600, y: 1800 },
      },
      hud: {
        fontSize: 32,
        scoreColor: 0x0c2b4e,
        levelColor: 0xffffff,
        landscape: {
          levelText: { x: 960, y: 20 },
          progressBar: { x: 960, y: 60 },
          scoreText: { x: 30, y: 30 },
        },
        portrait: {
          levelText: { x: 540, y: 20 },
          progressBar: { x: 540, y: 60 },
          scoreText: { x: 30, y: 30 },
        },
      },
      winScreen: {
        backgroundColor: 0x0c2b4e,
        backgroundAlpha: 0.9,
        buttonWidth: 300,
        buttonHeight: 80,
        landscape: {
          background: { x: 960, y: 560 },
          title: { x: 960, y: 350 },
          message: { x: 960, y: 500 },
          ctaButton: { x: 960, y: 750, offsetX: 175, offsetY: 0 },
          replayButton: { x: 960, y: 750, offsetX: -175, offsetY: 0 },
          toggleButton: { x: 960, y: 625 },
        },
        portrait: {
          background: { x: 540, y: 960 },
          title: { x: 540, y: 500 },
          message: { x: 540, y: 850 },
          ctaButton: { x: 540, y: 1300, offsetX: 175, offsetY: 0 },
          replayButton: { x: 540, y: 1300, offsetX: -175, offsetY: 0 },
          toggleButton: { x: 540, y: 1050 },
        },
      },
    },

    scene: {
      groundScale: { x: 1, y: 1, z: 1 },
      itemSpawnHeight: 2,
      itemDropDuration: 0.5,
      cameraRotationSpeed: 0.5,
      cameraZoomSpeed: 1.0,
      cameraMinZoom: 10,
      cameraMaxZoom: 50,
    },

    lighting: {
      morning: {
        ambient: { color: 0xffeedd, intensity: 1 },
        directional: {
          color: 0xffa07a,
          intensity: 2,
          position: { x: 10, y: 8, z: 10 },
        },
        skybox: { color: 0xffa07a },
      },
      day: {
        ambient: { color: 0xfff2e0, intensity: 1 },
        directional: {
          color: 0xffe2b0,
          intensity: 2,
          position: { x: 0, y: 16, z: 5 },
        },
        skybox: { color: 0x87ceeb },
      },
      evening: {
        ambient: { color: 0xffbb88, intensity: 1 },
        directional: {
          color: 0xff9966,
          intensity: 2,
          position: { x: -10, y: 13, z: -10 },
        },
        skybox: { color: 0xff6b4a },
      },
      night: {
        ambient: { color: 0x404080, intensity: 1 },
        directional: {
          color: 0x8080ff,
          intensity: 2,
          position: { x: -15, y: 10, z: -15 },
        },
        skybox: { color: 0x1a1a3e },
      },
      transitionDuration: 1.5,
    },

    effects: {
      confetti: {
        count: 100,
        colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
        spread: 5,
        gravity: -0.1,
      },
      sparkle: {
        count: 20,
        size: 0.2,
        lifetime: 1.0,
        color: 0xffff00,
      },
    },
  },

  assets: {
    gltf: ["assets/gltf/ground.glb", "assets/gltf/objects.glb"],

    images: [
      { name: "strawberry_3", path: "assets/images/strawberry.png" },
      { name: "corn_3", path: "assets/images/corn.png" },
      { name: "grape_3", path: "assets/images/grape.png" },
      { name: "tomato_3", path: "assets/images/tomato.png" },
      { name: "chicken_1", path: "assets/images/chiken.png" },
      { name: "cow_1", path: "assets/images/cow.png" },
      { name: "fence", path: "assets/images/fence.png" },
      { name: "ground", path: "assets/images/ground.png" },
      { name: "tree", path: "assets/images/tree.png" },
      { name: "hand", path: "assets/images/hand.png" },
    ],

    sounds: [
      { id: "click", path: AUDIO_CONFIG.sfx.click, volume: 1.0 },
      { id: "place", path: AUDIO_CONFIG.sfx.place, volume: 1.0 },
      { id: "remove", path: AUDIO_CONFIG.sfx.remove, volume: 1.0 },
      { id: "chicken", path: AUDIO_CONFIG.sfx.chicken, volume: 1.0 },
      { id: "cow", path: AUDIO_CONFIG.sfx.cow, volume: 1.0 },
      { id: "popup", path: AUDIO_CONFIG.sfx.popup, volume: 1.0 },
      { id: "level", path: AUDIO_CONFIG.sfx.level, volume: 1.0 },
    ],

    music: [{ id: "theme", path: AUDIO_CONFIG.music.theme, volume: 0.7 }],
  },
};

export const loadScreen = {};

export type GardenConfig = typeof GARDEN_CONFIG;
