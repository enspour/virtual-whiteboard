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

  public async init() {
    const drawings = await this.drawingStorage.getAll();
    this.drawings.next(drawings);
  }

  public async append(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      const { id } = drawing;

      const index = this.drawings.value.findIndex(
        (drawing) => drawing.id === id
      );

      if (index === -1) {
        this.drawings.next([...this.drawings.value, drawing]);
      } else {
        this.drawings.next([
          ...this.drawings.value.slice(0, index),
          drawing,
          ...this.drawings.value.slice(index + 1),
        ]);
      }
    }

    await this.drawingStorage.set(this.drawings.value);
  }

  public async remove(id: Drawing["id"]) {
    const drawings = this.drawings.value;

    const index = drawings.findIndex((drawing) => drawing.id === id);

    if (index !== -1) {
      this.drawings.next([
        ...drawings.slice(0, index),
        ...drawings.slice(index + 1),
      ]);

      await this.drawingStorage.set(this.drawings.value);
    }
  }
}
