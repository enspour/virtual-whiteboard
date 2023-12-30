import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { nanoid } from "nanoid";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { CreateDrawingCommand } from "@workspace/services/history/commands/create-drawing.command";
import { HistoryService } from "@workspace/services/history/history.service";
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
    private injector: Injector,

    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService,
    private historyService: HistoryService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

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

    handleAddedDrawingPoint(this.drawing, point);

    this.drawingsService.append(this.drawing);

    this.painterService.paint();
  }
}
