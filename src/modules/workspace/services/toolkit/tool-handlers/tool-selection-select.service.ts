import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";
import { SelectionService } from "@workspace/services/selection/selection.service";

import { Point, ToolHandler } from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolSelectionSelectService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private initialX!: number;
  private initialY!: number;

  constructor(
    private toolkitService: ToolkitService,
    private screenService: ScreenService,
    private selectionService: SelectionService,
    private painterService: PainterService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolkitService.setExecutedTool("selection-select");

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

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.toolkitService.setExecutedTool("");

    this.selectionService.removeSelection();

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
}
