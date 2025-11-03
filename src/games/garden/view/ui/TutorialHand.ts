import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import type { App } from "@app";

export class TutorialHand extends Container {
  public hand!: Sprite;
  private inactivityTimer: gsap.core.Tween | null = null;
  private tapAnimation: gsap.core.Timeline | null = null;
  private isShowing: boolean = false;
  private app: App;

  constructor(app: App, texture: Texture) {
    super();
    this.app = app;
    if (texture !== null) this.createHand(texture);
    this.alpha = 0;
    this.visible = false;
    this.setupEvents();
  }

  setupEvents(): void {
    const eventBus = this.app.getEventBus();

    eventBus.add("tutorial:off", this.disableTutorial.bind(this));
    eventBus.add("tutorial:on", this.enableTutorial.bind(this));
  }

  private createHand(texture: Texture): void {
    this.hand = new Sprite(texture);
    this.hand.anchor.set(0.2, 0.1);
    this.hand.scale.set(0.3, -0.3);
    this.addChild(this.hand);
  }

  startInactivityTimer(): void {
    this.cancelInactivityTimer();
    this.inactivityTimer = gsap.delayedCall(4, () => {
      this.show();
    });
  }

  cancelInactivityTimer(): void {
    if (this.inactivityTimer) {
      this.inactivityTimer.kill();
      this.inactivityTimer = null;
    }
  }

  show(): void {
    if (this.isShowing) return;
    const eventBus = this.app.getEventBus();
    eventBus.dispatch("tutorial:update");

    this.isShowing = true;
    this.visible = true;

    gsap.killTweensOf(this);
    this.alpha = 0;
    gsap.to(this, {
      duration: 0.3,
      alpha: 1,
      onComplete: () => {
        this.startTapAnimation();
      },
    });
  }

  hide(): void {
    if (!this.isShowing) return;

    this.isShowing = false;
    this.stopTapAnimation();
    this.cancelInactivityTimer();

    gsap.killTweensOf(this);
    gsap.to(this, {
      duration: 0.2,
      alpha: 0,
      onComplete: () => {
        this.visible = false;
      },
    });
  }
  resetAlpha(alpha: number): void {
    gsap.killTweensOf(this);
    this.alpha = alpha;
  }

  public startTapAnimation(): void {
    this.stopTapAnimation();

    this.tapAnimation = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    this.tapAnimation
      .to(this.hand, {
        duration: 0.3,
        y: "+=15",
        ease: "power1.in",
      })
      .to(this.hand, {
        duration: 0.3,
        y: "-=15",
        ease: "power1.out",
      });
  }

  public stopTapAnimation(): void {
    if (this.tapAnimation) {
      this.tapAnimation.kill();
      this.tapAnimation = null;
    }
  }

  fadeIn(duration: number = 0.3): void {
    if (!this.visible) return;

    gsap.killTweensOf(this);
    gsap.to(this, {
      alpha: 1,
      duration,
      ease: "power2.out",
    });
  }

  turnOn(): void {
    this.show();
  }

  turnOff(): void {
    this.stopTapAnimation();
    this.cancelInactivityTimer();

    if (this.isShowing) {
      this.isShowing = false;
      gsap.killTweensOf(this);
      this.alpha = 0;
      this.visible = false;
    }
  }

  enableTutorial(): void {
    this.startInactivityTimer();
  }

  disableTutorial(): void {
    this.hide();
    this.cancelInactivityTimer();
  }

  onUserInteraction(): void {
    this.hide();
    this.startInactivityTimer();
  }

  destroy(): void {
    this.stopTapAnimation();
    this.cancelInactivityTimer();
    gsap.killTweensOf(this);
    super.destroy();
  }
}
