import { Injectable, NgZone, inject } from "@angular/core";

import { Observable, fromEvent, takeUntil, throttleTime } from "rxjs";

import {
  CursorOnElementHandlerService,
  DestroyService,
  ScreenHandlerService,
  ToolsHandlerService,
  ToolsService,
} from "@workspace/services";

import { getWheelDirection } from "@workspace/utils";

import { ToolEventNativeEvent, ToolEventType } from "@workspace/interfaces";

import { MOUSE_MOVE_THROTTLE } from "@workspace/constants";

@Injectable()
export class WorkspaceEventsService {
  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private zone: NgZone,
    private toolsService: ToolsService,
    private toolsHandlerService: ToolsHandlerService,
    private screenHandlerService: ScreenHandlerService,
    private cursorOnElementHandlerService: CursorOnElementHandlerService
  ) {}

  public setCanvas(canvas: HTMLCanvasElement) {
    this.zone.runOutsideAngular(() => {
      this.attachEvents(canvas);
    });
  }

  private attachEvents(canvas: HTMLCanvasElement) {
    fromEvent<WheelEvent>(canvas, "wheel")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onWheel.bind(this));

    fromEvent<MouseEvent>(canvas, "mousedown")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onMouseDown.bind(this));

    fromEvent<MouseEvent>(canvas, "mouseup")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onMouseUp.bind(this));

    fromEvent<MouseEvent>(canvas, "mouseleave")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onMouseLeave.bind(this));

    fromEvent<MouseEvent>(canvas, "mousemove")
      .pipe(takeUntil(this.destroy$), throttleTime(MOUSE_MOVE_THROTTLE))
      .subscribe(this.onMouseMove.bind(this));
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault();

    if (event.ctrlKey) {
      return this.onScaling(event);
    }

    if (event.shiftKey) {
      return this.onHorizontalScroll(event);
    }

    return this.onVerticalScroll(event);
  }

  private onScaling(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scale in" : "scale out";
    this.screenHandlerService.handle({ type, event });
  }

  private onHorizontalScroll(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scroll left" : "scroll right";
    this.screenHandlerService.handle({ type, event });
  }

  private onVerticalScroll(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scroll up" : "scroll down";
    this.screenHandlerService.handle({ type, event });
  }

  private onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.handleSelectedToolEvent("start", event);
    }

    if (event.button === 1) {
      this.handleHandToolEvent("start", event);
    }

    this.cursorOnElementHandlerService.handle(event);
  }

  private onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.handleSelectedToolEvent("end", event);
    }

    if (event.button === 1) {
      this.handleHandToolEvent("end", event);
    }

    this.cursorOnElementHandlerService.handle(event);
  }

  private onMouseLeave(event: MouseEvent) {
    if (event.buttons === 1) {
      this.handleSelectedToolEvent("end", event);
    }

    if (event.buttons === 4) {
      this.handleHandToolEvent("end", event);
    }

    this.cursorOnElementHandlerService.handle(event);
  }

  private onMouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      this.handleSelectedToolEvent("process", event);
    }

    if (event.buttons === 4) {
      this.handleHandToolEvent("process", event);
    }

    this.cursorOnElementHandlerService.handle(event);
  }

  private handleSelectedToolEvent(
    type: ToolEventType,
    event: ToolEventNativeEvent
  ) {
    const { name } = this.toolsService.SelectedTool;
    this.toolsHandlerService.handle({ tool: name, type, event });
  }

  private handleHandToolEvent(
    type: ToolEventType,
    event: ToolEventNativeEvent
  ) {
    this.toolsHandlerService.handle({ tool: "hand", type, event });
  }
}
