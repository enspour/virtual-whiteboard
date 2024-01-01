import { Point } from "../../point.interface";
import { DrawingBase } from "./drawing-base.interface";

export interface DrawingArrow extends DrawingBase {
  type: "arrow";
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
}
