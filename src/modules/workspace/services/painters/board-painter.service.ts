import { Injectable } from "@angular/core";

import { Painter } from "@workspace/interfaces";

import { PAINTER_BOARD_STEP } from "@workspace/constants";

import { ScreenService } from "../screen/screen.service";

@Injectable()
export class BoardPainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  constructor(private screenService: ScreenService) {}

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  paint() {
    if (!this.context) {
      return;
    }

    const scroll = this.screenService.Scroll;
    const sizes = this.screenService.Sizes;
    const scale = this.screenService.Scale;

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
