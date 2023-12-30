import { HistoryCommand } from "./history-command.interface";

export interface HistoryRestoreData {
  commands: HistoryCommand[];
  position: number;
}
