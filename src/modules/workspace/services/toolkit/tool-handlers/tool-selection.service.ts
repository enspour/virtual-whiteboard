import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";
import { SelectionService } from "@workspace/services/selection/selection.service";

import { isPointOnDrawing } from "@workspace/utils";

import { Point, ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private initialX!: number;
  private initialY!: number;

  constructor(
    private screenService: ScreenService,
    private painterService: PainterService,
    private selectionService: SelectionService,
    private drawingsOnScreenService: DrawingsOnScreenService,
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

    this.initialX = x;
    this.initialY = y;

    this.selectionService.select({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });

    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe((point) => this.handlePoint(point));
  }

  end(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.selectionService.removeSelection();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    if (x - this.initialX === 0 && y - this.initialY === 0) {
      this.handleClick(x, y);
    }

    this.painterService.paint();

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
    const coordinates = this.selectionService.Coordinates;

    if (this.initialX < point.x) {
      coordinates.startX = this.initialX;
      coordinates.endX = point.x;
    } else {
      coordinates.startX = point.x;
      coordinates.endX = this.initialX;
    }

    if (this.initialY < point.y) {
      coordinates.startY = this.initialY;
      coordinates.endY = point.y;
    } else {
      coordinates.startY = point.y;
      coordinates.endY = this.initialY;
    }

    this.selectionService.select(coordinates);

    this.painterService.paint();
  }

  private handleClick(x: number, y: number) {
    const point = { x, y };

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = drawings.find((drawing) =>
      isPointOnDrawing(point, drawing)
    );

    if (drawing) {
      this.drawingsOnSelectionService.add(drawing);
    }
  }
}
