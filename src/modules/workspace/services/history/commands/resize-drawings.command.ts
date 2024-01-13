import { Injector } from "@angular/core";

import {
  DrawingsOnSelectionService,
  DrawingsService,
  PainterService,
} from "@workspace/services";

import {
  reflectDrawingsByX,
  reflectDrawingsByY,
  resizeDrawings,
} from "@workspace/utils";

import {
  Coordinates,
  Drawing,
  HistoryCommand,
  HistoryCommandName,
  Point,
} from "@workspace/interfaces";

export type ResizeDrawingsCommandArgs = {
  drawings: Drawing[];
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;
  startReflection: Point;
  endReflection: Point;
};

export class ResizeDrawingsCommand implements HistoryCommand {
  public name: HistoryCommandName = "resize-drawings-command";

  private painterService: PainterService;
  private drawingsService: DrawingsService;
  private drawingsOnSelectionService: DrawingsOnSelectionService;

  constructor(
    public args: ResizeDrawingsCommandArgs,
    injector: Injector
  ) {
    this.painterService = injector.get(PainterService);
    this.drawingsService = injector.get(DrawingsService);
    this.drawingsOnSelectionService = injector.get(DrawingsOnSelectionService);
  }

  public exec(): void {
    const {
      drawings,
      startCoordinates,
      endCoordinates,
      startReflection,
      endReflection,
    } = this.args;

    if (
      startReflection.x !== endReflection.x &&
      (startReflection.x === 0 || endReflection.x === 0)
    ) {
      reflectDrawingsByX(drawings, startCoordinates);
    }

    if (
      startReflection.y !== endReflection.y &&
      (startReflection.y === 0 || endReflection.y === 0)
    ) {
      reflectDrawingsByY(drawings, startCoordinates);
    }

    resizeDrawings(endCoordinates, drawings, startCoordinates);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }

  public undo(): void {
    const {
      drawings,
      startCoordinates,
      endCoordinates,
      startReflection,
      endReflection,
    } = this.args;

    if (
      startReflection.x !== endReflection.x &&
      (startReflection.x === 0 || endReflection.x === 0)
    ) {
      reflectDrawingsByX(drawings, endCoordinates);
    }

    if (
      startReflection.y !== endReflection.y &&
      (startReflection.y === 0 || endReflection.y === 0)
    ) {
      reflectDrawingsByY(drawings, endCoordinates);
    }

    resizeDrawings(startCoordinates, drawings, endCoordinates);

    this.drawingsService.append(...drawings);

    this.drawingsOnSelectionService.removeSelection();
    this.drawingsOnSelectionService.addToSelection(...drawings);

    this.painterService.paint();
  }
}
