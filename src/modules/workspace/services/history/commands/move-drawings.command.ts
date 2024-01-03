import { Injector } from "@angular/core";

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

  private drawingsService: DrawingsService;
  private painterService: PainterService;

  constructor(
    public args: MoveDrawingsCommandArgs,
    injector: Injector
  ) {
    this.drawingsService = injector.get(DrawingsService);
    this.painterService = injector.get(PainterService);
  }

  public async exec(): Promise<void> {
    const { drawings, diff } = this.args;

    for (const drawing of drawings) {
      updateDrawingCoordinates(drawing, diff.x, diff.y);
    }

    await this.drawingsService.append(...drawings);

    this.painterService.paint();
  }

  public async undo(): Promise<void> {
    const { drawings, diff } = this.args;

    for (const drawing of drawings) {
      updateDrawingCoordinates(drawing, -diff.x, -diff.y);
    }

    await this.drawingsService.append(...drawings);

    this.painterService.paint();
  }
}
