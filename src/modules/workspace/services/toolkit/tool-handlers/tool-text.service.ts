import { Inject, Injectable, Injector } from "@angular/core";

import { ReplaySubject } from "rxjs";

import { nanoid } from "nanoid";

import {
  Portal,
  PortalsController,
  portalsControllerToken,
} from "@shared/components/utils/portals";
import { TextEditorComponent } from "@workspace/components/ui/text-editor/text-editor.component";
import { TextEditorChannel } from "@workspace/components/ui/text-editor/text-editor.interface";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { DrawingText, ToolHandler, ToolText } from "@workspace/interfaces";

import { ToolkitService } from "../toolkit.service";

@Injectable()
export class ToolTextService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolText;

  constructor(
    @Inject(portalsControllerToken)
    private portalsController: PortalsController,
    private injector: Injector,
    private screenService: ScreenService,
    private toolkitService: ToolkitService,
    private painterService: PainterService,
    private drawingsService: DrawingsService
  ) {}

  start(e: MouseEvent): void {
    this.isHandling = true;

    this.tool = this.toolkitService.ExecutedTool as ToolText;

    const clientX = e.clientX;
    const clientY = e.clientY;

    const scale = this.screenService.Scale;

    const channel$: TextEditorChannel = new ReplaySubject();

    const portal: Portal = {
      id: nanoid(6),
      type: "component",
      componentType: TextEditorComponent,
      componentInjector: this.injector,
      componentInputs: {
        position: {
          x: clientX,
          y: clientY,
        },
        settings: {
          ...this.tool,
          textSize: this.tool.textSize * scale,
          lineHeight: this.tool.lineHeight * scale,
        },
        channel$,
      },
    };

    channel$.subscribe((message) => {
      if (message.type === "closing") {
        this.portalsController.closePortal("text-editor", portal);

        this.createTextDrawing(
          message.text,
          message.width,
          message.height,
          clientX,
          clientY
        );

        channel$.complete();
      }
    });

    this.portalsController.openPortal("text-editor", portal);
  }

  end(): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;
  }

  process(): void {
    if (!this.isHandling) {
      return;
    }
  }

  private createTextDrawing(
    text: string,
    width: number,
    height: number,
    clientX: number,
    clientY: number
  ) {
    const scroll = this.screenService.Scroll;
    const scale = this.screenService.Scale;

    if (text) {
      const x = clientX / scale - scroll.x;
      const y = clientY / scale - scroll.y;

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
      this.painterService.paint();
    }
  }
}
