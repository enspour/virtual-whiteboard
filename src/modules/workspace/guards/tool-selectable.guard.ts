import { SelectableTool } from "@workspace/interfaces";

import { SELECTABLE_TOOLS } from "@workspace/constants";

const names: string[] = SELECTABLE_TOOLS.map((tool) => tool.name);

export const isSelectableTool = (tool: unknown): tool is SelectableTool => {
  if (
    tool &&
    typeof tool === "object" &&
    "name" in tool &&
    typeof tool.name === "string" &&
    names.includes(tool.name)
  ) {
    return true;
  }

  return false;
};
