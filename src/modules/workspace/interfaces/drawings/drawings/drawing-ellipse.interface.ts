import { DrawingBase } from "./drawing-base.interface";

export interface DrawingEllipse extends DrawingBase {
  type: "ellipse";
  strokeColor: string;
  strokeWidth: number;
}
