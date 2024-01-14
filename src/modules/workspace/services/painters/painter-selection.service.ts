import { Injectable } from "@angular/core";

import { ThemeService } from "@shared";

import {
  DrawingsOnSelectionService,
  ScreenService,
  SelectionService,
} from "@workspace/services";

import { getResizerAnchorsByCoordinates } from "@workspace/utils";

import { Drawing, DrawingArrow, Painter } from "@workspace/interfaces";

import {
  MOVER_ANCHOR_RADIUS,
  RESIZER_ANCHOR_HEIGHT,
  RESIZER_ANCHOR_WIDTH,
} from "@workspace/constants";

@Injectable()
export class PainterSelectionService implements Painter {
  private context?: CanvasRenderingContext2D;

  constructor(
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private selectionService: SelectionService,
    private screenService: ScreenService,
    private themeService: ThemeService
  ) {}

  setContext(context: CanvasRenderingContext2D): void {
    this.context = context;
  }

  paint(): void {
    if (!this.context) {
      return;
    }

    this.paintSelection();
    this.paintDrawingsSelection();
  }

  private paintSelection() {
    if (!this.context || !this.selectionService.Coordinates) {
      return;
    }

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const properties = this.themeService.Properties;

    const bg = properties["--theme-primary-selection-bg"];
    const border = properties["--theme-primary-selection-border"];

    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.strokeStyle = border;
    this.context.fillStyle = bg;

    const coordinates = this.selectionService.Coordinates;
    const sizes = this.selectionService.Sizes;

    const startX = (coordinates.startX + scroll.x) * scale;
    const startY = (coordinates.startY + scroll.y) * scale;

    const width = sizes.width * scale;
    const height = sizes.height * scale;

    this.context.roundRect(startX, startY, width, height);
    this.context.fillRect(startX, startY, width, height);
    this.context.stroke();
  }

  private paintDrawingsSelection() {
    const coordinates = this.drawingsOnSelectionService.Coordinates;
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (!coordinates || drawings.length === 0) {
      return;
    }

    if (drawings.length === 1) {
      this.paintDrawingSelection(drawings[0]);
    } else {
      const { startX, startY, endX, endY } = coordinates;

      for (let i = 0; i < drawings.length; i++) {
        const { coordinates } = drawings[i];

        this.paintBorder(
          coordinates.startX,
          coordinates.startY,
          coordinates.endX,
          coordinates.endY
        );
      }

      this.paintDashedBorder(startX, startY, endX, endY);
      this.paintAnchors(startX, startY, endX, endY);
    }
  }

  private paintDrawingSelection(drawing: Drawing) {
    switch (drawing.type) {
      case "rectangle":
      case "ellipse":
      case "text":
      case "brush": {
        const { coordinates } = drawing;

        this.paintBorder(
          coordinates.startX,
          coordinates.startY,
          coordinates.endX,
          coordinates.endY
        );

        this.paintAnchors(
          coordinates.startX,
          coordinates.startY,
          coordinates.endX,
          coordinates.endY
        );

        return;
      }

      case "arrow": {
        return this.paintDrawingArrowSelection(drawing);
      }
    }
  }

  private paintDrawingArrowSelection(drawing: DrawingArrow) {
    if (!this.context) {
      return;
    }

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const { points } = drawing;

    for (const point of points) {
      const x = (point.x + scroll.x) * scale;
      const y = (point.y + scroll.y) * scale;

      this.paintMoverAnchor(x, y);
    }
  }

  private paintBorder(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    if (!this.context) {
      return;
    }

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    startX = (startX + scroll.x) * scale;
    startY = (startY + scroll.y) * scale;
    endX = (endX + scroll.x) * scale;
    endY = (endY + scroll.y) * scale;

    const width = endX - startX;
    const height = endY - startY;

    const properties = this.themeService.Properties;

    const border = properties["--theme-primary-selection-border"];

    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.strokeStyle = border;

    this.context.roundRect(startX, startY, width, height);

    this.context.stroke();
  }

  private paintDashedBorder(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    if (!this.context) {
      return;
    }

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    startX = (startX + scroll.x) * scale;
    startY = (startY + scroll.y) * scale;
    endX = (endX + scroll.x) * scale;
    endY = (endY + scroll.y) * scale;

    const width = endX - startX;
    const height = endY - startY;

    const properties = this.themeService.Properties;

    const border = properties["--theme-primary-selection-border"];

    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.strokeStyle = border;
    this.context.setLineDash([6]);

    this.context.roundRect(startX, startY, width, height);

    this.context.stroke();

    this.context.setLineDash([0]);
  }

  private paintAnchors(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    startX = (startX + scroll.x) * scale;
    startY = (startY + scroll.y) * scale;
    endX = (endX + scroll.x) * scale;
    endY = (endY + scroll.y) * scale;

    const coordinates = { startX, startY, endX, endY };

    const anchors = getResizerAnchorsByCoordinates(coordinates);

    for (const { x, y } of anchors) {
      this.paintResizerAnchor(x, y);
    }
  }

  private paintResizerAnchor(x: number, y: number) {
    if (!this.context) {
      return;
    }

    const properties = this.themeService.Properties;

    const bg = properties["--theme-primary-board-bg"];
    const border = properties["--theme-primary-selection-border"];

    const width = RESIZER_ANCHOR_WIDTH;
    const height = RESIZER_ANCHOR_HEIGHT;

    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.fillStyle = bg;
    this.context.strokeStyle = border;

    this.context.roundRect(x - width / 2, y - height / 2, width, height);

    this.context.fill();
    this.context.stroke();
  }

  private paintMoverAnchor(x: number, y: number) {
    if (!this.context) {
      return;
    }

    const properties = this.themeService.Properties;

    const bg = properties["--theme-primary-board-bg"];
    const border = properties["--theme-primary-selection-border"];

    const radius = MOVER_ANCHOR_RADIUS;

    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.fillStyle = bg;
    this.context.strokeStyle = border;

    const rotation = 0;

    const startAngle = 0;
    const endAngle = Math.PI * 2;

    this.context.ellipse(x, y, radius, radius, rotation, startAngle, endAngle);

    this.context.fill();
    this.context.stroke();
  }
}
