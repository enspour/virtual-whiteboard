import { Tool, ToolHandlerStage, ToolHandlers } from "..";

export type ToolkitEvent = {
  tool: "--selected" | Tool["name"];
  stage: ToolHandlerStage;
  event: MouseEvent;
};

export type ToolkitEventHandlers = ToolHandlers;
