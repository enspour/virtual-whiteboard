import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  MoveDrawingsCommand,
  PainterService,
  ScreenService,
  ToolsService,
} from "@workspace/services";

import { updateDrawingCoordinates } from "@workspace/utils";

import { Point, ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionMoveService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private prevPoint!: Point;

  private totalDiff!: Point;

  constructor(
    private injector: Injector,
    private toolsService: ToolsService,
    private screenService: ScreenService,
    private painterService: PainterService,
    private historyService: HistoryService,
    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolsService.setExecutedTool("selection-move");

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.prevPoint = { x, y };

    this.totalDiff = {
      x: 0,
      y: 0,
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

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    const diff = this.totalDiff;

    if (diff.x !== 0 || diff.y !== 0) {
      const args = { drawings, diff };
      const command = new MoveDrawingsCommand(args, this.injector);
      this.historyService.add(command);
    }

    this.toolsService.setExecutedTool("");
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
    const diffX = point.x - this.prevPoint.x;
    const diffY = point.y - this.prevPoint.y;

    this.totalDiff.x += diffX;
    this.totalDiff.y += diffY;

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    for (let i = 0; i < drawings.length; i++) {
      updateDrawingCoordinates(drawings[i], diffX, diffY);
    }

    this.drawingsOnSelectionService.updateCoordinates();

    this.prevPoint = point;

    this.drawingsService.append(...drawings);

    this.painterService.paint();
  }
}
