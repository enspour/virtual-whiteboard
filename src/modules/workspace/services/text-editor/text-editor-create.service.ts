import { ChangeDetectorRef, Injectable, Injector } from "@angular/core";

import { nanoid } from "nanoid";

import {
  CreateDrawingCommand,
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
  TextEditorOptions,
  TextEditorPosition,
} from "@workspace/interfaces";

@Injectable()
export class TextEditorCreateService {
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

  public create(position: TextEditorPosition, options: TextEditorOptions) {
    this.drawingsOnSelectionService.removeSelection();
    this.painterService.paint();

    const textEditor = this.textEditorService.open("", position, options);

    this.cdRef.detectChanges();

    textEditor.channel$.subscribe((event) => {
      if (event.type === "closing") {
        this.onTextEditorClosing(event, position, options);

        textEditor.channel$.complete();
        textEditor.close();
      }
    });
  }

  private onTextEditorClosing(
    event: TextEditorChannelEventClosing,
    position: TextEditorPosition,
    options: TextEditorOptions
  ) {
    const { text, width, height } = event;

    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    if (text) {
      const x = position.x / scale - scroll.x;
      const y = position.y / scale - scroll.y;

      const drawing: DrawingText = {
        id: nanoid(),
        type: "text",
        angel: 0,
        coordinates: {
          startX: x,
          endX: x + width / scale,
          startY: y,
          endY: y + height / scale,
        },
        width,
        height,
        text,
        ...options,
      };

      this.drawingsService.append(drawing);

      const command = new CreateDrawingCommand(drawing, this.injector);
      this.historyService.add(command);

      this.painterService.paint();
    }
  }
}
