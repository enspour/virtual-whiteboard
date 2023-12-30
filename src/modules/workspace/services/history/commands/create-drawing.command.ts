import { Injector } from "@angular/core";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";

import {
  Drawing,
  HistoryCommand,
  HistoryCommandName,
} from "@workspace/interfaces";

export type CreateDrawingCommandArgs = Drawing;

export class CreateDrawingCommand implements HistoryCommand {
  public name: HistoryCommandName = "create-drawing-command";

  private drawingsService: DrawingsService;
  private painterService: PainterService;

  constructor(
    public args: CreateDrawingCommandArgs,
    injector: Injector
  ) {
    this.drawingsService = injector.get(DrawingsService);
    this.painterService = injector.get(PainterService);
  }

  public async exec(): Promise<void> {
    await this.drawingsService.append(this.args);
    this.painterService.paint();
  }

  public async undo(): Promise<void> {
    await this.drawingsService.remove(this.args.id);
    this.painterService.paint();
  }
}
