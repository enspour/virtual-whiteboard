import { ToolBase } from "./tool-base.interface";

export interface ToolEllipse extends ToolBase {
  name: "ellipse";
  strokeColor: string;
  strokeWidth: number;
}
