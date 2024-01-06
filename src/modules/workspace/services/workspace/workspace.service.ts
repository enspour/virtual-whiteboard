import { Injectable } from "@angular/core";

import {
  DrawingsService,
  HistoryService,
  PainterService,
  ScreenService,
  WorkspaceEventsService,
  WorkspaceKeyboardService,
} from "@workspace/services";

@Injectable()
export class WorkspaceService {
  constructor(
    private workspaceKeyboardService: WorkspaceKeyboardService,
    private workspaceEventsService: WorkspaceEventsService,

    private screenService: ScreenService,
    private historyService: HistoryService,
    private painterService: PainterService,
    private drawingsService: DrawingsService
  ) {}

  public async init() {
    await this.screenService.restore();
    await this.historyService.restore();
    await this.drawingsService.restore();
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.workspaceEventsService.setCanvas(canvas);

    const context = canvas.getContext("2d");

    if (context) {
      this.painterService.setContext(context);
    }
  }
}
