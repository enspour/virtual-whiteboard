import { Injectable } from "@angular/core";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolTextService implements ToolHandler {
  private isHandling = false;

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
