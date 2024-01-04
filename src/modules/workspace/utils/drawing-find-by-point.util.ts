import { Drawing, Point } from "@workspace/interfaces";

import { isPointOnDrawing } from "./point-on-drawing.util";

export const findDrawingByPoint = (point: Point, drawings: Drawing[]) =>
  drawings.find((drawing) => isPointOnDrawing(point, drawing));
