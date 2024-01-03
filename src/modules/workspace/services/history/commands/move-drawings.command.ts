import { Injector } from "@angular/core";

import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";

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

  public async exec(): Promise<void> {
    const { drawings, diff } = this.args;

    for (const drawing of drawings) {
      updateDrawingCoordinates(drawing, diff.x, diff.y);
    }

    await this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }

  public async undo(): Promise<void> {
    const { drawings, diff } = this.args;

    for (const drawing of drawings) {
      updateDrawingCoordinates(drawing, -diff.x, -diff.y);
    }

    await this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }
}
