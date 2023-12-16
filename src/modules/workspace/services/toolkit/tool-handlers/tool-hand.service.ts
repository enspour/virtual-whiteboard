import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { Point, ToolHandler } from "@workspace/interfaces";

import { ScreenService } from "../../screen/screen.service";

@Injectable()
export class ToolHandService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private prevPoint?: Point;

  constructor(private screenService: ScreenService) {}

  start(): null {
    this.isHandling = true;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    this.prevPoint = undefined;

    this.points$.pipe(takeUntil(this.destroy$)).subscribe((point) => {
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

    return null;
  }

  end(): null {
    if (!this.isHandling) {
      return null;
    }

    this.isHandling = false;

    this.destroy$.next();
    this.destroy$.complete();

    return null;
  }

  process(e: MouseEvent): null {
    if (!this.isHandling) {
      return null;
    }

    const scale = this.screenService.Scale;

    const x = e.clientX / scale;
    const y = e.clientY / scale;

    this.points$.next({ x, y });

    return null;
  }
}
