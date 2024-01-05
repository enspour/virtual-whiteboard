import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { ScreenService, ToolkitService } from "@workspace/services";

import { Point, ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolHandService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private prevPoint!: Point;

  constructor(
    private toolkitService: ToolkitService,
    private screenService: ScreenService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolkitService.setExecutedTool("hand");

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scale = this.screenService.Scale;

    const x = e.clientX / scale;
    const y = e.clientY / scale;

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

    this.toolkitService.setExecutedTool("");

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

    const x = e.clientX / scale;
    const y = e.clientY / scale;

    const point = { x, y };

    this.points$.next(point);
  }

  private handlePoint(point: Point) {
    const diffX = point.x - this.prevPoint.x;
    const diffY = point.y - this.prevPoint.y;

    const scroll = this.screenService.Scroll;

    this.screenService.setScroll({
      x: scroll.x + diffX,
      y: scroll.y + diffY,
    });

    this.prevPoint = point;
  }
}
