import { HistoryCommand } from "./history-command.interface";

export interface HistoryStorageData {
  commands: Pick<HistoryCommand, "name" | "args">[];
  position: number;
}

export interface HistoryStorage {
  restore(): Promise<HistoryStorageData>;
  update(data: HistoryStorageData): Promise<void>;

  setCommands(commands: HistoryCommand[]): Promise<void>;
  setPosition(position: number): Promise<void>;
}
