import { Injector } from "@angular/core";

import { DrawingsOnSelectionService } from "@workspace/services/drawings/drawings-on-selection.service";
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

  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: RemoveDrawingsCommandArgs,
    injector: Injector
  ) {
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    const ids = this.args.map((drawing) => drawing.id);

    this.drawingsService.remove(...ids);

    this.drawingsOnSelectionService.removeFromSelection(...this.args);

    this.painterService.paint();
  }

  public undo(): void {
    this.drawingsService.append(...this.args);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...this.args);

    this.painterService.paint();
  }
}
