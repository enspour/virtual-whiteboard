import { Injectable } from "@angular/core";

import { Subject, takeUntil, throttleTime } from "rxjs";

import { Point, ToolHandler } from "@workspace/interfaces";

import { ScreenService } from "../../screen.service";

@Injectable()
export class ToolHandService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private prevPoint?: Point;

  constructor(private screenService: ScreenService) {}

  start(): void {
    this.isHandling = true;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    this.prevPoint = undefined;

    this.points$
      .pipe(takeUntil(this.destroy$), throttleTime(10))
      .subscribe((point) => {
        if (!this.prevPoint) {
          this.prevPoint = point;
        }

        const diff = {
          x: point.x - this.prevPoint.x,
          y: point.y - this.prevPoint.y,
        };

        const scroll = this.screenService.Scroll;

        this.screenService.setScroll({
          x: scroll.x + diff.x,
          y: scroll.y + diff.y,
        });

        this.prevPoint = point;
      });
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.destroy$.next();
    this.destroy$.complete();
  }

  process(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    const scale = this.screenService.Scale;

    const x = e.clientX / scale;
    const y = e.clientY / scale;

    this.points$.next({ x, y });
  }
}
