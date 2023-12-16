import { Injectable } from "@angular/core";

import { ScreenScale, ScreenScroll, ScreenSizes } from "@workspace/interfaces";
import { Painter } from "@workspace/interfaces";

import { BoardPainterService } from "./board-painter.service";

@Injectable()
export class PainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  constructor(private boardPainterService: BoardPainterService) {}

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;

    this.boardPainterService.setContext(context);
  }

  paint(scroll: ScreenScroll, sizes: ScreenSizes, scale: ScreenScale) {
    if (!this.context) {
      return;
    }

    const { width, height } = sizes;

    this.context.clearRect(0, 0, width, height);

    this.boardPainterService.paint(scroll, sizes, scale);
  }
}
