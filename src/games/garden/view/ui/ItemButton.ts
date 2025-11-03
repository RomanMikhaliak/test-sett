import { Graphics, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

import { BaseButton } from "@/core";
import { ItemCategory } from "../../types";
import { GARDEN_CONFIG } from "../../config";

export class ItemButton extends BaseButton {
  private readonly category: ItemCategory;
  private readonly onClickCallback?: (category: ItemCategory) => void;

  private iconSprite: Sprite | null = null;
  private isSelected: boolean = false;

  constructor(
    category: ItemCategory,
    texture?: Texture,
    onClick?: (category: ItemCategory) => void
  ) {
    super();

    this.category = category;
    this.onClickCallback = onClick;

    this.createBackground();
    if (texture) this.createIcon(texture);
    this.setupInteraction();

    this.pivot.set(this.width / 2, this.height / 2);
  }

  createBackground(): void {
    const config = GARDEN_CONFIG.garden.ui.itemPanel;

    this.background = new Graphics();
    this.background.roundRect(0, 0, config.itemSize, config.itemSize, 10);
    this.background.stroke({
      color: 0x501e00,
      width: 10,
      alpha: 0.9,
      alignment: 0.5,
    });
    this.background.fill({ color: 0x9b5318, alpha: 0.85 });
    this.addChild(this.background);
  }

  private createIcon(texture?: Texture): void {
    const config = GARDEN_CONFIG.garden.ui.itemPanel;

    this.iconSprite = new Sprite(texture);
    this.iconSprite.width = config.itemSize - 20;
    this.iconSprite.height = config.itemSize - 20;
    this.iconSprite.x = 10;
    this.iconSprite.y = 10;
    this.addChild(this.iconSprite);
  }

  onPointerDown(): void {
    gsap.to(this.scale, {
      duration: 0.3,
      x: 0.95,
      y: 0.95,
      ease: "back.out(1.7)",
      onComplete: () => {
        if (this.onClickCallback && !this.isSelected)
          this.onClickCallback(this.category);
      },
    });
  }

  onPointerUp(): void {}

  onPointerOver(): void {
    gsap.to(this.scale, {
      duration: 0.2,
      x: 1.05,
      y: 1.05,
      ease: "back.out(1.7)",
    });
    this.background.tint = 0xaaaaaa;
  }

  onPointerOut(): void {
    gsap.to(this.scale, { duration: 0.2, x: 1, y: 1 });

    if (this.isSelected) {
      this.background.tint = 0x7cb342;
    } else {
      this.background.tint = 0xffffff;
    }
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.background.tint = 0x7cb342;

    gsap.to(this.scale, {
      duration: 0.5,
      x: 0,
      y: 0,
      ease: "back.in(1.7)",
    });
    gsap.to(this, {
      duration: 0.5,
      alpha: 0,
      ease: "power2.in",
    });
  }

  getCategory(): ItemCategory {
    return this.category;
  }

  getIsSelected(): boolean {
    return this.isSelected;
  }

  dispose(): void {
    gsap.killTweensOf(this.scale);
    gsap.killTweensOf(this);
    this.removeAllListeners();
    this.destroy();
  }
}
