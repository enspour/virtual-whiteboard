import { Injectable } from "@angular/core";

import {
  CursorOnElementService,
  DrawingsOnSelectionService,
  ToolSelectionClickService,
  ToolSelectionMoveCoordinatesService,
  ToolSelectionMovePointsService,
  ToolSelectionResizeService,
  ToolSelectionSelectService,
} from "@workspace/services";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionService implements ToolHandler {
  private isHandling = false;

  private handler!: ToolHandler;

  constructor(
    private cursorOnElementService: CursorOnElementService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private toolSelectionSelectService: ToolSelectionSelectService,
    private toolSelectionMoveCoordinatesService: ToolSelectionMoveCoordinatesService,
    private toolSelectionMovePointsService: ToolSelectionMovePointsService,
    private toolSelectionClickService: ToolSelectionClickService,
    private toolSelectionResizeService: ToolSelectionResizeService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolSelectionClickService.start(e);

    const element = this.cursorOnElementService.Element;

    if (!element) {
      this.handler = this.toolSelectionSelectService;
      return this.handler.start(e);
    }

    switch (element.type) {
      case "drawing":
        this.drawingsOnSelectionService.removeSelection();
        this.drawingsOnSelectionService.addToSelection(element.drawing);
        this.handler = this.toolSelectionMoveCoordinatesService;
        return this.handler.start(e);
      case "selection":
        this.handler = this.toolSelectionMoveCoordinatesService;
        return this.handler.start(e);
      case "selection-border":
        this.toolSelectionResizeService.setDirection(element.border.direction);
        this.handler = this.toolSelectionResizeService;
        return this.handler.start(e);
      case "resizer-anchor":
        this.toolSelectionResizeService.setDirection(element.anchor.direction);
        this.handler = this.toolSelectionResizeService;
        return this.handler.start(e);
      case "mover-anchor":
        this.toolSelectionMovePointsService.setPoint(element.anchor);
        this.handler = this.toolSelectionMovePointsService;
        return this.handler.start(e);
      default:
        this.handler = this.toolSelectionSelectService;
        return this.handler.start(e);
    }
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
