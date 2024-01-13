import {
  isPointOnCoordinates,
  isPointOnDrawingCoordinates,
} from "@workspace/utils";

import { Coordinates, Drawing, Point } from "@workspace/interfaces";

export const isPointOnSelection = (
  point: Point,
  drawings: Drawing[],
  drawingsCoordinates: Coordinates
) => {
  if (drawings.length === 1) {
    if (isPointOnDrawingCoordinates(point, drawings[0])) {
      return true;
    }

    return false;
  } else {
    if (isPointOnCoordinates(point, drawingsCoordinates)) {
      return true;
    }

    return false;
  }
};
