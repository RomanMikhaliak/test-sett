export enum GardenStateType {
  LOADING = "LOADING",
  LEVEL_ANIMAL = "LEVEL_ANIMAL",
  LEVEL_FENCE = "LEVEL_FENCE",
  LEVEL_GARDEN = "LEVEL_GARDEN",
  WIN = "WIN",
}

export enum ItemType {
  PLANT = "PLANT",
  FURNITURE = "FURNITURE",
  DECOR = "DECOR",
}

export enum ItemCategory {
  STRAWBERRY = "STRAWBERRY",
  CORN = "CORN",
  GRAPE = "GRAPE",
  CHICKEN = "CHICKEN",
  COW = "COW",
  TOMATO = "TOMATO",
  TREE = "TREE",
  GROUND = "GROUND",
  FENCE = "FENCE",
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface ItemConfig {
  id: string;
  category: ItemCategory;
  scale?: number;
  animation?: string;
  sound?: string;
}

export interface ItemPlacement {
  itemId: string;
  position: Position;
  rotation?: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  goalItems: number;
  placements: ItemPlacement[];
  lightingMode: "morning" | "day" | "evening" | "night";
  progressBarColors?: {
    background: number;
    foreground: number;
  };
}

export interface GameState {
  currentLevel: number;
  placedItems: PlacedItem[];
  score: number;
  isComplete: boolean;
}

export interface PlacedItem {
  id: string;
  config: ItemConfig;
  position: Position;
  rotation?: number;
}
