import { ToolBase } from "./tool-base.interface";

export interface ToolBrush extends ToolBase {
  name: "brush";
  strokeColor: string;
  strokeWidth: number;
}
