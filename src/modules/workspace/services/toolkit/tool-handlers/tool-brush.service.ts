import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { nanoid } from "nanoid";

import { ScreenService } from "@workspace/services/screen/screen.service";

import { handleAddedDrawingPoint } from "@workspace/utils";

import {
  Drawing,
  DrawingBrush,
  Point,
  ToolBrush,
  ToolHandler,
} from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolBrushService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolBrush;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private drawing!: DrawingBrush;

  constructor(
    private screenService: ScreenService,
    private toolkitService: ToolkitService
  ) {}

  start(e: MouseEvent): Drawing | null {
    this.isHandling = true;

    this.tool = this.toolkitService.ExecutedTool! as ToolBrush;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const sizes = this.screenService.Sizes;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale;
    const y = e.clientY / scale;

    this.drawing = {
      id: nanoid(),
      type: "brush",
      angel: 0,
      coordinates: {
        startX: x - scroll.x,
        endX: x - scroll.x,
        startY: y - scroll.y,
        endY: y - scroll.y,
      },
      width: 0,
      height: 0,
      points: [],
      strokeColor: this.tool.strokeColor,
      strokeWidth: this.tool.strokeWidth,
    };

    this.points$.pipe(takeUntil(this.destroy$)).subscribe((point) => {
      const scroll = this.screenService.Scroll;

      this.drawing.points.push({
        x: point.x - scroll.x,
        y: point.y - scroll.y,
      });

      handleAddedDrawingPoint(this.drawing, point, scroll);
    });

    return this.drawing;
  }

  end(): Drawing | null {
    if (!this.isHandling) {
      return null;
    }

    this.isHandling = false;

    this.destroy$.next();
    this.destroy$.complete();

    return this.drawing;
  }

  process(e: MouseEvent): Drawing | null {
    if (!this.isHandling) {
      return null;
    }

    const scale = this.screenService.Scale;

    const x = e.clientX / scale;
    const y = e.clientY / scale;

    this.points$.next({ x, y });

    return this.drawing;
  }
}
