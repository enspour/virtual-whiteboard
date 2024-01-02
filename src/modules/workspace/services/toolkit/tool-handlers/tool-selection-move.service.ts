import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { Drawing, Point, ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionMoveService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private prevPoint!: Point;

  constructor(
    private screenService: ScreenService,
    private painterService: PainterService,
    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.prevPoint = { x, y };

    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe((point) => this.handlePoint(point));
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;
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
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    const diffX = point.x - this.prevPoint.x;
    const diffY = point.y - this.prevPoint.y;

    for (let i = 0; i < drawings.length; i++) {
      this.updateDrawingCoordinates(drawings[i], diffX, diffY);
    }

    this.updateSelectionCoordinates(diffX, diffY);

    this.prevPoint = point;

    this.drawingsService.append(...drawings);

    this.painterService.paint();
  }

  private updateDrawingCoordinates(
    drawing: Drawing,
    diffX: number,
    diffY: number
  ) {
    const { coordinates } = drawing;

    coordinates.startX += diffX;
    coordinates.startY += diffY;
    coordinates.endX += diffX;
    coordinates.endY += diffY;

    if ("points" in drawing) {
      drawing.points = drawing.points.map((point) => ({
        x: point.x + diffX,
        y: point.y + diffY,
      }));
    }
  }

  private updateSelectionCoordinates(diffX: number, diffY: number) {
    const coordinates = this.drawingsOnSelectionService.Coordinates;

    this.drawingsOnSelectionService.setCoordinates({
      startX: coordinates.startX + diffX,
      startY: coordinates.startY + diffY,
      endX: coordinates.endX + diffX,
      endY: coordinates.endY + diffY,
    });
  }
}
