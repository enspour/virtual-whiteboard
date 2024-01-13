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
  findCoordinatesBorderByPoint,
  findDrawingByPoint,
  findResizerAnchorByPoint,
  isPointOnSelection,
} from "@workspace/utils";

import { ToolHandler } from "@workspace/interfaces";

import { ToolSelectionResizeService } from "./tool-selection-resize.service";

@Injectable()
export class ToolSelectionService implements ToolHandler {
  private isHandling = false;

  private handler!: ToolHandler;

  constructor(
    private screenService: ScreenService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private toolSelectionSelectService: ToolSelectionSelectService,
    private toolSelectionMoveService: ToolSelectionMoveService,
    private toolSelectionClickService: ToolSelectionClickService,
    private toolSelectionResizeService: ToolSelectionResizeService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolSelectionClickService.start(e);

    const drawingsOnSelection =
      this.drawingsOnSelectionService.DrawingsOnSelection;

    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (!coordinates) {
      this.handler = this.toolSelectionSelectService;
      this.handler.start(e);
      return;
    }

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    const anchor = findResizerAnchorByPoint(point, coordinates);

    if (anchor) {
      this.toolSelectionResizeService.setDirection(anchor.direction);

      this.handler = this.toolSelectionResizeService;
      return this.handler.start(e);
    }

    const border = findCoordinatesBorderByPoint(point, coordinates);

    if (border) {
      this.toolSelectionResizeService.setDirection(border.direction);

      this.handler = this.toolSelectionResizeService;
      return this.handler.start(e);
    }

    if (isPointOnSelection(point, drawingsOnSelection, coordinates)) {
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
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.toolSelectionClickService.end(e);
    this.handler.end(e);
  }

  process(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.toolSelectionClickService.process(e);
    this.handler.process(e);
  }
}
