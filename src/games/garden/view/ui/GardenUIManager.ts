import { Container, Texture } from "pixi.js";

import type { App } from "@app";
import { BaseUIManager } from "@core/index";
import { UIPositionHelper } from "@utils/index";
import { getLevelConfig } from "../../config";

import { HUD } from "./HUD";
import { WinScreen } from "./WinScreen";
import { ItemPanel } from "./ItemPanel";
import { TutorialHand } from "./TutorialHand";
import gsap from "gsap";

export class GardenUIManager extends BaseUIManager {
  private app: App;

  protected container: Container;
  private hud!: HUD;
  private itemPanel!: ItemPanel;
  private winScreen!: WinScreen;
  private tutorialHand!: TutorialHand;
  private tutorialHandUpdate: boolean = false;

  constructor(app: App) {
    super(app.getPixiRenderer(), app.getEventBus());

    this.app = app;
    this.container = new Container();
    app.getPixiStage().addChild(this.container);

    this.eventBus.add("resize", this.handleResize.bind(this));
    this.eventBus.add("ui:show-level", this.onShowLevel.bind(this));
    this.eventBus.add("ui:hide-level", this.onHideLevel.bind(this));
    this.eventBus.add("model:score-updated", this.onScoreUpdated.bind(this));
    this.eventBus.add(
      "model:progress-updated",
      this.onProgressUpdated.bind(this)
    );
    this.eventBus.add("ui:element-clicked", this.onUserInteraction.bind(this));
    this.eventBus.add(
      "tutorial:update",
      this.updateTutorialHandPosition.bind(this)
    );
  }

  init(): void {
    this.hud = new HUD(this.app);
    this.hud.createBackground();
    this.hud.init();
    this.container.addChild(this.hud);

    this.itemPanel = new ItemPanel(this.app);
    this.itemPanel.createBackground();
    this.container.addChild(this.itemPanel);

    this.winScreen = new WinScreen(this.app);
    this.winScreen.createBackground();
    this.winScreen.init();
    this.container.addChild(this.winScreen);

    const handTexture = this.app.getAssetLoader().getTexture("hand") as Texture;
    this.tutorialHand = new TutorialHand(this.app, handTexture);
    this.container.addChild(this.tutorialHand);
  }

  update(_deltaTime: number): void {}

  getItemPanel(): ItemPanel {
    return this.itemPanel;
  }

  getHUD(): HUD {
    return this.hud;
  }

  getWinScreen(): WinScreen {
    return this.winScreen;
  }

  getEventBus() {
    return this.eventBus;
  }

  onResize(width: number, height: number): void {
    const orientation = UIPositionHelper.getOrientation(width, height);

    this.hud.updateOrientation(orientation, width, height);
    this.itemPanel.updateOrientation(orientation, width, height);
    this.winScreen.updateOrientation(orientation, width, height);
    gsap.delayedCall(0.05, () => {
      this.updateTutorialHandPosition();
    });
  }

  private handleResize(data: { width: number; height: number }): void {
    const { width, height } = data;
    this.onResize(width, height);
  }

  private onShowLevel(levelId: number): void {
    const levelConfig = getLevelConfig(levelId);
    if (!levelConfig) return;

    this.itemPanel.setAvailablePlacements(levelConfig.placements);
    this.itemPanel.show();

    this.hud.updateLevel(levelId);
    this.hud.updateProgress(0, levelConfig.goalItems);

    if (levelConfig.progressBarColors) {
      this.hud.updateProgressBarColors(
        levelConfig.progressBarColors.background,
        levelConfig.progressBarColors.foreground
      );
    }
    this.hud.show();

    if (this.tutorialHand) {
      gsap.delayedCall(1, () => {
        this.updateTutorialHandPosition();
      });
    }
  }

  private onHideLevel(): void {
    this.hud.hide();

    if (this.tutorialHand) {
      this.tutorialHand.hide();
    }
  }

  private onScoreUpdated(score: number): void {
    this.hud.updateScore(score);
  }

  private onProgressUpdated(data: { current: number; goal: number }): void {
    this.hud.updateProgress(data.current, data.goal);
  }

  private onUserInteraction(): void {
    if (this.tutorialHand) {
      this.tutorialHand.onUserInteraction();
    }
  }

  private updateTutorialHandPosition(): void {
    if (this.tutorialHandUpdate) {
      return;
    }
    this.tutorialHandUpdate = true;

    const updatePosition = () => {
      if (!this.tutorialHand) {
        this.tutorialHandUpdate = false;
        return;
      }

      const buttonPos = this.itemPanel.getFirstVisibleButtonPosition();

      if (buttonPos && buttonPos !== null) {
        if (!this.tutorialHand) return;

        const local = this.tutorialHand.toLocal(buttonPos);
        this.tutorialHand.stopTapAnimation();

        this.tutorialHand.hand.x = local.x - 65;
        this.tutorialHand.hand.y = local.y - 120;
        this.tutorialHand.startTapAnimation();
      } else {
        this.hide();
      }
      this.tutorialHandUpdate = false;
    };

    updatePosition();
  }
}
