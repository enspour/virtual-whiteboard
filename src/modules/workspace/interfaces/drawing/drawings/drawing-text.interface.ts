import { DrawingBase } from "./drawing-base.interface";

export interface DrawingText extends DrawingBase {
  type: "text";
  text: string;
  textColor: string;
  textSize: number;
  textFamily: string;
  lineHeight: number;
}
