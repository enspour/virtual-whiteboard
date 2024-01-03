import { SelectableTool, ToolHandlerStage, ToolHandlers } from "..";

export type ToolEvent = {
  tool: SelectableTool["name"];
  stage: ToolHandlerStage;
  event: MouseEvent;
};

export type ToolEventHandlers = ToolHandlers;
