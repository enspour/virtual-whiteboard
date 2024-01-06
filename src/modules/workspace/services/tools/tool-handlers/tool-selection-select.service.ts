import { Injectable } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import {
  PainterService,
  ScreenService,
  SelectionService,
  ToolsService,
} from "@workspace/services";

import {
  Point,
  SelectionCoordinates,
  ToolHandler,
} from "@workspace/interfaces";

@Injectable()
export class ToolSelectionSelectService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  private initialX!: number;
  private initialY!: number;

  private selection!: SelectionCoordinates;

  constructor(
    private toolsService: ToolsService,
    private screenService: ScreenService,
    private selectionService: SelectionService,
    private painterService: PainterService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolsService.setExecutedTool("selection-select");

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.initialX = x;
    this.initialY = y;

    this.selection = {
      startX: x,
      startY: y,
      endX: x,
      endY: y,
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

    this.selectionService.removeSelection();

    this.painterService.paint();

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
    if (this.initialX < point.x) {
      this.selection.startX = this.initialX;
      this.selection.endX = point.x;
    } else {
      this.selection.startX = point.x;
      this.selection.endX = this.initialX;
    }

    if (this.initialY < point.y) {
      this.selection.startY = this.initialY;
      this.selection.endY = point.y;
    } else {
      this.selection.startY = point.y;
      this.selection.endY = this.initialY;
    }

    this.selectionService.select(this.selection);

    this.painterService.paint();
  }
}
