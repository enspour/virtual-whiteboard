import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { nanoid } from "nanoid";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import {
  DrawingEllipse,
  Point,
  ToolEllipse,
  ToolHandler,
} from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolEllipseService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolEllipse;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private drawing!: DrawingEllipse;

  private firstX = 0;
  private firstY = 0;

  constructor(
    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.tool = this.toolkitService.ExecutedTool! as ToolEllipse;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.firstX = x;
    this.firstY = y;

    this.drawing = {
      id: nanoid(),
      type: "ellipse",
      angel: 0,
      coordinates: {
        startX: x,
        endX: x,
        startY: y,
        endY: y,
      },
      width: 0,
      height: 0,
      strokeColor: this.tool.strokeColor,
      strokeWidth: this.tool.strokeWidth,
    };

    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe((point) => this.handlePoint(point));
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
    const { coordinates } = this.drawing;

    if (this.firstX < point.x) {
      coordinates.startX = this.firstX;
      coordinates.endX = point.x;
    } else {
      coordinates.startX = point.x;
      coordinates.endX = this.firstX;
    }

    if (this.firstY < point.y) {
      coordinates.startY = this.firstY;
      coordinates.endY = point.y;
    } else {
      coordinates.startY = point.y;
      coordinates.endY = this.firstY;
    }

    this.drawing.width = coordinates.endX - coordinates.startX;
    this.drawing.height = coordinates.endY - coordinates.startY;

    this.drawingsService.append(this.drawing);

    this.painterService.paint();
  }
}
