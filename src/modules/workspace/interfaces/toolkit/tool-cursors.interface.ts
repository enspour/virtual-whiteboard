import { Tool } from "..";

export type ToolCursorType =
  | "auto"
  | "grab"
  | "grabbing"
  | "text"
  | "crosshair";

export type ToolCursorName = Tool["name"] | `executed--${Tool["name"]}`;

export type ToolCursors = Record<ToolCursorName, ToolCursorType>;
