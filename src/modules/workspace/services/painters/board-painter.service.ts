import { Injectable } from "@angular/core";

import { ScreenScale, ScreenScroll, ScreenSizes } from "@workspace/interfaces";
import { Painter } from "@workspace/interfaces";

import { PAINTER_BOARD_STEP } from "@workspace/constants/painter.constants";

@Injectable()
export class BoardPainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  paint(scroll: ScreenScroll, sizes: ScreenSizes, scale: ScreenScale) {
    if (!this.context) {
      return;
    }

    const { width, height } = sizes;

    const step = PAINTER_BOARD_STEP * scale;

    this.context.beginPath();

    this.context.lineWidth = 1 * scale;
    this.context.strokeStyle = "#eee";

    const startX = Math.floor(scroll.x % step);
    const startY = Math.floor(scroll.y % step);

    for (let x = startX; x < width; x += step) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, height);
    }

    for (let y = startY; y < height; y += step) {
      this.context.moveTo(0, y);
      this.context.lineTo(width, y);
    }

    this.context.stroke();

    this.context.closePath();
  }
}
