import { Container, Text } from "pixi.js";

export abstract class BaseText extends Container {
  protected textField!: Text;
  protected textValue: string;

  constructor(text: string) {
    super();
    this.textValue = text;
  }

  abstract createText(): void;

  setText(value: string): void {
    this.textValue = value;
    if (this.textField) {
      this.textField.text = value;
    }
  }

  getText(): string {
    return this.textValue;
  }

  dispose(): void {
    this.destroy();
  }
}
