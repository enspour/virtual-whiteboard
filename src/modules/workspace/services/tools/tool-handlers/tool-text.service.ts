import { Injectable } from "@angular/core";

import {
  DrawingsOnScreenService,
  ScreenService,
  ToolTextCreateService,
  ToolTextEditService,
} from "@workspace/services";

import { findDrawingByPoint } from "@workspace/utils";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolTextService implements ToolHandler {
  private handler!: ToolHandler;

  constructor(
    private screenService: ScreenService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private toolTextCreateService: ToolTextCreateService,
    private toolTextEditService: ToolTextEditService
  ) {}

  start(e: MouseEvent): void {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    const drawingsOnScreen = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawingsOnScreen);

    if (drawing) {
      this.handler = this.toolTextEditService;
      return this.handler.start(e);
    }

    this.handler = this.toolTextCreateService;
    this.handler.start(e);
  }

  end(e: MouseEvent): void {
    this.handler.end(e);
  }

  process(e: MouseEvent): void {
    this.handler.process(e);
  }
}
