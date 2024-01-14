import { Cursor } from "../cursors.interface";
import { ExecutableTool, SelectableTool } from "./tool.interface";

export type ToolCursor =
  | SelectableTool["name"]
  | `executed--${ExecutableTool["name"]}`;

export type ToolCursors = Record<ToolCursor, Cursor>;
