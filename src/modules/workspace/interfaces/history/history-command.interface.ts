export type HistoryCommandName =
  | "create-drawing-command"
  | "change-drawing-command"
  | "remove-drawings-command"
  | "move-drawings-coordinates-command"
  | "move-drawings-points-command"
  | "resize-drawings-command";

// eslint-disable-next-line
export interface HistoryCommand<T = any> {
  name: HistoryCommandName;
  args: T;
  exec(): Promise<void> | void;
  undo(): Promise<void> | void;
}
