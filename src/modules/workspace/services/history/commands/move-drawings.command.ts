import { Injector } from "@angular/core";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  PainterService,
} from "@workspace/services";

import { resizeDrawings } from "@workspace/utils";

import {
  Coordinates,
  Drawing,
  HistoryCommand,
  HistoryCommandName,
} from "@workspace/interfaces";

export type MoveDrawingsCommandArgs = {
  drawings: Drawing[];
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
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
    const { drawings, startCoordinates, endCoordinates } = this.args;

    resizeDrawings(endCoordinates, drawings, startCoordinates);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }

  public undo(): void {
    const { drawings, startCoordinates, endCoordinates } = this.args;

    resizeDrawings(startCoordinates, drawings, endCoordinates);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }
}
