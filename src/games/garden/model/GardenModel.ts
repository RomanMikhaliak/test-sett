import { GameState, PlacedItem } from "../types";

export class GardenModel {
  private state: GameState;

  constructor() {
    this.state = {
      currentLevel: 1,
      placedItems: [],
      score: 0,
      isComplete: false,
    };
  }

  getState(): GameState {
    return this.state;
  }

  getCurrentLevel(): number {
    return this.state.currentLevel;
  }

  setLevel(level: number): void {
    this.state.currentLevel = level;
  }

  addPlacedItem(item: PlacedItem): void {
    this.state.placedItems.push(item);
  }

  removePlacedItem(id: string): void {
    this.state.placedItems = this.state.placedItems.filter(
      (item) => item.id !== id
    );
  }

  getPlacedItems(): PlacedItem[] {
    return this.state.placedItems;
  }

  getPlacedItem(id: string): PlacedItem | undefined {
    return this.state.placedItems.find((item) => item.id === id);
  }

  clearPlacedItems(): void {
    this.state.placedItems = [];
  }

  incrementScore(amount: number): void {
    this.state.score += amount;
  }

  getScore(): number {
    return this.state.score;
  }

  setComplete(isComplete: boolean): void {
    this.state.isComplete = isComplete;
  }

  isGameComplete(): boolean {
    return this.state.isComplete;
  }

  reset(): void {
    this.state = {
      currentLevel: 1,
      placedItems: [],
      score: 0,
      isComplete: false,
    };
  }
}
