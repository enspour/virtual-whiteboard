import { ToolBase } from "./tool-base.interface";

export interface ToolRectangle extends ToolBase {
  name: "rectangle";
  roundness: number;
}
