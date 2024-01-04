import { Injectable } from "@angular/core";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import {
  findDrawingByPoint,
  isPointOnDrawingsSelection,
} from "@workspace/utils";

import { ToolHandler } from "@workspace/interfaces";

import { ToolSelectionClickService } from "./tool-selection-click.service";
import { ToolSelectionMoveService } from "./tool-selection-move.service";
import { ToolSelectionSelectService } from "./tool-selection-select.service";

@Injectable()
export class ToolSelectionService implements ToolHandler {
  private handler!: ToolHandler;

  private initialX!: number;
  private initialY!: number;

  constructor(
    private screenService: ScreenService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private toolSelectionSelectService: ToolSelectionSelectService,
    private toolSelectionMoveService: ToolSelectionMoveService,
    private toolSelectionClickService: ToolSelectionClickService
  ) {}

  start(e: MouseEvent): void {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    this.initialX = e.clientX / scale - scroll.x;
    this.initialY = e.clientY / scale - scroll.y;

    const point = { x: this.initialX, y: this.initialY };

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
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    if (x - this.initialX === 0 && y - this.initialY === 0) {
      this.toolSelectionClickService.click(e);
    }

    this.handler.end(e);
  }

  process(e: MouseEvent): void {
    this.handler.process(e);
  }
}
