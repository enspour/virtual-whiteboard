export type HistoryCommandName =
  | "create-drawing-command"
  | "remove-drawings-command";

// eslint-disable-next-line
export interface HistoryCommand<T = any> {
  name: HistoryCommandName;
  args: T;
  exec(): Promise<void> | void;
  undo(): Promise<void> | void;
}
