import { ExecutableTool, SelectableTool } from "..";

export type Cursor =
  | "auto"
  | "default"
  | "grab"
  | "grabbing"
  | "text"
  | "crosshair"
  | "move"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize";

export type CursorStatus =
  | SelectableTool["name"]
  | `executed--${ExecutableTool["name"]}`;

export type ToolCursors = Record<CursorStatus, Cursor>;
