import { Injector } from "@angular/core";

import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { PainterService } from "@workspace/services/painters/painter.service";

import {
  Drawing,
  HistoryCommand,
  HistoryCommandName,
} from "@workspace/interfaces";

export type RemoveDrawingsCommandArgs = Drawing[];

export class RemoveDrawingsCommand implements HistoryCommand {
  public name: HistoryCommandName = "remove-drawings-command";

  private drawingsService: DrawingsService;
  private painterService: PainterService;

  constructor(
    public args: RemoveDrawingsCommandArgs,
    injector: Injector
  ) {
    this.drawingsService = injector.get(DrawingsService);
    this.painterService = injector.get(PainterService);
  }

  public async exec(): Promise<void> {
    const ids = this.args.map((drawing) => drawing.id);

    await this.drawingsService.remove(...ids);

    this.painterService.paint();
  }

  public async undo(): Promise<void> {
    await this.drawingsService.append(...this.args);
    this.painterService.paint();
  }
}
