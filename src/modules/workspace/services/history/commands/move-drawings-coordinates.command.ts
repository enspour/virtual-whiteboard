import { Injector } from "@angular/core";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  PainterService,
  ToolsService,
} from "@workspace/services";

import { moveDrawingsCoordinates } from "@workspace/utils";

import {
  Coordinates,
  Drawing,
  HistoryCommand,
  HistoryCommandName,
} from "@workspace/interfaces";

export type MoveDrawingsCoordinatesCommandArgs = {
  drawings: Drawing[];
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
};

export class MoveDrawingsCoordinatesCommand implements HistoryCommand {
  public name: HistoryCommandName = "move-drawings-coordinates-command";

  private toolsService: ToolsService;
  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: MoveDrawingsCoordinatesCommandArgs,
    injector: Injector
  ) {
    this.toolsService = injector.get(ToolsService);
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    const { drawings, startCoordinates, endCoordinates } = this.args;

    moveDrawingsCoordinates(endCoordinates, drawings, startCoordinates);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(...drawings);
    }

    this.painterService.paint();
  }

  public undo(): void {
    const { drawings, startCoordinates, endCoordinates } = this.args;

    moveDrawingsCoordinates(startCoordinates, drawings, endCoordinates);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(...drawings);
    }

    this.painterService.paint();
  }
}
