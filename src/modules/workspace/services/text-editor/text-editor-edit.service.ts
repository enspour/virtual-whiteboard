import { ChangeDetectorRef, Injectable, Injector } from "@angular/core";

import {
  ChangeDrawingCommand,
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  PainterService,
  ScreenService,
  TextEditorService,
} from "@workspace/services";

import {
  DrawingText,
  TextEditorChannelEventClosing,
  TextEditorPosition,
} from "@workspace/interfaces";

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
    private textEditorService: TextEditorService
  ) {}

  public edit(drawing: DrawingText) {
    this.drawingsOnSelectionService.removeSelection();
    this.drawingsService.remove(drawing.id); // TODO: hide drawing
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
        this.onTextEditorClosing(event, position, drawing);

        textEditor.channel$.complete();
        textEditor.close();
      }
    });
  }

  private onTextEditorClosing(
    event: TextEditorChannelEventClosing,
    position: TextEditorPosition,
    drawing: DrawingText
  ) {
    const { text, width, height } = event;

    if (drawing.text === text) {
      this.drawingsService.append(drawing);
      this.painterService.paint();
      return;
    }

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

    const args = { old: drawing, new: newDrawing };
    const command = new ChangeDrawingCommand(args, this.injector);
    this.historyService.add(command);

    this.painterService.paint();
  }
}
