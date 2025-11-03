import { Graphics } from "pixi.js";
import gsap from "gsap";

import type { App } from "@app";
import { EventBus, BasePanel } from "@core/index";
import { UIPositionHelper } from "@utils/index";
import { ItemCategory, ItemPlacement } from "../../types";
import { ItemButton } from "./ItemButton";
import { GARDEN_CONFIG, ITEMS, getItemById } from "../../config";

export class ItemPanel extends BasePanel {
  private app: App;
  private eventBus: EventBus;

  private buttons: Map<ItemCategory, ItemButton> = new Map();
  private selectedCategory: ItemCategory | null = null;
  private press: boolean = false;

  constructor(app: App) {
    super();
    this.app = app;
    this.eventBus = app.getEventBus();
    this.visible = false;
  }

  createBackground(): void {
    const config = GARDEN_CONFIG.garden.ui.itemPanel;

    this.background = new Graphics();
    this.background
      .roundRect(0, 0, this.width, this.height, config.borderRadius)
      .fill({ color: config.backgroundColor, alpha: 0.9 });
    this.background.interactive = true;

    this.addChild(this.background);
  }

  layout(): void {}

  setAvailablePlacements(placements: ItemPlacement[]): void {
    this.buttons.forEach((button) => button.destroy());
    this.buttons.clear();

    const uniqueCategories = new Set<ItemCategory>();
    placements.forEach((placement) => {
      const item = getItemById(placement.itemId);
      if (item) uniqueCategories.add(item.category);
    });

    const categories = Array.from(uniqueCategories);
    const config = GARDEN_CONFIG.garden.ui.itemPanel;
    const startX = config.itemSpacing;
    const buttonY = (this.height - config.itemSize) / 2;

    categories.forEach((category, index) => {
      const button = this.createItemButton(category);
      button.x = startX + index * (config.itemSize + config.itemSpacing);
      button.y = buttonY;

      this.addChild(button);
      this.buttons.set(category, button);
    });

    this.pivot.set(this.width / 2, this.height / 2);
  }

  private createItemButton(category: ItemCategory): ItemButton {
    const itemConfig = ITEMS.find((item) => item.category === category);
    const texture = itemConfig
      ? this.app.getAssetLoader().getTexture(itemConfig.id)
      : undefined;

    const button = new ItemButton(
      category,
      texture,
      this.onButtonClick.bind(this)
    );

    return button;
  }

  private onButtonClick(category: ItemCategory): void {
    if (this.press) return;
    this.press = true;
    gsap.delayedCall(0.2, () => {
      this.press = false;
    });

    this.app.getAudioManager().playSound("click");
    this.eventBus.dispatch("ui:element-clicked");

    this.selectedCategory = category;
    const button = this.buttons.get(category);
    if (button) button.setSelected(true);

    this.eventBus.dispatch("category:selected", category);
  }

  async show(): Promise<void> {
    this.visible = true;
    this.alpha = 0;

    return new Promise((resolve) => {
      gsap.to(this, {
        duration: 0.5,
        alpha: 1,
        onComplete: () => resolve(),
      });
    });
  }

  async hide(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this, {
        duration: 0.2,
        alpha: 0,
        onComplete: () => {
          this.visible = false;
          resolve();
        },
      });
    });
  }

  getSelectedCategory(): ItemCategory | null {
    return this.selectedCategory;
  }

  getFirstVisibleButton(): ItemButton | null {
    for (const button of this.buttons.values()) {
      if (button.visible && button.alpha > 0) {
        return button;
      }
    }
    return null;
  }

  getFirstVisibleButtonPosition(): { x: number; y: number } | null {
    const button = this.getFirstVisibleButton();
    if (!button) return null;
    const globalPos = button.getGlobalPosition();
    return { x: globalPos.x, y: globalPos.y };
  }

  updateOrientation(
    orientation: "landscape" | "portrait",
    containerWidth: number,
    containerHeight: number
  ): void {
    const config = GARDEN_CONFIG.garden.ui.itemPanel;
    const posConfig =
      orientation === "landscape" ? config.landscape : config.portrait;

    const pos = UIPositionHelper.calculatePosition(
      posConfig,
      containerWidth,
      containerHeight
    );

    this.x = pos.x;
    this.y = pos.y;
  }
}
