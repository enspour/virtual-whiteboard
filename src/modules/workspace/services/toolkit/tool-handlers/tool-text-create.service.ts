import { Injectable, Injector } from "@angular/core";

import { nanoid } from "nanoid";

import {
  TextEditorMessageClosing,
  TextEditorPosition,
} from "@workspace/components/ui/text-editor/text-editor.interface";
import { TextEditorService } from "@workspace/components/ui/text-editor/text-editor.service";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { CreateDrawingCommand } from "@workspace/services/history/commands/create-drawing.command";
import { HistoryService } from "@workspace/services/history/history.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { DrawingText, ToolHandler, ToolText } from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolTextCreateService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolText;

  constructor(
    private injector: Injector,
    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService,
    private textEditorService: TextEditorService,
    private historyService: HistoryService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.toolkitService.setExecutedTool("text");

    this.tool = this.toolkitService.ExecutedTool as ToolText;

    const text = "";

    const position = {
      x: e.clientX,
      y: e.clientY,
    };

    const options = { ...this.tool };

    const textEditor = this.textEditorService.open(text, position, options);

    textEditor.channel$.subscribe((message) => {
      if (message.type === "closing") {
        this.onTextEditorClosing(message, position);

        textEditor.channel$.complete();
        textEditor.close();
      }
    });
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;

    this.toolkitService.setExecutedTool("");
  }

  process(): void {
    if (!this.isHandling) {
      return;
    }
  }

  private onTextEditorClosing(
    message: TextEditorMessageClosing,
    position: TextEditorPosition
  ) {
    const { text, width, height } = message;

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
        ...this.tool,
      };

      this.drawingsService.append(drawing);

      const command = new CreateDrawingCommand(drawing, this.injector);
      this.historyService.add(command);

      this.painterService.paint();
    }
  }
}
