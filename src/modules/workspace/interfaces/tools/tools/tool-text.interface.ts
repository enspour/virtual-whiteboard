import { ToolBase } from "./tool-base.interface";

export interface ToolText extends ToolBase {
  name: "text";
  textColor: string;
  textSize: number;
  textFamily: string;
  lineHeight: number;
}
