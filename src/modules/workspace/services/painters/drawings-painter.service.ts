import { Injectable } from "@angular/core";

import {
  DrawingArrowPainter,
  DrawingBrushPainter,
  DrawingEllipsePainter,
  DrawingRectanglePainter,
  DrawingTextPainter,
  DrawingsOnEditService,
  DrawingsOnScreenService,
  DrawingsOnTrashService,
  ScreenService,
} from "@workspace/services";

import { Drawing, DrawingPainter, Painter } from "@workspace/interfaces";

@Injectable()
export class DrawingsPainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private painters!: Record<Drawing["type"], DrawingPainter>;

  constructor(
    private screenService: ScreenService,
    private drawingsOnEditService: DrawingsOnEditService,
    private drawingsOnTrashService: DrawingsOnTrashService,
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
      if (this.drawingsOnEditService.has(drawing)) {
        continue;
      }

      const inTrash = this.drawingsOnTrashService.has(drawing);

      this.painters[drawing.type].paint(drawing, scroll, sizes, scale, inTrash);
    }
  }
}
