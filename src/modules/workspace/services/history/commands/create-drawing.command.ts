import { Injector } from "@angular/core";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  PainterService,
  ToolsService,
} from "@workspace/services";

import {
  Drawing,
  HistoryCommand,
  HistoryCommandName,
} from "@workspace/interfaces";

export type CreateDrawingCommandArgs = Drawing;

export class CreateDrawingCommand implements HistoryCommand {
  public name: HistoryCommandName = "create-drawing-command";

  private toolsService: ToolsService;
  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: CreateDrawingCommandArgs,
    injector: Injector
  ) {
    this.toolsService = injector.get(ToolsService);
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    this.drawingsService.append(this.args);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(this.args);
    }

    this.painterService.paint();
  }

  public undo(): void {
    this.drawingsService.remove(this.args.id);

    this.drawingsOnSelectionService.removeFromSelection(this.args);

    this.painterService.paint();
  }
}
