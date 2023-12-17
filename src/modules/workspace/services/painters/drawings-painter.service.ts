import { Injectable } from "@angular/core";

import {
  Drawing,
  DrawingPainter,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";
import { Painter } from "@workspace/interfaces";

import { DrawingsOnScreenService } from "../drawings/drawings-on-screen.service";
import { DrawingArrowPainter } from "./drawings/drawing-arrow.painter";
import { DrawingBrushPainter } from "./drawings/drawing-brush.painter";
import { DrawingEllipsePainter } from "./drawings/drawing-ellipse.painter";
import { DrawingRectanglePainter } from "./drawings/drawing-rectangle.painter";

@Injectable()
export class DrawingsPainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private painters!: Record<Drawing["type"], DrawingPainter>;

  constructor(private drawingsOnScreenService: DrawingsOnScreenService) {}

  public setContext(context: CanvasRenderingContext2D): void {
    this.context = context;

    this.painters = {
      brush: new DrawingBrushPainter(context),
      arrow: new DrawingArrowPainter(context),
      ellipse: new DrawingEllipsePainter(context),
      rectangle: new DrawingRectanglePainter(context),
    };
  }

  public paint(scroll: ScreenScroll, sizes: ScreenSizes, scale: ScreenScale) {
    if (!this.context) {
      return;
    }

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    for (const drawing of drawings) {
      this.painters[drawing.type].paint(drawing, scroll, sizes, scale);
    }
  }
}
