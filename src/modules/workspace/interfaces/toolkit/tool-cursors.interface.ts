import { ExecutableTool } from "..";

export type Cursor =
  | "auto"
  | "grab"
  | "grabbing"
  | "text"
  | "crosshair"
  | "move";

export type CursorName =
  | ExecutableTool["name"]
  | `executed--${ExecutableTool["name"]}`;

export type ToolCursors = Record<CursorName, Cursor>;
