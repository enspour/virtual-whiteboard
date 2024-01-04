import { Injectable, Injector, inject } from "@angular/core";

import { Observable, merge, takeUntil } from "rxjs";

import { AppService } from "@shared/modules/app/services/app.service";

import {
  ExecutableTool,
  ScreenEvent,
  ScreenEventHandlers,
  ToolEvent,
  ToolEventHandlers,
} from "@workspace/interfaces";

import { DestroyService } from "./destroy.service";
import { DrawingsOnSelectionService } from "./drawings/drawings-on-selection.service";
import { DrawingsService } from "./drawings/drawings.service";
import { EventsService } from "./events.service";
import { RemoveDrawingsCommand } from "./history/commands/remove-drawings.command";
import { HistoryService } from "./history/history.service";
import { PainterService } from "./painters/painter.service";
import { ScreenService } from "./screen/screen.service";
import { ToolArrowService } from "./toolkit/tool-handlers/tool-arrow.service";
import { ToolBrushService } from "./toolkit/tool-handlers/tool-brush.service";
import { ToolEllipseService } from "./toolkit/tool-handlers/tool-ellipse.service";
import { ToolEraserService } from "./toolkit/tool-handlers/tool-eraser.service";
import { ToolHandService } from "./toolkit/tool-handlers/tool-hand.service";
import { ToolRectangleService } from "./toolkit/tool-handlers/tool-rectangle.service";
import { ToolSelectionService } from "./toolkit/tool-handlers/tool-selection.service";
import { ToolTextService } from "./toolkit/tool-handlers/tool-text.service";
import { ToolkitService } from "./toolkit/toolkit.service";

@Injectable()
export class WorkspaceService {
  private screenEventHandlers: ScreenEventHandlers = {
    "scale in": (event) =>
      this.screenService.scaleIn({
        x: event.event.clientX,
        y: event.event.clientY,
      }),

    "scale out": (event) =>
      this.screenService.scaleOut({
        x: event.event.clientX,
        y: event.event.clientY,
      }),

    "scroll up": () => this.screenService.scrollUp(),
    "scroll down": () => this.screenService.scrollDown(),
    "scroll left": () => this.screenService.scrollLeft(),
    "scroll right": () => this.screenService.scrollRight(),
  };

  private toolEventHandlers: ToolEventHandlers = {
    hand: this.toolHandService,
    brush: this.toolBrushService,
    selection: this.toolSelectionService,
    rectangle: this.toolRectangleService,
    ellipse: this.toolEllipseService,
    arrow: this.toolArrowService,
    text: this.toolTextService,
    eraser: this.toolEraserService,
  };

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private injector: Injector,

    private appService: AppService,
    private eventsService: EventsService,
    private screenService: ScreenService,
    private historyService: HistoryService,
    private painterService: PainterService,

    private toolkitService: ToolkitService,
    private toolHandService: ToolHandService,
    private toolBrushService: ToolBrushService,
    private toolSelectionService: ToolSelectionService,
    private toolRectangleService: ToolRectangleService,
    private toolEllipseService: ToolEllipseService,
    private toolArrowService: ToolArrowService,
    private toolTextService: ToolTextService,
    private toolEraserService: ToolEraserService,

    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  async init() {
    await this.screenService.restore();
    await this.historyService.restore();
    await this.drawingsService.restore();

    merge(
      this.screenService.scroll$,
      this.screenService.sizes$,
      this.screenService.scale$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.painterService.paint();
      });

    this.appService.delete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onDelete());

    this.toolkitService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => this.onExecutedTool(tool));

    this.eventsService.screenEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.onScreenEvent(event));

    this.eventsService.toolEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.onToolkitEvent(event));
  }

  private onScreenEvent(event: ScreenEvent) {
    this.screenEventHandlers[event.type](event);
  }

  private onToolkitEvent(event: ToolEvent) {
    this.toolEventHandlers[event.tool][event.stage](event.event);
  }

  private onExecutedTool(tool: ExecutableTool | null) {
    if (tool && tool.isRemoveSelection) {
      this.drawingsOnSelectionService.removeSelection();
    }
  }

  private async onDelete() {
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (drawings.length === 0) {
      return;
    }

    const ids = drawings.map((drawing) => drawing.id);

    this.drawingsService.remove(...ids);

    this.drawingsOnSelectionService.removeSelection();

    this.painterService.paint();

    const command = new RemoveDrawingsCommand(drawings, this.injector);
    this.historyService.add(command);
  }
}
