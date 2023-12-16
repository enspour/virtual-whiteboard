import { Drawing, Tool } from "..";

export type ToolHandlerStage = "start" | "end" | "process";

export type ToolHandler = Record<
  ToolHandlerStage,
  (event: MouseEvent) => Drawing | null
>;

export type ToolHandlers = Record<Tool["name"], ToolHandler>;
