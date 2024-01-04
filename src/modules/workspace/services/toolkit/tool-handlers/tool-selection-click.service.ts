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

import { findDrawingByPoint } from "@workspace/utils";

import { Drawing } from "@workspace/interfaces";

@Injectable()
export class ToolSelectionClickService {
  constructor(
    private cdRef: ChangeDetectorRef,
    private screenService: ScreenService,
    private painterService: PainterService,
    private selectionService: SelectionService,
    private drawingsService: DrawingsService,
    private textEditorService: TextEditorService,
    private drawingsOnScreenService: DrawingsOnScreenService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {}

  click(e: MouseEvent): void {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    const x = e.clientX / scale - scroll.x;
    const y = e.clientY / scale - scroll.y;

    if (e.detail === 1) {
      this.onClick(x, y);
    }

    if (e.detail === 2) {
      this.onDoubleClick(x, y);
    }
  }

  private onClick(x: number, y: number) {
    const point = { x, y };

    this.selectionService.removeSelection();
    this.drawingsOnSelectionService.removeSelection();

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

    if (drawing) {
      this.drawingsOnSelectionService.addToSelection(drawing);
    }

    this.painterService.paint();
  }

  private onDoubleClick(x: number, y: number) {
    const point = { x, y };

    const drawings = this.drawingsOnScreenService.DrawingsOnScreen;

    const drawing = findDrawingByPoint(point, drawings);

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
