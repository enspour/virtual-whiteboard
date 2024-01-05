import { Injectable } from "@angular/core";

import { DrawingsService } from "@workspace/services";

import { Drawing } from "@workspace/interfaces";

@Injectable()
export class DrawingsTrashService {
  private trash = new Set<Drawing>();

  constructor(private drawingsService: DrawingsService) {}

  get Trash() {
    return [...this.trash];
  }

  public append(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.trash.add(drawing);
    }
  }

  public has(drawing: Drawing) {
    return this.trash.has(drawing);
  }

  public clear() {
    const ids = [...this.trash].map((drawing) => drawing.id);

    this.drawingsService.remove(...ids);

    this.trash.clear();
  }
}
