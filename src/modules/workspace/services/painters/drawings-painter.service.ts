import { Injectable, inject } from "@angular/core";

import { Observable, takeUntil } from "rxjs";

import {
  Drawing,
  DrawingPainter,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
} from "@workspace/interfaces";
import { Painter } from "@workspace/interfaces";

import { DestroyService } from "../destroy.service";
import { DrawingsService } from "../drawings/drawings.service";
import { DrawingArrowPainter } from "./drawings/drawing-arrow.painter";
import { DrawingBrushPainter } from "./drawings/drawing-brush.painter";
import { DrawingEllipsePainter } from "./drawings/drawing-ellipse.painter";
import { DrawingRectanglePainter } from "./drawings/drawing-rectangle.painter";

@Injectable()
export class DrawingsPainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private drawings!: Drawing[];
  private painters!: Record<Drawing["type"], DrawingPainter>;

  private destroy$: Observable<void> = inject(DestroyService);

  constructor(private drawingsService: DrawingsService) {
    this.drawingsService.drawings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((drawings) => (this.drawings = drawings));
  }

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

    for (const drawing of this.drawings) {
      if (this.isContains(drawing, scroll, sizes, scale)) {
        this.painters[drawing.type].paint(drawing, scroll, sizes, scale);
      }
    }
  }

  private isContains(
    drawing: Drawing,
    scroll: ScreenScroll,
    sizes: ScreenSizes,
    scale: ScreenScale
  ) {
    const startX = drawing.coordinates.startX + scroll.x;
    const startY = drawing.coordinates.startY + scroll.y;

    const endX = drawing.coordinates.endX + scroll.x;
    const endY = drawing.coordinates.endY + scroll.y;

    if (
      startX > sizes.width / scale ||
      startY > sizes.height / scale ||
      endX < 0 ||
      endY < 0
    ) {
      return false;
    }

    return true;
  }
}
