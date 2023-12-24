import { ToolBase } from "./tool-base.interface";

export interface ToolArrow extends ToolBase {
  name: "arrow";
  strokeColor: string;
  strokeWidth: number;
}
