import { Injectable } from "@angular/core";

import {
  DrawingsOnScreenService,
  DrawingsOnSelectionService,
  PainterService,
  ScreenService,
  TextEditorEditService,
} from "@workspace/services";

import { findDrawingByPoint } from "@workspace/utils";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionClickService implements ToolHandler {
  private isHandling = false;

  private initialX!: number;
  private initialY!: number;

  constructor(
    private screenService: ScreenService,
    private painterService: PainterService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private TextEditorEditService: TextEditorEditService
  ) {}

  start(e: MouseEvent) {
    this.isHandling = true;

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    this.initialX = e.clientX / scale - scroll.x;
    this.initialY = e.clientY / scale - scroll.y;
  }

  end(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    if (e.detail === 1 && x - this.initialX === 0 && y - this.initialY === 0) {
      this.onClick(e);
    }

    if (e.detail === 2 && x - this.initialX === 0 && y - this.initialY === 0) {
      this.onDoubleClick(e);
    }
  }

  process(e: MouseEvent) {
    if (!this.isHandling) {
      return;
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
