import { Injectable } from "@angular/core";

import { DrawingsService } from "@workspace/services";

import { Drawing } from "@workspace/interfaces";

@Injectable()
export class DrawingsOnTrashService {
  private drawingsOnTrash = new Set<Drawing>();

  constructor(private drawingsService: DrawingsService) {}

  get DrawingsOnTrash() {
    return [...this.drawingsOnTrash];
  }

  public append(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnTrash.add(drawing);
    }
  }

  public has(drawing: Drawing) {
    return this.drawingsOnTrash.has(drawing);
  }

  public clear() {
    const ids = [...this.drawingsOnTrash].map((drawing) => drawing.id);

    this.drawingsService.remove(...ids);

    this.drawingsOnTrash.clear();
  }
}
