import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsTrashService } from "@workspace/services/drawings/drawings-trash.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { distance } from "@workspace/utils";

import {
  Drawing,
  DrawingBrush,
  Point,
  ToolHandler,
} from "@workspace/interfaces";

@Injectable()
export class ToolEraserService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  constructor(
    private screenService: ScreenService,
    private painterService: PainterService,
    private drawingsTrashService: DrawingsTrashService,
    private drawingsOnScreenServices: DrawingsOnScreenService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe((point) => this.handlePoint(point));

    this.nextPoint(e);
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.destroy$.next();
    this.destroy$.complete();

    this.drawingsTrashService.clear().then(() => this.painterService.paint());
  }

  process(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.nextPoint(e);
  }

  private nextPoint(e: MouseEvent) {
    const scale = this.screenService.Scale;
    const scroll = this.screenService.Scroll;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    this.points$.next(point);
  }

  private handlePoint(point: Point) {
    const drawings = this.drawingsOnScreenServices.DrawingsOnScreen;

    for (const drawing of drawings) {
      if (this.isPointOnDrawing(point, drawing)) {
        this.drawingsTrashService.append(drawing);
      }
    }

    this.painterService.paint();
  }

  private isPointOnDrawing(point: Point, drawing: Drawing): boolean {
    const { startX, endX, startY, endY } = drawing.coordinates;

    if (
      startX <= point.x &&
      endX >= point.x &&
      startY <= point.y &&
      endY >= point.y
    ) {
      switch (drawing.type) {
        case "brush":
          return this.isPointOnBrushDrawing(point, drawing);
      }

      return true;
    }

    return false;
  }

  private isPointOnBrushDrawing(point: Point, drawing: DrawingBrush): boolean {
    const { points } = drawing;

    for (let i = 0; i < points.length - 1; i++) {
      const A = points[i];
      const B = points[i + 1];

      if (
        distance(A, point) + distance(point, B) <=
        distance(A, B) + drawing.strokeWidth / 2
      ) {
        return true;
      }
    }

    return false;
  }
}
