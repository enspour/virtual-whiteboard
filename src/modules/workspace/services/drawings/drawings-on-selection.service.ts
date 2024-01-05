import { Injectable, inject } from "@angular/core";

import { combineLatest, takeUntil } from "rxjs";

import {
  DestroyService,
  DrawingsOnScreenService,
  DrawingsService,
  SelectionService,
} from "@workspace/services";

import { Drawing, SelectionCoordinates } from "@workspace/interfaces";

@Injectable()
export class DrawingsOnSelectionService {
  private drawingsOnSelection: Drawing[] = [];

  private coordinates: SelectionCoordinates | null = null;

  private destroy$ = inject(DestroyService, { self: true });

  constructor(
    private selectionService: SelectionService,
    private drawingsService: DrawingsService,
    private drawingsOnScreen: DrawingsOnScreenService
  ) {
    combineLatest([
      this.selectionService.coordinates$,
      this.drawingsService.drawings$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.selectionService.Coordinates) {
          return;
        }

        const drawings = this.drawingsOnScreen.DrawingsOnScreen;

        this.drawingsOnSelection = drawings.filter((drawing) =>
          this.isContains(drawing)
        );

        this.updateCoordinates();
      });
  }

  get DrawingsOnSelection() {
    return this.drawingsOnSelection;
  }

  get Coordinates() {
    return this.coordinates;
  }

  public addToSelection(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnSelection.push(drawing);
      this.updateCoordinatesByDrawing(drawing);
    }
  }

  public removeFromSelection(...drawings: Drawing[]) {
    for (const drawing of drawings) {
      this.drawingsOnSelection = this.drawingsOnSelection.filter(
        (item) => item.id !== drawing.id
      );
    }

    this.updateCoordinates();
  }

  public removeSelection() {
    this.drawingsOnSelection = [];
    this.coordinates = null;
  }

  public updateCoordinates() {
    const drawings = this.drawingsOnSelection;

    if (drawings.length === 0) {
      this.coordinates = null;
      return;
    }

    this.coordinates = { ...drawings[0].coordinates };

    for (let i = 1; i < drawings.length; i++) {
      this.updateCoordinatesByDrawing(drawings[i]);
    }
  }

  private isContains(drawing: Drawing) {
    const selection = this.selectionService.Coordinates;

    if (!selection) {
      return false;
    }

    const startX = drawing.coordinates.startX;
    const startY = drawing.coordinates.startY;
    const endX = drawing.coordinates.endX;
    const endY = drawing.coordinates.endY;

    if (
      selection.startX < startX &&
      selection.startY < startY &&
      selection.endX > endX &&
      selection.endY > endY
    ) {
      return true;
    }

    return false;
  }

  private updateCoordinatesByDrawing(drawing: Drawing) {
    const { coordinates } = drawing;

    if (!this.coordinates) {
      this.coordinates = { ...coordinates };
    } else {
      if (coordinates.startX < this.coordinates.startX) {
        this.coordinates.startX = coordinates.startX;
      }

      if (coordinates.startY < this.coordinates.startY) {
        this.coordinates.startY = coordinates.startY;
      }

      if (coordinates.endX > this.coordinates.endX) {
        this.coordinates.endX = coordinates.endX;
      }

      if (coordinates.endY > this.coordinates.endY) {
        this.coordinates.endY = coordinates.endY;
      }
    }
  }
}
