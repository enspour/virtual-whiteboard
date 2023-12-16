import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { nanoid } from "nanoid";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { handleAddedDrawingPoint } from "@workspace/utils";

import {
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
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.tool = this.toolkitService.ExecutedTool! as ToolBrush;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
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
      const sizes = this.screenService.Sizes;
      const scale = this.screenService.Scale;

      this.drawing.points.push({
        x: point.x - scroll.x,
        y: point.y - scroll.y,
      });

      handleAddedDrawingPoint(this.drawing, point, scroll);

      this.drawingsService.append(this.drawing);
      this.painterService.paint(scroll, sizes, scale);
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
