import { DrawingArrow } from "./drawings/drawing-arrow.interface";
import { DrawingBrush } from "./drawings/drawing-brush.interface";
import { DrawingEllipse } from "./drawings/drawing-ellipse.interface";
import { DrawingRectangle } from "./drawings/drawing-rectangle.interface";
import { DrawingText } from "./drawings/drawing-text.interface";

export type Drawing =
  | DrawingBrush
  | DrawingArrow
  | DrawingEllipse
  | DrawingRectangle
  | DrawingText;

export type DrawingType = Drawing["type"];
