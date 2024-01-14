import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  MoveDrawingsPointsCommand,
  PainterService,
  ScreenService,
  ToolsService,
} from "@workspace/services";

import { isSamePoints, moveDrawingsPoints } from "@workspace/utils";

import { DrawingArrow, Point, ToolHandler } from "@workspace/interfaces";

import { isDrawingArrow } from "@workspace/guards";

@Injectable()
export class ToolSelectionMovePointsService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private drawings!: DrawingArrow[];

  private startPoint!: Point;
  private endPoint!: Point;

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

    this.toolsService.setExecutedTool("selection-move-points");

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    this.drawings =
      this.drawingsOnSelectionService.DrawingsOnSelection.filter(
        isDrawingArrow
      );

    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe((point) => this.handlePoint(point));
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.toolsService.setExecutedTool("");

    const drawings = this.drawings;
    const startPoint = this.startPoint;
    const endPoint = this.endPoint;

    if (!isSamePoints(startPoint, endPoint)) {
      const args = { drawings, startPoint, endPoint };
      const command = new MoveDrawingsPointsCommand(args, this.injector);
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

  public setPoint(point: Point) {
    this.startPoint = { ...point };
    this.endPoint = { ...point };
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
    moveDrawingsPoints(this.drawings, this.endPoint, point);

    this.endPoint = point;

    this.drawingsOnSelectionService.updateCoordinates();

    this.drawingsService.append(...this.drawings);

    this.painterService.paint();
  }
}
