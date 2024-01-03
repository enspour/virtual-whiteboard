import { ChangeDetectorRef, Injectable } from "@angular/core";

import {
  TextEditorMessageClosing,
  TextEditorPosition,
} from "@workspace/components/ui/text-editor/text-editor.interface";
import { TextEditorService } from "@workspace/components/ui/text-editor/text-editor.service";

import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";
import { SelectionService } from "@workspace/services/selection/selection.service";

import { isPointOnDrawing, isPointOnDrawingsSelection } from "@workspace/utils";

import { Drawing, ToolHandler } from "@workspace/interfaces";

import { ToolSelectionMoveService } from "./tool-selection-move.service";
import { ToolSelectionSelectService } from "./tool-selection-select.service";

@Injectable()
export class ToolSelectionService implements ToolHandler {
  private isHandling = false;

  private handler!: ToolHandler;

  private initialX!: number;
  private initialY!: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private screenService: ScreenService,
    private selectionService: SelectionService,
    private painterService: PainterService,
    private toolSelectionSelectService: ToolSelectionSelectService,
    private toolSelectionMoveService: ToolSelectionMoveService,
    private drawingsService: DrawingsService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private textEditorService: TextEditorService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    this.initialX = e.clientX / scale - scroll.x;
    this.initialY = e.clientY / scale - scroll.y;

    const point = { x: this.initialX, y: this.initialY };

    const drawingsOnSelection =
      this.drawingsOnSelectionService.DrawingsOnSelection;

    const coordinates = this.drawingsOnSelectionService.Coordinates;

    if (
      coordinates &&
      isPointOnDrawingsSelection(point, drawingsOnSelection, coordinates)
    ) {
      this.handler = this.toolSelectionMoveService;
      return this.handler.start(e);
    }

    const drawingsOnScreen = this.drawingsOnScreenService.DrawingsOnScreen;

    for (const drawing of drawingsOnScreen) {
      if (isPointOnDrawing(point, drawing)) {
        this.drawingsOnSelectionService.removeSelection();
        this.drawingsOnSelectionService.addToSelection(drawing);

        this.handler = this.toolSelectionMoveService;
        return this.handler.start(e);
      }
    }

    this.handler = this.toolSelectionSelectService;
    this.handler.start(e);
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
      this.onClick(x, y);
    }

    if (e.detail === 2 && x - this.initialX === 0 && y - this.initialY === 0) {
      this.onDoubleClick(x, y);
    }

    this.handler.end(e);
  }

  process(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.handler.process(e);
  }

  private onClick(x: number, y: number) {
    const point = { x, y };

    this.selectionService.removeSelection();
    this.drawingsOnSelectionService.removeSelection();

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = drawings.find((drawing) =>
      isPointOnDrawing(point, drawing)
    );

    if (drawing) {
      this.drawingsOnSelectionService.addToSelection(drawing);
    }

    this.painterService.paint();
  }

  private onDoubleClick(x: number, y: number) {
    const point = { x, y };

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = drawings.find((drawing) =>
      isPointOnDrawing(point, drawing)
    );

    if (!drawing || drawing.type !== "text") {
      return;
    }

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsService.remove(drawing.id);
    this.painterService.paint();

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const position = {
      x: (drawing.coordinates.startX + scroll.x) * scale,
      y: (drawing.coordinates.startY + scroll.y) * scale,
    };

    const options = { ...drawing };

    const textEditor = this.textEditorService.open(
      drawing.text,
      position,
      options
    );

    this.cdRef.detectChanges();

    textEditor.channel$.subscribe((message) => {
      if (message.type === "closing") {
        this.onTextEditorClosing(message, position, drawing);

        textEditor.channel$.complete();
        textEditor.close();
      }
    });
  }

  private onTextEditorClosing(
    message: TextEditorMessageClosing,
    position: TextEditorPosition,
    drawing: Drawing
  ) {
    const { text, width, height } = message;

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = position.x / scale - scroll.x;
    const y = position.y / scale - scroll.y;

    const newDrawing = {
      ...drawing,
      text,
      width,
      height,
      coordinates: {
        startX: x,
        endX: x + width / scale,
        startY: y,
        endY: y + height / scale,
      },
    };

    this.drawingsService.append(newDrawing);

    this.painterService.paint();
  }
}
