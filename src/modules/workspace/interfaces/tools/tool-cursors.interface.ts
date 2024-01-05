import { ExecutableTool, SelectableTool } from "..";

export type Cursor =
  | "auto"
  | "default"
  | "grab"
  | "grabbing"
  | "text"
  | "crosshair"
  | "move";

export type CursorStatus =
  | SelectableTool["name"]
  | `executed--${ExecutableTool["name"]}`;

export type ToolCursors = Record<CursorStatus, Cursor>;
