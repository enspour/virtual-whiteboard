import { Injectable, inject } from "@angular/core";

import { combineLatest, takeUntil } from "rxjs";

import { Drawing, SelectionCoordinates } from "@workspace/interfaces";

import { DestroyService } from "../destroy.service";
import { SelectionService } from "../selection/selection.service";
import { DrawingsOnScreenService } from "./drawings-on-screen.service";
import { DrawingsService } from "./drawings.service";

@Injectable()
export class DrawingsOnSelectionService {
  private drawingsOnSelection: Drawing[] = [];

  private coordinates: SelectionCoordinates = this.selectionService.Coordinates;

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
        if (this.selectionService.IsSelection) {
          this.coordinates = this.selectionService.Coordinates;
        }

        const drawings = this.drawingsOnScreen.DrawingsOnScreen;

        this.drawingsOnSelection = drawings.filter((drawing) =>
          this.isContains(drawing)
        );
      });
  }

  get DrawingsOnSelection() {
    return this.drawingsOnSelection;
  }

  public add(drawing: Drawing) {
    this.drawingsOnSelection.push(drawing);
  }

  public clear() {
    this.drawingsOnSelection = [];

    this.coordinates = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    };
  }

  private isContains(drawing: Drawing) {
    const selection = this.coordinates;

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
}
