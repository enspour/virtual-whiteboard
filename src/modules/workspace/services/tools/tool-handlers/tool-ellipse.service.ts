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
  ToolsService,
} from "@workspace/services";

import {
  DrawingEllipse,
  Point,
  ToolEllipse,
  ToolHandler,
} from "@workspace/interfaces";

@Injectable()
export class ToolEllipseService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolEllipse;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private drawing!: DrawingEllipse;

  private initialX = 0;
  private initialY = 0;

  constructor(
    private injector: Injector,
    private screenService: ScreenService,
    private toolsService: ToolsService,
    private painterService: PainterService,
    private historyService: HistoryService,
    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.drawingsOnSelectionService.removeSelection();

    this.toolsService.setExecutedTool("ellipse");

    this.tool = this.toolsService.ExecutedTool! as ToolEllipse;

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.initialX = x;
    this.initialY = y;

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

    if (this.drawing.width || this.drawing.height) {
      const command = new CreateDrawingCommand(this.drawing, this.injector);
      this.historyService.add(command);
    }

    this.toolsService.setExecutedTool("");

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

    this.drawing.width = coordinates.endX - coordinates.startX;
    this.drawing.height = coordinates.endY - coordinates.startY;

    this.drawingsService.append(this.drawing);

    this.painterService.paint();
  }
}
