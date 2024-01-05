import { Inject, Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { Drawing, DrawingStorage } from "@workspace/interfaces";

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

  public append(...drawings: Drawing[]) {
    let newDrawings = [...this.drawings.value];

    for (const drawing of drawings) {
      const { id } = drawing;

      const index = newDrawings.findIndex((drawing) => drawing.id === id);

      if (index === -1) {
        newDrawings.push(drawing);
      } else {
        newDrawings = [
          ...newDrawings.slice(0, index),
          drawing,
          ...newDrawings.slice(index + 1),
        ];
      }
    }

    this.drawings.next(newDrawings);
    this.drawingStorage.setDrawings(this.drawings.value);
  }

  public remove(...ids: string[]) {
    let count = 0;

    let newDrawings = [...this.drawings.value];

    for (const id of ids) {
      const index = newDrawings.findIndex((drawing) => drawing.id === id);

      if (index !== -1) {
        newDrawings = [
          ...newDrawings.slice(0, index),
          ...newDrawings.slice(index + 1),
        ];

        count += 1;
      }
    }

    if (count) {
      this.drawings.next(newDrawings);
      this.drawingStorage.setDrawings(this.drawings.value);
    }
  }
}
