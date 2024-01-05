import { Injectable } from "@angular/core";

import {
  DrawingsOnScreenService,
  DrawingsOnSelectionService,
  ScreenService,
  ToolSelectionClickService,
  ToolSelectionMoveService,
  ToolSelectionSelectService,
} from "@workspace/services";

import {
  findDrawingByPoint,
  isPointOnDrawingsSelection,
} from "@workspace/utils";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionService implements ToolHandler {
  private handler!: ToolHandler;

  constructor(
    private screenService: ScreenService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private toolSelectionSelectService: ToolSelectionSelectService,
    private toolSelectionMoveService: ToolSelectionMoveService,
    private toolSelectionClickService: ToolSelectionClickService
  ) {}

  start(e: MouseEvent): void {
    this.toolSelectionClickService.start(e);

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    const drawingsOnSelection =
      this.drawingsOnSelectionService.DrawingsOnSelection;

    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (isPointOnDrawingsSelection(point, drawingsOnSelection, coordinates)) {
      this.handler = this.toolSelectionMoveService;
      return this.handler.start(e);
    }

    const drawingsOnScreen = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawingsOnScreen);

    if (drawing) {
      this.drawingsOnSelectionService.removeSelection();
      this.drawingsOnSelectionService.addToSelection(drawing);

      this.handler = this.toolSelectionMoveService;
      return this.handler.start(e);
    }

    this.handler = this.toolSelectionSelectService;
    this.handler.start(e);
  }

  end(e: MouseEvent): void {
    this.toolSelectionClickService.end(e);
    this.handler.end(e);
  }

  process(e: MouseEvent): void {
    this.toolSelectionClickService.process(e);
    this.handler.process(e);
  }
}
