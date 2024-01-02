import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { SelectionCoordinates, SelectionSizes } from "@workspace/interfaces";

@Injectable()
export class SelectionService {
  private coordinates: BehaviorSubject<SelectionCoordinates>;
  public coordinates$: Observable<SelectionCoordinates>;

  private isSelection = false;

  private sizes: SelectionSizes = {
    width: 0,
    height: 0,
  };

  constructor() {
    const initialCoordinates = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    };

    this.coordinates = new BehaviorSubject(initialCoordinates);
    this.coordinates$ = this.coordinates.asObservable();
  }

  get Sizes() {
    return this.sizes;
  }

  get Coordinates() {
    return this.coordinates.value;
  }

  get IsSelection() {
    return this.isSelection;
  }

  public select(coordinates: SelectionCoordinates) {
    this.isSelection = true;

    this.coordinates.next(coordinates);

    this.sizes.width = coordinates.endX - coordinates.startX;
    this.sizes.height = coordinates.endY - coordinates.startY;
  }

  public removeSelection() {
    this.isSelection = false;

    this.coordinates.next({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    });
  }
}
