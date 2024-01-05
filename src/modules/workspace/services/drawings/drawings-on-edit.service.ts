import { Injectable } from "@angular/core";

import { Drawing } from "@workspace/interfaces";

@Injectable()
export class DrawingsOnEditService {
  private drawingsOnEdit = new Set<Drawing>();

  get DrawingsOnEdit() {
    return [...this.drawingsOnEdit];
  }

  public append(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnEdit.add(drawing);
    }
  }

  public remove(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnEdit.delete(drawing);
    }
  }

  public has(drawing: Drawing) {
    return this.drawingsOnEdit.has(drawing);
  }

  public clear() {
    this.drawingsOnEdit.clear();
  }
}
