import { Tool } from "./tool.interface";

export type ToolCursor = "auto" | "grab" | "text" | "crosshair";
export type ToolCursors = Record<Tool["name"], ToolCursor>;