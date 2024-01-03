import { SelectableTool } from "..";

export type ToolHandlerStage = "start" | "end" | "process";
export type ToolHandler = Record<ToolHandlerStage, (event: MouseEvent) => void>;
export type ToolHandlers = Record<SelectableTool["name"], ToolHandler>;
