import { DrawingBase } from "./drawing-base.interface";

export interface DrawingRectangle extends DrawingBase {
  type: "rectangle";
  roundness: number;
  strokeColor: string;
  strokeWidth: number;
}
