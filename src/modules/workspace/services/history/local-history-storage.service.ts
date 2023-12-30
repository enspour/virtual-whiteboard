import { Injectable } from "@angular/core";

import {
  HistoryCommand,
  HistoryStorage,
  HistoryStorageData,
} from "@workspace/interfaces";

import {
  LS_HISTORY_COMMANDS,
  LS_HISTORY_POSITION,
  LocalStorageService,
} from "@local-storage";

@Injectable()
export class LocalHistoryStorageService implements HistoryStorage {
  constructor(private localStorageService: LocalStorageService) {}

  async restore(): Promise<HistoryStorageData> {
    const commands = this.localStorageService.get(LS_HISTORY_COMMANDS);
    const position = this.localStorageService.get(LS_HISTORY_POSITION);

    return {
      commands,
      position,
    };
  }

  async update({ commands, position }: HistoryStorageData) {
    this.localStorageService.set(LS_HISTORY_COMMANDS, commands);
    this.localStorageService.set(LS_HISTORY_POSITION, position);
  }

  async setCommands(commands: HistoryCommand[]): Promise<void> {
    this.localStorageService.set(LS_HISTORY_COMMANDS, commands);
  }

  async setPosition(position: number): Promise<void> {
    this.localStorageService.set(LS_HISTORY_POSITION, position);
  }
}
