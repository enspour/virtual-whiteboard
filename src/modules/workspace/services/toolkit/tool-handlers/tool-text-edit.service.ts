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

import { findDrawingByPoint } from "@workspace/utils";

import { Drawing, Point, ToolHandler } from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolTextEditService implements ToolHandler {
  private isHandling = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService,
    private textEditorService: TextEditorService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  start(): void {
    this.isHandling = true;
  }

  end(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.toolkitService.setExecutedTool("text");

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    const point = { x, y };

    this.edit(point);

    this.toolkitService.setExecutedTool("");
  }

  process(): void {
    if (!this.isHandling) {
      return;
    }
  }

  public edit(point: Point) {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

    if (!drawing || drawing.type !== "text") {
      return;
    }

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsService.remove(drawing.id);
    this.painterService.paint();

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
