import { isPointOnDrawing } from "@workspace/utils";

import { Drawing, Point } from "@workspace/interfaces";

export const isPointOnDrawings = (point: Point, drawings: Drawing[]) => {
  return drawings.some((drawing) => isPointOnDrawing(point, drawing));
};
