import { Injectable, NgZone, inject } from "@angular/core";

import { Observable, Subject, fromEvent, takeUntil, throttleTime } from "rxjs";

import { getWheelDirection } from "@workspace/utils";

import { ScreenEvent, ToolEvent } from "@workspace/interfaces";

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
    if (event.button === 0) {
      return this.toolEvents$.next({
        tool: this.toolkitService.SelectedTool.name,
        stage: "start",
        event,
      });
    }

    if (event.button === 1) {
      return this.toolEvents$.next({
        tool: "hand",
        stage: "start",
        event,
      });
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      return this.toolEvents$.next({
        tool: this.toolkitService.SelectedTool.name,
        stage: "end",
        event,
      });
    }

    if (event.button === 1) {
      return this.toolEvents$.next({
        tool: "hand",
        stage: "end",
        event,
      });
    }
  }

  private onMouseLeave(event: MouseEvent) {
    if (event.buttons === 1) {
      return this.toolEvents$.next({
        tool: this.toolkitService.SelectedTool.name,
        stage: "end",
        event,
      });
    }

    if (event.buttons === 4) {
      return this.toolEvents$.next({
        tool: "hand",
        stage: "end",
        event,
      });
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      return this.toolEvents$.next({
        tool: this.toolkitService.SelectedTool.name,
        stage: "process",
        event,
      });
    }

    if (event.buttons === 4) {
      return this.toolEvents$.next({
        tool: "hand",
        stage: "process",
        event,
      });
    }
  }
}
