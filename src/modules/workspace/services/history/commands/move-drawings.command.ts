import { Injector } from "@angular/core";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  PainterService,
} from "@workspace/services";

import { updateDrawingCoordinates } from "@workspace/utils";

import {
  Drawing,
  HistoryCommand,
  HistoryCommandName,
  Point,
} from "@workspace/interfaces";

export type MoveDrawingsCommandArgs = {
  drawings: Drawing[];
  diff: Point;
};

export class MoveDrawingsCommand implements HistoryCommand {
  public name: HistoryCommandName = "move-drawings-command";

  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: MoveDrawingsCommandArgs,
    injector: Injector
  ) {
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    const { drawings, diff } = this.args;

    for (const drawing of drawings) {
      updateDrawingCoordinates(drawing, diff.x, diff.y);
    }

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }

  public undo(): void {
    const { drawings, diff } = this.args;

    for (const drawing of drawings) {
      updateDrawingCoordinates(drawing, -diff.x, -diff.y);
    }

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }
}
