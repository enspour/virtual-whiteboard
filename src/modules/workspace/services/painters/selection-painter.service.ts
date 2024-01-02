import { Injectable } from "@angular/core";

import { Painter } from "@workspace/interfaces";

import { ThemeService } from "@theme";

import { DrawingsOnSelectionService } from "../drawings/drawings-on-selection.service";
import { ScreenService } from "../screen/screen.service";
import { SelectionService } from "../selection/selection.service";

@Injectable()
export class SelectionPainterService implements Painter {
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

    if (this.selectionService.IsSelection) {
      this.paintSelection();
    }

    this.paintDrawingsSelection();
  }

  private paintSelection() {
    if (!this.context) {
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
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (drawings.length === 0) {
      return;
    }

    if (drawings.length === 1) {
      const { coordinates } = drawings[0];

      this.paintOneSelection(
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
    } else {
      let startX = drawings[0].coordinates.startX;
      let startY = drawings[0].coordinates.startY;
      let endX = drawings[0].coordinates.endX;
      let endY = drawings[0].coordinates.endY;

      for (let i = 0; i < drawings.length; i++) {
        const { coordinates } = drawings[i];

        this.paintOneSelection(
          coordinates.startX,
          coordinates.startY,
          coordinates.endX,
          coordinates.endY
        );

        if (coordinates.startX < startX) {
          startX = coordinates.startX;
        }

        if (coordinates.startY < startY) {
          startY = coordinates.startY;
        }

        if (coordinates.endX > endX) {
          endX = coordinates.endX;
        }

        if (coordinates.endY > endY) {
          endY = coordinates.endY;
        }
      }

      this.paintMultipleSelection(startX, startY, endX, endY);
      this.paintAnchors(startX, startY, endX, endY);
    }
  }

  private paintOneSelection(
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

  private paintMultipleSelection(
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

    const width = endX - startX;
    const height = endY - startY;

    this.paintAnchor(startX, startY);
    this.paintAnchor(endX, startY);
    this.paintAnchor(endX, endY);
    this.paintAnchor(startX, endY);

    this.paintAnchor(startX + width / 2, startY);
    this.paintAnchor(endX, startY + height / 2);
    this.paintAnchor(startX + width / 2, endY);
    this.paintAnchor(startX, startY + height / 2);
  }

  private paintAnchor(x: number, y: number) {
    if (!this.context) {
      return;
    }

    const properties = this.themeService.Properties;

    const bg = properties["--theme-primary-board-bg"];

    const width = 8;
    const height = 8;

    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.fillStyle = bg;

    this.context.roundRect(x - width / 2, y - height / 2, width, height);

    this.context.fill();
    this.context.stroke();
  }
}
