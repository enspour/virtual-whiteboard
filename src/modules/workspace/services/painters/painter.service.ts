import { Injectable, inject } from "@angular/core";

import { Observable, merge, takeUntil } from "rxjs";

import {
  DestroyService,
  PainterBoardService,
  PainterDrawingsService,
  PainterSelectionService,
  ScreenService,
} from "@workspace/services";

import { Painter } from "@workspace/interfaces";

@Injectable()
export class PainterService implements Painter {
  private context?: CanvasRenderingContext2D;

  private requestAnimationFrameId: number = 0;

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private screenService: ScreenService,
    private painterBoardService: PainterBoardService,
    private painterDrawingsService: PainterDrawingsService,
    private painterSelectionService: PainterSelectionService
  ) {
    merge(
      this.screenService.scroll$,
      this.screenService.sizes$,
      this.screenService.scale$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.paint();
      });
  }

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;

    this.painterBoardService.setContext(context);
    this.painterDrawingsService.setContext(context);
    this.painterSelectionService.setContext(context);
  }

  paint() {
    cancelAnimationFrame(this.requestAnimationFrameId);

    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this._paint();
    });
  }

  private _paint() {
    if (!this.context) {
      return;
    }

    const sizes = this.screenService.Sizes;

    const { width, height } = sizes;

    this.context.clearRect(0, 0, width, height);

    this.painterBoardService.paint();
    this.painterDrawingsService.paint();
    this.painterSelectionService.paint();
  }
}
