import { Injectable } from "@angular/core";

import {
  DrawingArrowPainter,
  DrawingBrushPainter,
  DrawingEllipsePainter,
  DrawingRectanglePainter,
  DrawingTextPainter,
  DrawingsOnScreenService,
  DrawingsTrashService,
  ScreenService,
} from "@workspace/services";

import { Drawing, DrawingPainter, Painter } from "@workspace/interfaces";

@Injectable()
export class DrawingsPainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private painters!: Record<Drawing["type"], DrawingPainter>;

  constructor(
    private screenService: ScreenService,
    private drawingsTrashService: DrawingsTrashService,
    private drawingsOnScreenService: DrawingsOnScreenService
  ) {}

  public setContext(context: CanvasRenderingContext2D): void {
    this.context = context;

    this.painters = {
      brush: new DrawingBrushPainter(context),
      arrow: new DrawingArrowPainter(context),
      ellipse: new DrawingEllipsePainter(context),
      rectangle: new DrawingRectanglePainter(context),
      text: new DrawingTextPainter(context),
    };
  }

  public paint() {
    if (!this.context) {
      return;
    }

    const scroll = this.screenService.Scroll;
    const sizes = this.screenService.Sizes;
    const scale = this.screenService.Scale;

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    for (const drawing of drawings) {
      const inTrash = this.drawingsTrashService.has(drawing);

      this.painters[drawing.type].paint(drawing, scroll, sizes, scale, inTrash);
    }
  }
}
