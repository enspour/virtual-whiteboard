import { Injectable } from "@angular/core";

import { Drawing } from "@workspace/interfaces";

@Injectable()
export class DrawingsOnStashService {
  private drawingsOnStash = new Set<Drawing>();

  get DrawingsOnStash() {
    return [...this.drawingsOnStash];
  }

  public append(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnStash.add(drawing);
    }
  }

  public remove(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnStash.delete(drawing);
    }
  }

  public has(drawing: Drawing) {
    return this.drawingsOnStash.has(drawing);
  }

  public clear() {
    this.drawingsOnStash.clear();
  }
}
