export type PositionValue = number | 'center' | 'left' | 'right' | 'top' | 'bottom';

export interface PositionConfig {
  x: PositionValue | (string & {});
  y: PositionValue | (string & {});
  offsetX?: number;
  offsetY?: number;
}

export class UIPositionHelper {
  static getOrientation(width: number, height: number): 'landscape' | 'portrait' {
    return width > height ? 'landscape' : 'portrait';
  }

  static calculatePosition(
    config: PositionConfig,
    containerWidth: number,
    containerHeight: number,
    elementWidth: number = 0,
    elementHeight: number = 0
  ): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (typeof config.x === 'number') {
      x = config.x;
    } else if (config.x === 'center') {
      x = (containerWidth - elementWidth) / 2;
    } else if (config.x === 'right') {
      x = containerWidth - elementWidth;
    } else if (config.x === 'left') {
      x = 0;
    }

    if (typeof config.y === 'number') {
      y = config.y;
    } else if (config.y === 'center') {
      y = (containerHeight - elementHeight) / 2;
    } else if (config.y === 'bottom') {
      y = containerHeight - elementHeight;
    } else if (config.y === 'top') {
      y = 0;
    }

    x += config.offsetX || 0;
    y += config.offsetY || 0;

    return { x, y };
  }
}
