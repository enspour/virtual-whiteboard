import { ExecutableTool } from "..";

export type Cursor =
  | "default"
  | "grab"
  | "grabbing"
  | "text"
  | "crosshair"
  | "move";

export type CursorStatus =
  | ExecutableTool["name"]
  | `executed--${ExecutableTool["name"]}`;

export type ToolCursors = Record<CursorStatus, Cursor>;
