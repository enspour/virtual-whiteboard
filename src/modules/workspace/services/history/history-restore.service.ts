import { Inject, Injectable, Injector } from "@angular/core";

import {
  ChangeDrawingCommand,
  CreateDrawingCommand,
  MoveDrawingsCommand,
  RemoveDrawingsCommand,
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
    "move-drawings-command": (args, injector) =>
      new MoveDrawingsCommand(args, injector),
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
