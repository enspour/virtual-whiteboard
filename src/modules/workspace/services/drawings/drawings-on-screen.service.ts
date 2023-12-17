import { Injectable, inject } from "@angular/core";

import { combineLatest, takeUntil } from "rxjs";

import { Drawing } from "@workspace/interfaces";

import { DestroyService } from "../destroy.service";
import { ScreenService } from "../screen/screen.service";
import { DrawingsService } from "./drawings.service";

@Injectable()
export class DrawingsOnScreenService {
  private drawingsOnScreen: Drawing[] = [];

  private destroy$ = inject(DestroyService, { self: true });

  constructor(
    private screenService: ScreenService,
    private drawingsService: DrawingsService
  ) {
    combineLatest([
      this.screenService.scroll$,
      this.screenService.sizes$,
      this.screenService.scale$,
      this.drawingsService.drawings$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((args) => {
        const drawings = args[3];

        this.drawingsOnScreen = drawings.filter((drawing) =>
          this.isContains(drawing)
        );
      });
  }

  get DrawingsOnScreen() {
    return this.drawingsOnScreen;
  }

  private isContains(drawing: Drawing) {
    const scroll = this.screenService.Scroll;
    const sizes = this.screenService.Sizes;
    const scale = this.screenService.Scale;

    const startX = drawing.coordinates.startX + scroll.x;
    const startY = drawing.coordinates.startY + scroll.y;

    const endX = drawing.coordinates.endX + scroll.x;
    const endY = drawing.coordinates.endY + scroll.y;

    if (
      startX > sizes.width / scale ||
      startY > sizes.height / scale ||
      endX < 0 ||
      endY < 0
    ) {
      return false;
    }

    return true;
  }
}
