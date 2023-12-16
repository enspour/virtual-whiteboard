import { Injectable } from "@angular/core";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolEraserService implements ToolHandler {
  private isHandling = false;

  constructor() {}

  start(e: MouseEvent): void {
    this.isHandling = true;
  }

  end(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }

    this.isHandling = false;
  }

  process(e: MouseEvent): void {
    if (!this.isHandling) {
      return;
    }
  }
}
