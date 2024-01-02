import { Tool, ToolHandlerStage, ToolHandlers } from "..";

export type ToolEvent = {
  tool: Tool["name"];
  stage: ToolHandlerStage;
  event: MouseEvent;
};

export type ToolEventHandlers = ToolHandlers;
