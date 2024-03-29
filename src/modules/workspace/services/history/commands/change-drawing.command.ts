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

export type ChangeDrawingCommandArgs = {
  old: Drawing;
  new: Drawing;
};

export class ChangeDrawingCommand implements HistoryCommand {
  public name: HistoryCommandName = "change-drawing-command";

  private toolsService: ToolsService;
  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: ChangeDrawingCommandArgs,
    injector: Injector
  ) {
    this.toolsService = injector.get(ToolsService);
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    this.drawingsService.append(this.args.new);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(this.args.new);
    }

    this.painterService.paint();
  }

  public undo(): void {
    this.drawingsService.append(this.args.old);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(this.args.old);
    }

    this.painterService.paint();
  }
}
