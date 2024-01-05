import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { nanoid } from "nanoid";

import {
  CreateDrawingCommand,
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  PainterService,
  ScreenService,
  ToolkitService,
} from "@workspace/services";

import {
  DrawingBrush,
  Point,
  ToolBrush,
  ToolHandler,
} from "@workspace/interfaces";

@Injectable()
export class ToolBrushService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolBrush;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private drawing!: DrawingBrush;

  constructor(
    private injector: Injector,

    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private historyService: HistoryService,
    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.drawingsOnSelectionService.removeSelection();

    this.toolkitService.setExecutedTool("brush");

    this.tool = this.toolkitService.ExecutedTool! as ToolBrush;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.drawing = {
      id: nanoid(),
      type: "brush",
      angel: 0,
      coordinates: {
        startX: x,
        endX: x,
        startY: y,
        endY: y,
      },
      width: 0,
      height: 0,
      points: [],
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

    if (this.drawing.width || this.drawing.height) {
      const command = new CreateDrawingCommand(this.drawing, this.injector);
      this.historyService.add(command);
    }

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
    const scroll = this.screenService.Scroll;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    this.points$.next(point);
  }

  private handlePoint(point: Point) {
    this.drawing.points.push(point);

    const { x, y } = point;

    const { coordinates } = this.drawing;

    coordinates.startX = Math.min(coordinates.startX, x);
    coordinates.startY = Math.min(coordinates.startY, y);

    coordinates.endX = Math.max(coordinates.endX, x);
    coordinates.endY = Math.max(coordinates.endY, y);

    this.drawing.width = Math.abs(coordinates.endX - coordinates.startX);
    this.drawing.height = Math.abs(coordinates.endY - coordinates.startY);

    this.drawingsService.append(this.drawing);

    this.painterService.paint();
  }
}
