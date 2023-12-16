import { Point } from "../point.interface";
import { DrawingBase } from "./drawing-base.interface";

export interface DrawingBrush extends DrawingBase {
  type: "brush";
  points: Point[];
}
