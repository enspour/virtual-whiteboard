import { Injectable } from "@angular/core";

import {
  DrawingsOnScreenService,
  ScreenService,
  TextEditorEditService,
  ToolsService,
} from "@workspace/services";

import { findDrawingByPoint } from "@workspace/utils";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolTextEditService implements ToolHandler {
  private isHandling = false;

  constructor(
    private screenService: ScreenService,
    private toolsService: ToolsService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private textEditorEditService: TextEditorEditService
  ) {}

  start(): void {
    this.isHandling = true;
  }

  end(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.toolsService.setExecutedTool("text");

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

    if (drawing && drawing.type === "text") {
      this.textEditorEditService.edit(drawing);
    }

    this.toolsService.setExecutedTool("");
  }

  process(): void {
    if (!this.isHandling) {
      return;
    }
  }
}
