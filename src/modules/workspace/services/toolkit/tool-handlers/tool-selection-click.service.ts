import { Injectable } from "@angular/core";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";
import { SelectionService } from "@workspace/services/selection/selection.service";

import { findDrawingByPoint } from "@workspace/utils";

import { Point } from "@workspace/interfaces";

import { ToolTextEditService } from "./tool-text-edit.service";

@Injectable()
export class ToolSelectionClickService {
  constructor(
    private screenService: ScreenService,
    private painterService: PainterService,
    private selectionService: SelectionService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private toolTextEditService: ToolTextEditService
  ) {}

  click(e: MouseEvent): void {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    if (e.detail === 1) {
      this.onClick(point);
    }

    if (e.detail === 2) {
      this.onDoubleClick(point);
    }
  }

  private onClick(point: Point) {
    this.selectionService.removeSelection();
    this.drawingsOnSelectionService.removeSelection();

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

    if (drawing) {
      this.drawingsOnSelectionService.addToSelection(drawing);
    }

    this.painterService.paint();
  }

  private onDoubleClick(point: Point) {
    this.toolTextEditService.edit(point);
  }
}
