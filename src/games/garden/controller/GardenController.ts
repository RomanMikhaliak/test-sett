import type { App } from "@app";
import { EventBus } from "@core/index";

import { GardenModel } from "../model/GardenModel";
import { Position, ItemCategory, PlacedItem } from "../types";
import { getLevelConfig, getItemByCategory, getItemById } from "../config";

export class GardenController {
  private app: App;
  private model: GardenModel;
  private eventBus: EventBus;
  private selectedCategory: ItemCategory | null = null;
  private itemCounter: number = 0;

  constructor(app: App, model: GardenModel) {
    this.app = app;
    this.model = model;
    this.eventBus = app.getEventBus();
    this.setupListeners();
  }

  private setupListeners(): void {
    this.eventBus.add("category:selected", this.onCategorySelected.bind(this));
    this.eventBus.add("item:place", this.onItemPlaced.bind(this));
    this.eventBus.add("item:removed", this.onItemRemoved.bind(this));
    this.eventBus.add("level:complete", this.onLevelComplete.bind(this));
    this.eventBus.add("game:replay", this.restartGame.bind(this));
    this.eventBus.add("game:download-cta", this.onDownloadCTA.bind(this));
  }

  private async onCategorySelected(category: ItemCategory): Promise<void> {
    this.selectedCategory = category;

    const currentLevel = this.model.getCurrentLevel();
    const levelConfig = getLevelConfig(currentLevel);
    if (!levelConfig) return;

    const placementsForCategory = levelConfig.placements.filter((placement) => {
      const item = getItemById(placement.itemId);
      return item && item.category === category;
    });

    for (const placement of placementsForCategory) {
      const itemConfig = getItemById(placement.itemId);
      if (!itemConfig) continue;

      this.eventBus.dispatch("item:place", {
        category: itemConfig.category,
        position: placement.position,
        rotation: placement.rotation || 0,
      });
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  private onItemPlaced(data: {
    category: ItemCategory;
    position: Position;
    rotation: number;
  }): void {
    const { category, position, rotation } = data;

    const itemConfig = getItemByCategory(category);
    if (!itemConfig) return;

    const itemId = `${category}_${Date.now()}`;
    const placedItem: PlacedItem = {
      id: itemId,
      config: itemConfig,
      position,
      rotation,
    };

    this.model.addPlacedItem(placedItem);
    this.model.incrementScore(10);

    this.eventBus.dispatch("model:item-added", placedItem);
    this.eventBus.dispatch("model:score-updated", this.model.getScore());

    this.selectedCategory = null;

    this.checkLevelProgress();
  }

  private onItemRemoved(itemId: string): void {
    const item = this.model.getPlacedItem(itemId);
    if (item) {
      this.model.removePlacedItem(itemId);
      this.model.incrementScore(-5);

      this.eventBus.dispatch("model:item-removed", itemId);
      this.eventBus.dispatch("model:score-updated", this.model.getScore());

      this.checkLevelProgress();
    }
  }

  private checkLevelProgress(): void {
    const currentLevel = this.model.getCurrentLevel();
    const levelConfig = getLevelConfig(currentLevel);

    if (!levelConfig) return;

    const progress = ++this.itemCounter;
    const goal = levelConfig.goalItems;

    this.eventBus.dispatch("model:progress-updated", {
      current: progress,
      goal,
    });

    if (progress >= goal) {
      this.onLevelComplete(currentLevel);
      this.itemCounter = 0;
    }
  }

  private onLevelComplete(levelId: number): void {
    this.eventBus.dispatch("ui:level-complete", levelId);

    const nextLevel = levelId + 1;
    const nextLevelConfig = getLevelConfig(nextLevel);

    if (nextLevelConfig) {
      this.model.setLevel(nextLevel);
      this.eventBus.dispatch("model:level-changed", nextLevel);
    } else {
      this.model.setComplete(true);
      this.eventBus.dispatch("game:complete");
    }
  }

  private onDownloadCTA(): void {
    window.open("https://google.com", "_blank");
  }

  startGame(): void {
    this.model.reset();
    const firstLevel = 1;
    this.model.setLevel(firstLevel);

    this.eventBus.dispatch("model:score-updated", this.model.getScore());
  }

  restartGame(): void {
    this.eventBus.dispatch("game:restart");
    this.startGame();
  }

  getSelectedCategory(): ItemCategory | null {
    return this.selectedCategory;
  }

  dispose(): void {
    this.eventBus.removeAll("category:selected");
    this.eventBus.removeAll("item:place");
    this.eventBus.removeAll("item:removed");
    this.eventBus.removeAll("level:complete");
    this.eventBus.removeAll("game:replay");
    this.eventBus.removeAll("game:download-cta");
    this.eventBus.removeAll("input:click");
  }
}
