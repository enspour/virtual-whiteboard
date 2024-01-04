import { Injectable, Injector } from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { DrawingsTrashService } from "@workspace/services/drawings/drawings-trash.service";
import { RemoveDrawingsCommand } from "@workspace/services/history/commands/remove-drawings.command";
import { HistoryService } from "@workspace/services/history/history.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { isPointOnDrawing } from "@workspace/utils";

import { Point, ToolHandler } from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolEraserService implements ToolHandler {
  private isHandling = false;

  private points$!: Subject<Point>;
  private destroy$!: Subject<void>;

  constructor(
    private injector: Injector,

    private toolkitService: ToolkitService,
    private screenService: ScreenService,
    private painterService: PainterService,
    private historyService: HistoryService,
    private drawingsTrashService: DrawingsTrashService,
    private drawingsOnScreenServices: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolkitService.setExecutedTool("eraser");

    this.points$ = new Subject();
    this.destroy$ = new Subject();

    this.points$
      .pipe(takeUntil(this.destroy$))
      .subscribe((point) => this.handlePoint(point));

    this.nextPoint(e);
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    const drawings = this.drawingsTrashService.Trash;

    this.drawingsTrashService.clear();

    if (drawings.length) {
      const command = new RemoveDrawingsCommand(drawings, this.injector);
      this.historyService.add(command);
    }

    this.drawingsOnSelectionService.removeFromSelection(...drawings);

    this.painterService.paint();

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
    const drawings = this.drawingsOnScreenServices.DrawingsOnScreen;

    for (const drawing of drawings) {
      if (isPointOnDrawing(point, drawing)) {
        this.drawingsTrashService.append(drawing);
      }
    }

    this.painterService.paint();
  }
}
