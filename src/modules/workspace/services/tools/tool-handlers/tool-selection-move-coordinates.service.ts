import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  MoveDrawingsCoordinatesCommand,
  PainterService,
  ScreenService,
  ToolsService,
} from "@workspace/services";

import {
  isSameCoordinates,
  moveCoordinates,
  moveDrawingsCoordinates,
} from "@workspace/utils";

import { Coordinates, Point, ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionMoveCoordinatesService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private startCoordinates!: Coordinates;
  private endCoordinates!: Coordinates;

  private offset!: Point;

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

    this.toolsService.setExecutedTool("selection-move-coordinates");

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const coordinates = this.drawingsOnSelectionService.Coordinates!;

    this.startCoordinates = { ...coordinates };
    this.endCoordinates = { ...coordinates };

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.offset = {
      x: x - coordinates.startX,
      y: y - coordinates.startY,
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

    this.toolsService.setExecutedTool("");

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    const startCoordinates = this.startCoordinates;
    const endCoordinates = this.endCoordinates;

    if (!isSameCoordinates(startCoordinates, endCoordinates)) {
      const args = { drawings, startCoordinates, endCoordinates };
      const command = new MoveDrawingsCoordinatesCommand(args, this.injector);
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
    const start = {
      x: point.x - this.offset.x,
      y: point.y - this.offset.y,
    };

    this.endCoordinates = moveCoordinates(this.endCoordinates, start);

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;
    const drawingsCoordinates = this.drawingsOnSelectionService.Coordinates!;

    moveDrawingsCoordinates(this.endCoordinates, drawings, drawingsCoordinates);

    this.drawingsOnSelectionService.updateCoordinates();

    this.drawingsService.append(...drawings);

    this.painterService.paint();
  }
}
