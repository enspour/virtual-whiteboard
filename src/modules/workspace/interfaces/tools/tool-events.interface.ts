import { SelectableTool } from "..";

export type ToolEventTool = SelectableTool["name"];
export type ToolEventType = "start" | "end" | "process";
export type ToolEventTypeHandler = (event: ToolEventNativeEvent) => void;

export type ToolEventNativeEvent = MouseEvent;

export type ToolEvent = {
  tool: ToolEventTool;
  type: ToolEventType;
  event: ToolEventNativeEvent;
};

export type ToolHandler = Record<ToolEventType, ToolEventTypeHandler>;
export type ToolHandlers = Record<ToolEventTool, ToolHandler>;
