import { Injectable } from "@angular/core";

import {
  ToolArrowService,
  ToolBrushService,
  ToolEllipseService,
  ToolEraserService,
  ToolHandService,
  ToolRectangleService,
  ToolSelectionService,
  ToolTextService,
} from "@workspace/services";

import { ToolEvent, ToolHandlers } from "@workspace/interfaces";

@Injectable()
export class ToolsHandlerService {
  private toolEventHandlers: ToolHandlers = {
    hand: this.toolHandService,
    brush: this.toolBrushService,
    selection: this.toolSelectionService,
    rectangle: this.toolRectangleService,
    ellipse: this.toolEllipseService,
    arrow: this.toolArrowService,
    text: this.toolTextService,
    eraser: this.toolEraserService,
  };

  constructor(
    private toolHandService: ToolHandService,
    private toolBrushService: ToolBrushService,
    private toolSelectionService: ToolSelectionService,
    private toolRectangleService: ToolRectangleService,
    private toolEllipseService: ToolEllipseService,
    private toolArrowService: ToolArrowService,
    private toolTextService: ToolTextService,
    private toolEraserService: ToolEraserService
  ) {}

  public handle(event: ToolEvent) {
    this.toolEventHandlers[event.tool][event.type](event.event);
  }
}
