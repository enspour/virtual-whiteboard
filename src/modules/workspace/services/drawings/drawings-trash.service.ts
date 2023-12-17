import { Injectable } from "@angular/core";

import { Drawing } from "@workspace/interfaces";

import { DrawingsService } from "./drawings.service";

@Injectable()
export class DrawingsTrashService {
  private trash = new Set<Drawing>();

  constructor(private drawingsService: DrawingsService) {}

  public append(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.trash.add(drawing);
    }
  }

  public has(drawing: Drawing) {
    return this.trash.has(drawing);
  }

  public async clear() {
    const ids = [...this.trash].map((drawing) => drawing.id);

    await this.drawingsService.remove(...ids);

    this.trash.clear();
  }
}
