import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { SelectionCoordinates, SelectionSizes } from "@workspace/interfaces";

@Injectable()
export class SelectionService {
  private coordinates: BehaviorSubject<SelectionCoordinates | null>;
  public coordinates$: Observable<SelectionCoordinates | null>;

  private sizes: SelectionSizes = {
    width: 0,
    height: 0,
  };

  constructor() {
    this.coordinates = new BehaviorSubject<SelectionCoordinates | null>(null);
    this.coordinates$ = this.coordinates.asObservable();
  }

  get Sizes() {
    return this.sizes;
  }

  get Coordinates() {
    return this.coordinates.value;
  }

  public select(coordinates: SelectionCoordinates) {
    this.coordinates.next(coordinates);

    this.sizes.width = coordinates.endX - coordinates.startX;
    this.sizes.height = coordinates.endY - coordinates.startY;
  }

  public removeSelection() {
    this.coordinates.next(null);
  }
}
