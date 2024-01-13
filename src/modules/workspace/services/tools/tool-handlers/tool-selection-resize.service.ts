import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  PainterService,
  ResizeDrawingsCommand,
  ScreenService,
  ToolsService,
} from "@workspace/services";

import {
  findReflection,
  isSameCoordinates,
  reflectDrawingsByX,
  reflectDrawingsByY,
  resizeCoordinates,
  resizeDrawings,
  validateCoordinates,
} from "@workspace/utils";

import {
  Coordinates,
  Point,
  ResizeDirection,
  ToolHandler,
} from "@workspace/interfaces";

@Injectable()
export class ToolSelectionResizeService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private direction!: ResizeDirection;

  private coordinates!: Coordinates;

  private startCoordinates!: Coordinates;
  private endCoordinates!: Coordinates;

  private startReflection!: Point;
  private endReflection!: Point;

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
    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (!coordinates) {
      return;
    }

    this.isHandling = true;

    this.toolsService.setExecutedTool(`selection-resize-${this.direction}`);

    this.coordinates = { ...coordinates };

    this.startReflection = { x: 0, y: 0 };
    this.endReflection = { x: 0, y: 0 };

    this.startCoordinates = { ...coordinates };
    this.endCoordinates = { ...coordinates };

    this.points$ = new Subject();
    this.destroy$ = new Subject();

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
      const startReflection = this.startReflection;
      const endReflection = this.endReflection;

      const args = {
        drawings,
        startCoordinates,
        endCoordinates,
        startReflection,
        endReflection,
      };

      const command = new ResizeDrawingsCommand(args, this.injector);
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

  public setDirection(direction: ResizeDirection) {
    this.direction = direction;
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
    this.reflect();
    this.resize(point);

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    this.drawingsOnSelectionService.updateCoordinates();

    this.drawingsService.append(...drawings);

    this.painterService.paint();
  }

  private reflect() {
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;
    const drawingsCoordinates = this.drawingsOnSelectionService.Coordinates!;

    const reflection = findReflection(this.coordinates, this.startCoordinates);

    if (
      reflection.x !== this.endReflection.x &&
      (reflection.x === 0 || this.endReflection.x === 0)
    ) {
      reflectDrawingsByX(drawings, drawingsCoordinates);
    }

    if (
      reflection.y !== this.endReflection.y &&
      (reflection.y === 0 || this.endReflection.y === 0)
    ) {
      reflectDrawingsByY(drawings, drawingsCoordinates);
    }

    this.endReflection = reflection;
  }

  private resize(point: Point) {
    this.coordinates = resizeCoordinates(
      this.direction,
      this.coordinates,
      this.startCoordinates,
      point
    );

    this.endCoordinates = validateCoordinates(this.coordinates);

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;
    const drawingsCoordinates = this.drawingsOnSelectionService.Coordinates!;

    resizeDrawings(this.endCoordinates, drawings, drawingsCoordinates);
  }
}
