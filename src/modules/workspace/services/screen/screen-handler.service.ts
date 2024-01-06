import { Injectable } from "@angular/core";

import { ScreenService } from "@workspace/services";

import { ScreenEvent, ScreenEventHandlers } from "@workspace/interfaces";

@Injectable()
export class ScreenHandlerService {
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

  constructor(private screenService: ScreenService) {}

  public handle(event: ScreenEvent) {
    this.screenEventHandlers[event.type](event);
  }
}
