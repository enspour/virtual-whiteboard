import { DrawingArrow } from "./drawing-arrow.interface";
import { DrawingBrush } from "./drawing-brush.interface";
import { DrawingEllipse } from "./drawing-ellipse.interface";
import { DrawingRectangle } from "./drawing-rectangle.interface";

export type Drawing =
  | DrawingBrush
  | DrawingArrow
  | DrawingEllipse
  | DrawingRectangle;

export type DrawingType = Drawing["type"];
