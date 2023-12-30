import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsTrashService } from "@workspace/services/drawings/drawings-trash.service";
import { RemoveDrawingsCommand } from "@workspace/services/history/commands/remove-drawings.command";
import { HistoryService } from "@workspace/services/history/history.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { distance } from "@workspace/utils";

import {
  Drawing,
  DrawingArrow,
  DrawingBrush,
  DrawingEllipse,
  DrawingRectangle,
  Point,
  ToolHandler,
} from "@workspace/interfaces";

@Injectable()
export class ToolEraserService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  constructor(
    private injector: Injector,

    private screenService: ScreenService,
    private painterService: PainterService,
    private drawingsTrashService: DrawingsTrashService,
    private drawingsOnScreenServices: DrawingsOnScreenService,
    private historyService: HistoryService
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

    const drawings = this.drawingsTrashService.Trash;

    if (drawings.length) {
      const command = new RemoveDrawingsCommand(drawings, this.injector);
      this.historyService.add(command);
    }

    this.drawingsTrashService.clear().then(() => this.painterService.paint());

    this.destroy$.next();
    this.destroy$.complete();
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
          return this.isPointOnDrawingWithPoints(point, drawing);
        case "rectangle":
          return this.isPointOnRectangleDrawing(point, drawing);
        case "ellipse":
          return this.isPointOnEllipseDrawing(point, drawing);
        case "arrow":
          return this.isPointOnDrawingWithPoints(point, drawing);
      }
    }

    return false;
  }

  private isPointOnDrawingWithPoints(
    point: Point,
    drawing: DrawingBrush | DrawingArrow
  ): boolean {
    const { points } = drawing;

    for (let i = 0; i < points.length - 1; i++) {
      const A = points[i];
      const B = points[i + 1];

      if (distance(A, point) + distance(point, B) <= distance(A, B) + 1) {
        return true;
      }
    }

    return false;
  }

  private isPointOnRectangleDrawing(
    point: Point,
    drawing: DrawingRectangle
  ): boolean {
    const { startX, startY, endX, endY } = drawing.coordinates;

    const leftUpCorner = {
      x: startX,
      y: startY,
    };

    const rightUpCorner = {
      x: endX,
      y: startY,
    };

    const rightDownCorner = {
      x: endX,
      y: endY,
    };

    const leftDownCorner = {
      x: startX,
      y: endY,
    };

    if (
      distance(leftUpCorner, point) + distance(point, rightUpCorner) <=
        distance(leftUpCorner, rightUpCorner) + 1 ||
      distance(rightUpCorner, point) + distance(point, rightDownCorner) <=
        distance(rightUpCorner, rightDownCorner) + 1 ||
      distance(rightDownCorner, point) + distance(point, leftDownCorner) <=
        distance(rightDownCorner, leftDownCorner) + 1 ||
      distance(leftDownCorner, point) + distance(point, leftUpCorner) <=
        distance(leftDownCorner, leftUpCorner) + 1
    ) {
      return true;
    }

    return false;
  }

  private isPointOnEllipseDrawing(
    point: Point,
    drawing: DrawingEllipse
  ): boolean {
    const radiusX = drawing.width / 2;
    const radiusY = drawing.height / 2;

    const center = {
      x: drawing.coordinates.startX + radiusX,
      y: drawing.coordinates.startY + radiusY,
    };

    const p =
      Math.pow(point.x - center.x, 2) / Math.pow(radiusX, 2) +
      Math.pow(point.y - center.y, 2) / Math.pow(radiusY, 2);

    return 0.95 <= p && p <= 1.05;
  }
}
