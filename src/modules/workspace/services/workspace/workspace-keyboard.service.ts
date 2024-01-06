import { Injectable, Injector, inject } from "@angular/core";

import { Observable, takeUntil } from "rxjs";

import { AppService } from "@shared";

import {
  DestroyService,
  DrawingsOnSelectionService,
  DrawingsService,
  HistoryService,
  PainterService,
  RemoveDrawingsCommand,
} from "@workspace/services";

@Injectable()
export class WorkspaceKeyboardService {
  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private injector: Injector,

    private appService: AppService,
    private historyService: HistoryService,
    private painterService: PainterService,

    private drawingsService: DrawingsService,
    private drawingsOnSelectionService: DrawingsOnSelectionService
  ) {
    this.appService.delete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onDelete());
  }

  private onDelete() {
    const drawings = this.drawingsOnSelectionService.DrawingsOnSelection;

    if (drawings.length === 0) {
      return;
    }

    const ids = drawings.map((drawing) => drawing.id);

    this.drawingsService.remove(...ids);
    this.drawingsOnSelectionService.removeSelection();

    this.painterService.paint();

    const command = new RemoveDrawingsCommand(drawings, this.injector);
    this.historyService.add(command);
  }
}
