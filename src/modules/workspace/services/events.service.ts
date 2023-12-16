import { Injectable, inject } from "@angular/core";

import { Observable, Subject, fromEvent, takeUntil } from "rxjs";

import { getWheelDirection } from "@workspace/utils";

import { ScreenEvent } from "@workspace/interfaces";

import { DestroyService } from "./destroy.service";

@Injectable()
export class EventsService {
  public screenEvents = new Subject<ScreenEvent>();

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  setCanvas(canvas: HTMLCanvasElement) {
    fromEvent<WheelEvent>(canvas, "wheel")
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onWheel.bind(this));
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
    this.screenEvents.next({ type, event });
  }

  private onHorizontalScroll(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scroll left" : "scroll right";
    this.screenEvents.next({ type, event });
  }

  private onVerticalScroll(event: WheelEvent) {
    const direction = getWheelDirection(event);
    const type = direction === "forward" ? "scroll up" : "scroll down";
    this.screenEvents.next({ type, event });
  }
}
