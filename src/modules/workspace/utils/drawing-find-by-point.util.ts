import { isPointOnDrawing } from "@workspace/utils";

import { Drawing, Point } from "@workspace/interfaces";

export const findDrawingByPoint = (point: Point, drawings: Drawing[]) =>
  drawings.find((drawing) => isPointOnDrawing(point, drawing));
