import { Injectable } from "@angular/core";

import {
  DrawingsOnScreenService,
  DrawingsOnSelectionService,
  PainterService,
  ScreenService,
  TextEditorEditService,
} from "@workspace/services";

import { findDrawingByPoint } from "@workspace/utils";

@Injectable()
export class ToolSelectionClickService {
  constructor(
    private screenService: ScreenService,
    private painterService: PainterService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private TextEditorEditService: TextEditorEditService
  ) {}

  click(e: MouseEvent): void {
    if (e.detail === 1) {
      this.onClick(e);
    }

    if (e.detail === 2) {
      this.onDoubleClick(e);
    }
  }

  private onClick(e: MouseEvent) {
    this.drawingsOnSelectionService.removeSelection();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

    if (drawing) {
      this.drawingsOnSelectionService.addToSelection(drawing);
    }

    this.painterService.paint();
  }

  private onDoubleClick(e: MouseEvent) {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

    if (drawing && drawing.type === "text") {
      this.TextEditorEditService.edit(drawing);
    }
  }
}
