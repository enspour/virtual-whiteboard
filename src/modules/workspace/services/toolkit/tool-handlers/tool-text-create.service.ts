import { Injectable } from "@angular/core";

import { TextEditorCreateService, ToolkitService } from "@workspace/services";

import { ToolHandler, ToolText } from "@workspace/interfaces";

@Injectable()
export class ToolTextCreateService implements ToolHandler {
  private isHandling = false;

  private tool!: ToolText;

  constructor(
    private toolkitService: ToolkitService,
    private textEditorCreateService: TextEditorCreateService
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

    this.tool = this.toolkitService.ExecutedTool as ToolText;

    const position = {
      x: e.clientX,
      y: e.clientY,
    };

    const options = { ...this.tool };

    this.textEditorCreateService.create(position, options);

    this.toolkitService.setExecutedTool("");
  }

  process(): void {
    if (!this.isHandling) {
      return;
    }
  }
}
