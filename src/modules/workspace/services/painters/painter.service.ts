import { Injectable } from "@angular/core";

import {
  BoardPainterService,
  DrawingsPainterService,
  ScreenService,
  SelectionPainterService,
} from "@workspace/services";

import { Painter } from "@workspace/interfaces";

@Injectable()
export class PainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private requestAnimationFrameId: number = 0;

  constructor(
    private screenService: ScreenService,
    private boardPainterService: BoardPainterService,
    private drawingsPainterService: DrawingsPainterService,
    private selectionPainterService: SelectionPainterService
  ) {}

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;

    this.boardPainterService.setContext(context);
    this.drawingsPainterService.setContext(context);
    this.selectionPainterService.setContext(context);
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
    this.selectionPainterService.paint();
  }
}
