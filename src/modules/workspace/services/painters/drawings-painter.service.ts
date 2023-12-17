import { Injectable } from "@angular/core";

import { Drawing, DrawingPainter } from "@workspace/interfaces";
import { Painter } from "@workspace/interfaces";

import { DrawingsOnScreenService } from "../drawings/drawings-on-screen.service";
import { DrawingsTrashService } from "../drawings/drawings-trash.service";
import { ScreenService } from "../screen/screen.service";
import { DrawingArrowPainter } from "./drawings/drawing-arrow.painter";
import { DrawingBrushPainter } from "./drawings/drawing-brush.painter";
import { DrawingEllipsePainter } from "./drawings/drawing-ellipse.painter";
import { DrawingRectanglePainter } from "./drawings/drawing-rectangle.painter";

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
