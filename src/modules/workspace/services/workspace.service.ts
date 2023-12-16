import { Injectable, inject } from "@angular/core";

import { Observable, takeUntil } from "rxjs";

import { ScreenEvent, ScreenEventType } from "@workspace/interfaces";

import { DestroyService } from "./destroy.service";
import { EventsService } from "./events.service";
import { ScreenService } from "./screen.service";

type ScreenEventHandlers = Record<
  ScreenEventType,
  (event: ScreenEvent) => void
>;

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

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private screenService: ScreenService,
    private eventsService: EventsService
  ) {}

  async init() {
    await this.screenService.init();

    this.eventsService.screenEvents
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleScreenEvent(event));
  }

  handleScreenEvent(event: ScreenEvent) {
    this.screenEventHandlers[event.type](event);
  }
}
