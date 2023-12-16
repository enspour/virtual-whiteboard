import { Injectable } from "@angular/core";

import { ToolHandler } from "@workspace/interfaces";

@Injectable()
export class ToolEraserService implements ToolHandler {
  private isHandling = false;

  constructor() {}

  start(e: MouseEvent): null {
    this.isHandling = true;
    return null;
  }

  end(e: MouseEvent): null {
    if (!this.isHandling) {
      return null;
    }

    this.isHandling = false;

    return null;
  }

  process(e: MouseEvent): null {
    if (!this.isHandling) {
      return null;
    }

    return null;
  }
}
