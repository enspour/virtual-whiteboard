import { Injectable, NgZone, inject } from "@angular/core";

import { Observable, Subject, fromEvent, takeUntil, throttleTime } from "rxjs";

import { getWheelDirection } from "@workspace/utils";

import { ScreenEvent, ToolkitEvent } from "@workspace/interfaces";

import { DestroyService } from "./destroy.service";

@Injectable()
export class EventsService {
  public screenEvents$ = new Subject<ScreenEvent>();
  public toolkitEvents$ = new Subject<ToolkitEvent>();

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(private zone: NgZone) {}

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
      .pipe(takeUntil(this.destroy$), throttleTime(15))
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
      return this.toolkitEvents$.next({
        tool: "--selected",
        stage: "start",
        event,
      });
    }

    if (event.button === 1) {
      return this.toolkitEvents$.next({
        tool: "hand",
        stage: "start",
        event,
      });
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      return this.toolkitEvents$.next({
        tool: "--selected",
        stage: "end",
        event,
      });
    }

    if (event.button === 1) {
      return this.toolkitEvents$.next({
        tool: "hand",
        stage: "end",
        event,
      });
    }
  }

  private onMouseLeave(event: MouseEvent) {
    if (event.buttons === 1) {
      return this.toolkitEvents$.next({
        tool: "--selected",
        stage: "end",
        event,
      });
    }

    if (event.buttons === 4) {
      return this.toolkitEvents$.next({
        tool: "hand",
        stage: "end",
        event,
      });
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      return this.toolkitEvents$.next({
        tool: "--selected",
        stage: "process",
        event,
      });
    }

    if (event.buttons === 4) {
      return this.toolkitEvents$.next({
        tool: "hand",
        stage: "process",
        event,
      });
    }
  }
}
