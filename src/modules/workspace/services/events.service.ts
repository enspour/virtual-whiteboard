import { Injectable, NgZone, inject } from "@angular/core";

import { Observable, Subject, fromEvent, takeUntil, throttleTime } from "rxjs";

import { getWheelDirection } from "@workspace/utils";

import {
  ScreenEvent,
  ToolEvent,
  ToolEventNativeEvent,
  ToolEventType,
} from "@workspace/interfaces";

import { MOUSE_MOVE_THROTTLE } from "@workspace/constants";

import { DestroyService } from "./destroy.service";
import { ToolkitService } from "./toolkit/toolkit.service";

@Injectable()
export class EventsService {
  public screenEvents$ = new Subject<ScreenEvent>();
  public toolEvents$ = new Subject<ToolEvent>();

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private zone: NgZone,
    private toolkitService: ToolkitService
  ) {}

  setCanvas(canvas: HTMLCanvasElement) {
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
    this.screenEvents$.next({ type, event });
  }

  private onHorizontalScroll(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scroll left" : "scroll right";
    this.screenEvents$.next({ type, event });
  }

  private onVerticalScroll(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scroll up" : "scroll down";
    this.screenEvents$.next({ type, event });
  }

  private onMouseDown(event: MouseEvent) {
    switch (event.button) {
      case 0:
        return this.emitSelectedToolEvent("start", event);
      case 1:
        return this.emitHandToolEvent("start", event);
    }
  }

  private onMouseUp(event: MouseEvent) {
    switch (event.button) {
      case 0:
        return this.emitSelectedToolEvent("end", event);
      case 1:
        return this.emitHandToolEvent("end", event);
    }
  }

  private onMouseLeave(event: MouseEvent) {
    switch (event.buttons) {
      case 1:
        return this.emitSelectedToolEvent("end", event);
      case 4:
        return this.emitHandToolEvent("end", event);
    }
  }

  private onMouseMove(event: MouseEvent) {
    switch (event.buttons) {
      case 1:
        return this.emitSelectedToolEvent("process", event);
      case 4:
        return this.emitHandToolEvent("process", event);
    }
  }

  private emitSelectedToolEvent(
    type: ToolEventType,
    event: ToolEventNativeEvent
  ) {
    const { name } = this.toolkitService.SelectedTool;
    this.toolEvents$.next({ tool: name, type, event });
  }

  private emitHandToolEvent(type: ToolEventType, event: ToolEventNativeEvent) {
    this.toolEvents$.next({ tool: "hand", type, event });
  }
}
