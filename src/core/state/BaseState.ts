export abstract class BaseState {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract enter(): void | Promise<void>;
  abstract update(deltaTime: number): void;
  abstract exit(): void;

  getName(): string {
    return this.name;
  }
}
