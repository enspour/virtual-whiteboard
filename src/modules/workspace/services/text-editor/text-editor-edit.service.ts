import { ChangeDetectorRef, Injectable, Injector } from "@angular/core";

import {
  ChangeDrawingCommand,
  DrawingsOnSelectionService,
  DrawingsOnStashService,
  DrawingsService,
  HistoryService,
  PainterService,
  ScreenService,
  TextEditorService,
} from "@workspace/services";

import { DrawingText, TextEditorClosingEvent } from "@workspace/interfaces";

@Injectable()
export class TextEditorEditService {
  constructor(
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
    private screenService: ScreenService,
    private painterService: PainterService,
    private historyService: HistoryService,
    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService,
    private drawingsOnStashService: DrawingsOnStashService,
    private textEditorService: TextEditorService
  ) {}

  public edit(drawing: DrawingText) {
    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnStashService.append(drawing);
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

    textEditor.channel$.subscribe((event) => {
      if (event.type === "closing") {
        this.onTextEditorClosing(event, drawing);

        textEditor.channel$.complete();
        textEditor.close();
      }
    });
  }

  private onTextEditorClosing(
    event: TextEditorClosingEvent,
    drawing: DrawingText
  ) {
    const { text, width, height } = event;

    if (text !== drawing.text) {
      const scroll = this.screenService.Scroll;
      const scale = this.screenService.Scale;

      const x = event.x / scale - scroll.x;
      const y = event.y / scale - scroll.y;

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

      const args = { old: drawing, new: newDrawing };
      const command = new ChangeDrawingCommand(args, this.injector);
      this.historyService.add(command);
    }

    this.drawingsOnStashService.remove(drawing);

    this.painterService.paint();
  }
}
