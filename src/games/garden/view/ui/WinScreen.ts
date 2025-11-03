import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";

import type { App } from "@app";
import { EventBus, BasePanel } from "@core/index";
import { UIPositionHelper } from "@utils/index";
import { GARDEN_CONFIG } from "../../config";

export class WinScreen extends BasePanel {
  private app: App;
  private eventBus: EventBus;

  private _width: number;
  private _height: number;

  private titleText!: Text;
  private messageText!: Text;

  private ctaButton!: Container;
  private replayButton!: Container;

  private toggleLightingButton!: Container;
  private toggleLightingIcon!: Text;

  constructor(app: App) {
    super();
    this.app = app;
    this.eventBus = app.getEventBus();
    this.visible = false;

    const config = GARDEN_CONFIG.garden.loading;
    this._width = config.props["landscape"].width;
    this._height = config.props["landscape"].height;

    this.eventBus.add(
      "lighting:mode-changed",
      this.updateLightingIcon.bind(this)
    );
  }

  private updateLightingIcon(
    mode: "morning" | "day" | "evening" | "night"
  ): void {
    if (!this.toggleLightingIcon) return;

    const icons = {
      morning: "🌅",
      day: "☀️",
      evening: "🌇",
      night: "🌙",
    };

    this.toggleLightingIcon.text = icons[mode];
  }

  public setLightingMode(mode: "morning" | "day" | "evening" | "night"): void {
    this.updateLightingIcon(mode);
  }

  public init(): void {
    this.createTexts();
    this.createButtons();
    this.setEvents();
    this.layout();
  }

  createBackground(): void {}

  private createTexts(): void {
    this.titleText = new Text({
      text: "🎉 Congratulations! 🎉",
      style: {
        fontFamily: "Arial",
        fontSize: 64,
        fill: 0xffd700,
        fontWeight: "bold",
        dropShadow: {
          alpha: 0.8,
          angle: Math.PI / 6,
          blur: 4,
          color: 0x000000,
          distance: 6,
        },
      },
    });
    this.titleText.anchor.set(0.5);

    this.messageText = new Text({
      text: "You completed all levels!\nYour garden looks beautiful!",
      style: {
        fontFamily: "Arial Rounded MT Bold, Nunito, Arial, sans-serif",
        fontSize: 35,
        fontWeight: "600",
        fill: 0xffffff,
        letterSpacing: 1,
        align: "center",
      },
    });
    this.messageText.anchor.set(0.5);
  }

  private createButtons(): void {
    this.ctaButton = this.createButton(
      "Download Full Game",
      0x7cb342,
      0x5a8f2f
    );
    this.replayButton = this.createButton("Play Again", 0x4caf50, 0x388e3c);
    this.toggleLightingButton = this.createRoundToggleButton();
  }

  private createRoundToggleButton(): Container {
    const container = new Container();
    const buttonSize = 80;

    const buttonBg = new Graphics();
    buttonBg.circle(0, 0, buttonSize / 2).fill({ color: 0xffffff, alpha: 0.6 });
    buttonBg.stroke({ color: 0xffffff, width: 4, alignment: 0.5 });
    container.addChild(buttonBg);

    this.toggleLightingIcon = new Text({
      text: "🌙",
      style: {
        fontFamily: "Arial",
        fontSize: 48,
        align: "center",
      },
    });
    this.toggleLightingIcon.anchor.set(0.5);
    container.addChild(this.toggleLightingIcon);

    container.eventMode = "static";
    container.cursor = "pointer";

    container.on("pointerover", () => {
      gsap.to(container.scale, {
        duration: 0.2,
        x: 1.1,
        y: 1.1,
        ease: "power2.out",
      });
      buttonBg.tint = 0xeeeeee;
    });

    container.on("pointerout", () => {
      gsap.to(container.scale, { duration: 0.2, x: 1, y: 1 });
      buttonBg.tint = 0xffffff;
    });

    return container;
  }

  private createButton(
    text: string,
    color: number,
    hoverColor: number
  ): Container {
    const config = GARDEN_CONFIG.garden.ui.winScreen;
    const container = new Container();

    const buttonBg = new Graphics();
    buttonBg.roundRect(0, 0, config.buttonWidth, config.buttonHeight, 15).fill({
      color,
    });
    buttonBg.stroke({ color: 0xffffff, width: 3, alpha: 0.8, alignment: 0.5 });
    container.addChild(buttonBg);

    const label = new Text({
      text,
      style: {
        fontFamily: "Arial",
        fontSize: 28,
        fill: 0xffffff,
        fontWeight: "bold",
      },
    });
    label.anchor.set(0.5);
    label.position.set(config.buttonWidth / 2, config.buttonHeight / 2);
    container.addChild(label);

    container.eventMode = "static";
    container.cursor = "pointer";

    container.on("pointerover", () => {
      gsap.to(container.scale, {
        duration: 0.2,
        x: 1.05,
        y: 1.05,
        ease: "power2.out",
      });
      buttonBg.tint = hoverColor;
    });
    container.on("pointerout", () => {
      gsap.to(container.scale, { duration: 0.2, x: 1, y: 1 });
      buttonBg.tint = 0xffffff;
    });
    container.pivot.set(container.width / 2, container.height / 2);

    return container;
  }

  private setEvents(): void {
    this.ctaButton.on("pointerdown", () => this.onCTAClick());
    this.replayButton.on("pointerdown", () => this.onReplayClick());
    this.toggleLightingButton.on("pointerdown", () =>
      this.onToggleLightingClick()
    );
  }

  private onCTAClick(): void {
    this.eventBus.dispatch("game:download-cta");
  }

  private onReplayClick(): void {
    this.eventBus.dispatch("game:replay");
  }

  private onToggleLightingClick(): void {
    this.eventBus.dispatch("lighting:toggle");
  }

  public async show(): Promise<void> {
    this.visible = true;
    this.alpha = 0;

    this.titleText.scale.set(0);
    this.messageText.scale.set(0);
    this.ctaButton.scale.set(0);
    this.replayButton.scale.set(0);
    this.toggleLightingButton.scale.set(0);

    const audio = this.app.getAudioManager();
    if (audio) {
      audio.playSound("popup", 1);
    }

    return new Promise((resolve) => {
      gsap.to(this, {
        duration: 0.3,
        alpha: 1,
        ease: "power2.out",
      });

      gsap.to(this.titleText.scale, {
        duration: 0.6,
        x: 1,
        y: 1,
        delay: 0.3,
        ease: "back.out(1.7)",
      });

      gsap.to(this.messageText.scale, {
        duration: 0.5,
        x: 1,
        y: 1,
        delay: 0.6,
        ease: "back.out(1.5)",
      });

      gsap.to(this.ctaButton.scale, {
        duration: 0.5,
        x: 1,
        y: 1,
        delay: 0.9,
        ease: "back.out(1.5)",
      });

      gsap.to(this.replayButton.scale, {
        duration: 0.5,
        x: 1,
        y: 1,
        delay: 1.1,
        ease: "back.out(1.5)",
      });

      gsap.to(this.toggleLightingButton.scale, {
        duration: 0.5,
        x: 1,
        y: 1,
        delay: 1.3,
        ease: "back.out(1.5)",
        onComplete: () => resolve(),
      });

      gsap.to(this.titleText.scale, {
        duration: 0.8,
        x: 1.1,
        y: 1.1,
        delay: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });
  }

  public async hide(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this, {
        duration: 0.3,
        alpha: 0,
        ease: "power2.in",
        onComplete: () => {
          this.visible = false;
          gsap.killTweensOf(this.titleText.scale);
          resolve();
        },
      });
    });
  }

  public setMessage(message: string): void {
    this.messageText.text = message;
  }

  public updateOrientation(
    orientation: "landscape" | "portrait",
    containerWidth: number,
    containerHeight: number
  ): void {
    const config = GARDEN_CONFIG.garden.ui.winScreen;
    const posConfig =
      orientation === "landscape" ? config.landscape : config.portrait;

    const titlePos = UIPositionHelper.calculatePosition(
      posConfig.title,
      containerWidth,
      containerHeight,
      this.titleText.width,
      this.titleText.height
    );
    this.titleText.position.set(titlePos.x, titlePos.y);

    const messagePos = UIPositionHelper.calculatePosition(
      posConfig.message,
      containerWidth,
      containerHeight,
      this.messageText.width,
      this.messageText.height
    );
    this.messageText.position.set(messagePos.x, messagePos.y);

    const ctaPos = UIPositionHelper.calculatePosition(
      posConfig.ctaButton,
      containerWidth,
      containerHeight,
      config.buttonWidth,
      config.buttonHeight
    );
    this.ctaButton.position.set(ctaPos.x, ctaPos.y);

    const replayPos = UIPositionHelper.calculatePosition(
      posConfig.replayButton,
      containerWidth,
      containerHeight,
      config.buttonWidth,
      config.buttonHeight
    );
    this.replayButton.position.set(replayPos.x, replayPos.y);

    const togglePos = UIPositionHelper.calculatePosition(
      posConfig.toggleButton,
      containerWidth,
      containerHeight,
      80,
      80
    );
    this.toggleLightingButton.position.set(togglePos.x, togglePos.y);
  }

  layout(): void {
    this.addChild(this.titleText);
    this.addChild(this.messageText);
    this.addChild(this.ctaButton);
    this.addChild(this.replayButton);
    this.addChild(this.toggleLightingButton);
  }
}
