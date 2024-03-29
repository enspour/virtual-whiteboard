import { Injector } from "@angular/core";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  PainterService,
  ToolsService,
} from "@workspace/services";

import { moveDrawingsPoints } from "@workspace/utils";

import {
  HistoryCommand,
  HistoryCommandName,
  Point,
  PointDrawing,
} from "@workspace/interfaces";

export type MoveDrawingsPointsCommandArgs = {
  drawings: PointDrawing[];
  startPoint: Point;
  endPoint: Point;
};

export class MoveDrawingsPointsCommand implements HistoryCommand {
  public name: HistoryCommandName = "move-drawings-points-command";

  private toolsService: ToolsService;
  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: MoveDrawingsPointsCommandArgs,
    injector: Injector
  ) {
    this.toolsService = injector.get(ToolsService);
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    const { drawings, startPoint, endPoint } = this.args;

    moveDrawingsPoints(drawings, startPoint, endPoint);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(...drawings);
    }

    this.painterService.paint();
  }

  public undo(): void {
    const { drawings, startPoint, endPoint } = this.args;

    moveDrawingsPoints(drawings, endPoint, startPoint);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();

    if (this.toolsService.SelectedTool.name === "selection") {
      this.drawingsOnSelectionService.addToSelection(...drawings);
    }

    this.painterService.paint();
  }
}
