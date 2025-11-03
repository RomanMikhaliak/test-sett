import { Scene, Object3D } from "three";
import { Container } from "pixi.js";

export interface IComponentFactory {
  createPixiComponent(...args: any[]): Container;
  createThreeComponent(...args: any[]): Object3D;
}

export abstract class ComponentFactory implements IComponentFactory {
  protected pixiContainer: Container;
  protected threeScene: Scene;

  constructor(pixiContainer: Container, threeScene: Scene) {
    this.pixiContainer = pixiContainer;
    this.threeScene = threeScene;
  }

  abstract createPixiComponent(...args: any[]): Container;
  abstract createThreeComponent(...args: any[]): Object3D;

  protected addToPixiContainer(component: Container): void {
    this.pixiContainer.addChild(component);
  }

  protected addToThreeScene(component: Object3D): void {
    this.threeScene.add(component);
  }

  protected removeFromPixiContainer(component: Container): void {
    this.pixiContainer.removeChild(component);
  }

  protected removeFromThreeScene(component: Object3D): void {
    this.threeScene.remove(component);
  }
}
