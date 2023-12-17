import { Injectable } from "@angular/core";

import { Painter } from "@workspace/interfaces";

import { ScreenService } from "../screen/screen.service";
import { BoardPainterService } from "./board-painter.service";
import { DrawingsPainterService } from "./drawings-painter.service";

@Injectable()
export class PainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private requestAnimationFrameId: number = 0;

  constructor(
    private screenService: ScreenService,
    private boardPainterService: BoardPainterService,
    private drawingsPainterService: DrawingsPainterService
  ) {}

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;

    this.boardPainterService.setContext(context);
    this.drawingsPainterService.setContext(context);
  }

  paint() {
    cancelAnimationFrame(this.requestAnimationFrameId);

    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this._paint();
    });
  }

  private _paint() {
    if (!this.context) {
      return;
    }

    const sizes = this.screenService.Sizes;

    const { width, height } = sizes;

    this.context.clearRect(0, 0, width, height);

    this.boardPainterService.paint();
    this.drawingsPainterService.paint();
  }
}
