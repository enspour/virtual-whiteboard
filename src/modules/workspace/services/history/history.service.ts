import { Inject, Injectable, inject } from "@angular/core";

import { takeUntil } from "rxjs";

import { AppService } from "@shared/modules/app/services/app.service";

import { HistoryStorage, HistoryStorageData } from "@workspace/interfaces";
import { HistoryCommand } from "@workspace/interfaces/history/history-command.interface";

import { HistoryStorageToken } from "@workspace/tokens";

import { DestroyService } from "../destroy.service";
import { HistoryRestoreService } from "./history-restore.service";

@Injectable()
export class HistoryService {
  private commands: HistoryCommand[] = [];
  private position = 0;

  private destroy$ = inject(DestroyService, { self: true });

  constructor(
    @Inject(HistoryStorageToken) private historyStorage: HistoryStorage,
    private historyRestoreService: HistoryRestoreService,
    private appService: AppService
  ) {
    this.appService.undo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.undo());

    this.appService.redo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.redo());
  }

  public async restore() {
    const { commands, position } = await this.historyRestoreService.restore();

    this.commands = commands;
    this.position = position;
  }

  public async exec(command: HistoryCommand) {
    command.exec();

    await this.add(command);
  }

  public async add(command: HistoryCommand) {
    if (this.commands.length !== this.position) {
      this.commands = this.commands.slice(0, this.position);
    }

    this.position += 1;
    this.commands.push(command);

    const data: HistoryStorageData = {
      commands: this.commands.map((command) => ({
        name: command.name,
        args: command.args,
      })),

      position: this.position,
    };

    await this.historyStorage.update(data);
  }

  public async undo() {
    if (this.position === 0) {
      return;
    }

    this.position -= 1;
    this.commands[this.position].undo();

    await this.historyStorage.setPosition(this.position);
  }

  public async redo() {
    if (this.position === this.commands.length) {
      return;
    }

    this.commands[this.position].exec();
    this.position += 1;

    await this.historyStorage.setPosition(this.position);
  }
}
