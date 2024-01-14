import { Inject, Injectable, Injector } from "@angular/core";

import {
  ChangeDrawingCommand,
  CreateDrawingCommand,
  MoveDrawingsCoordinatesCommand,
  MoveDrawingsPointsCommand,
  RemoveDrawingsCommand,
  ResizeDrawingsCommand,
} from "@workspace/services";

import {
  HistoryCommand,
  HistoryCommandName,
  HistoryRestoreData,
  HistoryStorage,
} from "@workspace/interfaces";

import { HistoryStorageToken } from "@workspace/tokens";

// eslint-disable-next-line
type HistoryCommandCreator = (args: any, injector: Injector) => HistoryCommand;

@Injectable()
export class HistoryRestoreService {
  private commandsFactory: Record<HistoryCommandName, HistoryCommandCreator> = {
    "create-drawing-command": (args, injector) =>
      new CreateDrawingCommand(args, injector),
    "change-drawing-command": (args, injector) =>
      new ChangeDrawingCommand(args, injector),
    "remove-drawings-command": (args, injector) =>
      new RemoveDrawingsCommand(args, injector),
    "resize-drawings-command": (args, injector) =>
      new ResizeDrawingsCommand(args, injector),
    "move-drawings-coordinates-command": (args, injector) =>
      new MoveDrawingsCoordinatesCommand(args, injector),
    "move-drawings-points-command": (args, injector) =>
      new MoveDrawingsPointsCommand(args, injector),
  };

  constructor(
    @Inject(HistoryStorageToken) private historyStorage: HistoryStorage,

    private injector: Injector
  ) {}

  async restore(): Promise<HistoryRestoreData> {
    const { commands, position } = await this.historyStorage.restore();

    return {
      position,
      commands: commands.map((command) =>
        this.commandsFactory[command.name](command.args, this.injector)
      ),
    };
  }
}
