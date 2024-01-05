import { Injectable, Injector, inject } from "@angular/core";

import { Observable, merge, takeUntil } from "rxjs";

import { AppService } from "@shared";

import {
  DestroyService,
  DrawingsOnSelectionService,
  DrawingsService,
  EventsService,
  HistoryService,
  PainterService,
  RemoveDrawingsCommand,
  ScreenService,
  ToolArrowService,
  ToolBrushService,
  ToolEllipseService,
  ToolEraserService,
  ToolHandService,
  ToolRectangleService,
  ToolSelectionService,
  ToolTextService,
} from "@workspace/services";

import {
  ScreenEvent,
  ScreenEventHandlers,
  ToolEvent,
  ToolHandlers,
} from "@workspace/interfaces";

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

  private toolEventHandlers: ToolHandlers = {
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
    this.toolEventHandlers[event.tool][event.type](event.event);
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
