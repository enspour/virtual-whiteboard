import { Injectable, inject } from "@angular/core";

import { Observable, takeUntil } from "rxjs";

import {
  ScreenEvent,
  ScreenEventHandlers,
  ToolkitEvent,
  ToolkitEventHandlers,
} from "@workspace/interfaces";

import { DestroyService } from "./destroy.service";
import { DrawingsService } from "./drawings/drawings.service";
import { EventsService } from "./events.service";
import { HistoryService } from "./history/history.service";
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

  private toolkitEventHandlers: ToolkitEventHandlers = {
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
    private eventsService: EventsService,
    private screenService: ScreenService,
    private historyService: HistoryService,

    private toolkitService: ToolkitService,
    private toolHandService: ToolHandService,
    private toolBrushService: ToolBrushService,
    private toolSelectionService: ToolSelectionService,
    private toolRectangleService: ToolRectangleService,
    private toolEllipseService: ToolEllipseService,
    private toolArrowService: ToolArrowService,
    private toolTextService: ToolTextService,
    private toolEraserService: ToolEraserService,

    private drawingsService: DrawingsService
  ) {}

  async init() {
    await this.screenService.restore();
    await this.historyService.restore();
    await this.drawingsService.restore();

    this.eventsService.screenEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.onScreenEvent(event));

    this.eventsService.toolkitEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.onToolkitEvent(event));
  }

  private onScreenEvent(event: ScreenEvent) {
    this.screenEventHandlers[event.type](event);
  }

  private onToolkitEvent(event: ToolkitEvent) {
    const name =
      event.tool === "--selected"
        ? this.toolkitService.SelectedTool.name
        : event.tool;

    if (event.stage === "start") {
      this.toolkitService.setExecutedTool(name);
    }

    if (event.stage === "end") {
      this.toolkitService.setExecutedTool("");
    }

    this.toolkitEventHandlers[name][event.stage](event.event);
  }
}
