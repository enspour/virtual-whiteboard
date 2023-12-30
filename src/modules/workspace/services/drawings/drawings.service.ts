import { Inject, Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { Drawing, DrawingStorage } from "modules/workspace/interfaces";

import { DrawingStorageToken } from "@workspace/tokens";

@Injectable()
export class DrawingsService {
  private drawings: BehaviorSubject<Drawing[]>;
  public drawings$: Observable<Drawing[]>;

  constructor(
    @Inject(DrawingStorageToken) private drawingStorage: DrawingStorage
  ) {
    this.drawings = new BehaviorSubject<Drawing[]>([]);
    this.drawings$ = this.drawings.asObservable();
  }

  public async restore() {
    const { drawings } = await this.drawingStorage.restore();
    this.drawings.next(drawings);
  }

  public async append(...drawings: Drawing[]) {
    let _drawings = [...this.drawings.value];

    for (const drawing of drawings) {
      const { id } = drawing;

      const index = _drawings.findIndex((drawing) => drawing.id === id);

      if (index === -1) {
        _drawings.push(drawing);
      } else {
        _drawings = [
          ..._drawings.slice(0, index),
          drawing,
          ..._drawings.slice(index + 1),
        ];
      }
    }

    this.drawings.next(_drawings);
    await this.drawingStorage.setDrawings(this.drawings.value);
  }

  public async remove(...ids: string[]) {
    let count = 0;

    let _drawings = [...this.drawings.value];

    for (const id of ids) {
      const index = _drawings.findIndex((drawing) => drawing.id === id);

      if (index !== -1) {
        _drawings = [
          ..._drawings.slice(0, index),
          ..._drawings.slice(index + 1),
        ];

        count += 1;
      }
    }

    if (count) {
      this.drawings.next(_drawings);
      await this.drawingStorage.setDrawings(this.drawings.value);
    }
  }
}
