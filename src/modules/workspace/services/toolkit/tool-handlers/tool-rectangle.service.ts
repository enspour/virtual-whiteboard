import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { nanoid } from "nanoid";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { CreateDrawingCommand } from "@workspace/services/history/commands/create-drawing.command";
import { HistoryService } from "@workspace/services/history/history.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import {
  DrawingRectangle,
  Point,
  ToolHandler,
  ToolRectangle,
} from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolRectangleService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolRectangle;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private drawing!: DrawingRectangle;

  private initialX = 0;
  private initialY = 0;

  constructor(
    private injector: Injector,

    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService,
    private historyService: HistoryService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolkitService.setExecutedTool("rectangle");

    this.tool = this.toolkitService.ExecutedTool! as ToolRectangle;

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
      type: "rectangle",
      angel: 0,
      coordinates: {
        startX: x,
        endX: x,
        startY: y,
        endY: y,
      },
      width: 0,
      height: 0,
      roundness: this.tool.roundness,
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
