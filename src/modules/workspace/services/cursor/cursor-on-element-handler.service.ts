import { Injectable } from "@angular/core";

import {
  CursorOnElementService,
  DrawingsOnScreenService,
  DrawingsOnSelectionService,
  ScreenService,
} from "@workspace/services";

import {
  findCoordinatesBorderByPoint,
  findDrawingByPoint,
  findMoverAnchorByPoint,
  findResizerAnchorByPoint,
  isPointOnSelection,
} from "@workspace/utils";

import { Point } from "@workspace/interfaces";

@Injectable()
export class CursorOnElementHandlerService {
  private point!: Point;

  constructor(
    private screenService: ScreenService,
    private cursorOnElementService: CursorOnElementService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private drawingsOnScreenService: DrawingsOnScreenService
  ) {}

  public handle(e: MouseEvent) {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    this.point = { x, y };

    switch (true) {
      case this.onMoverAnchor():
        break;
      case this.onResizerAnchor():
        break;
      case this.onSelectionBorder():
        break;
      case this.onSelection():
        break;
      case this.onDrawing():
        break;
      default:
        this.cursorOnElementService.setElement(null);
    }
  }

  private onMoverAnchor() {
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (drawings.length !== 1) {
      return false;
    }

    const anchor = findMoverAnchorByPoint(this.point, drawings[0]);

    if (anchor) {
      this.cursorOnElementService.setElement({
        type: "mover-anchor",
        anchor,
      });

      return true;
    }

    return false;
  }

  private onResizerAnchor() {
    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (!coordinates) {
      return false;
    }

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (drawings.length === 1 && drawings[0].type === "arrow") {
      return false;
    }

    const anchor = findResizerAnchorByPoint(this.point, coordinates);

    if (anchor) {
      this.cursorOnElementService.setElement({
        type: "resizer-anchor",
        anchor,
      });

      return true;
    }

    return false;
  }

  private onSelectionBorder() {
    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (!coordinates) {
      return false;
    }

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (drawings.length === 1 && drawings[0].type === "arrow") {
      return false;
    }

    const border = findCoordinatesBorderByPoint(this.point, coordinates);

    if (border) {
      this.cursorOnElementService.setElement({
        type: "selection-border",
        border,
      });

      return true;
    }

    return false;
  }

  private onSelection() {
    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (!coordinates) {
      return false;
    }

    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (isPointOnSelection(this.point, drawings, coordinates)) {
      this.cursorOnElementService.setElement({
        type: "selection",
      });

      return true;
    }

    return false;
  }

  private onDrawing() {
    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(this.point, drawings);

    if (drawing) {
      this.cursorOnElementService.setElement({
        type: "drawing",
        drawing,
      });

      return true;
    }

    return false;
  }
}
